package com.ssafy.backend.youth_consultation.model.context;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.nio.file.Files;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;

@Slf4j
@Getter
public class TranscriptionContext {
    private final RestTemplate restTemplate;
    private final ExecutorService executorService;
    private final S3AsyncClient s3Client;
    private final S3Utilities s3Utilities;
    private final String bucket;
    private final String apiKey;
    private final String ffmpegCmd;
    private final MultipartFile file;

    private String transcript;
    private String uploadUrl;

    public TranscriptionContext(
            RestTemplate restTemplate,
            ExecutorService executorService,
            S3AsyncClient s3Client,
            S3Utilities s3Utilities,
            String bucket,
            String apiKey,
            String ffmpegCmd,
            MultipartFile file
    ) {
        this.restTemplate = restTemplate;
        this.executorService = executorService;
        this.s3Client = s3Client;
        this.s3Utilities = s3Utilities;
        this.bucket = bucket;
        this.apiKey = apiKey;
        this.ffmpegCmd = ffmpegCmd;
        this.file = file;
    }


    private String getExtension(String name) {
        if (name == null || !name.contains(".")) return "";
        return name.substring(name.lastIndexOf("."));
    }

    public void transcribe() {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어 있습니다.");
        }

        String baseName = UUID.randomUUID().toString();
        File tmpDir = new File(System.getProperty("java.io.tmpdir"));
        File inputFile = new File(tmpDir, baseName + getExtension(file.getOriginalFilename()));
        File outputFile = new File(tmpDir, baseName + ".wav");

        try {
            // 1) MultipartFile → 로컬 파일
            try (FileOutputStream fos = new FileOutputStream(inputFile)) {
                fos.write(file.getBytes());
            }

            // 2) FFmpeg 호출 : WAV 변환 (16kHz mono PCM)
            ProcessBuilder pb = new ProcessBuilder(
                    ffmpegCmd, "-y",
                    "-i", inputFile.getAbsolutePath(),
                    "-ar", "16000",
                    "-ac", "1",
                    "-codec:a", "pcm_s16le",
                    outputFile.getAbsolutePath()
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exit = process.waitFor();
            if (exit != 0) {
                throw new RuntimeException("FFmpeg 변환 실패, exit code=" + exit);
            }

            // 3) 변환된 WAV → ByteArrayResource
            ByteArrayResource wav = new ByteArrayResource(Files.readAllBytes(outputFile.toPath())) {
                @Override
                public String getFilename() { return outputFile.getName(); }
            };

            // 4) Whisper API 요청
            HttpHeaders fileHeaders = new HttpHeaders();
            fileHeaders.setContentDisposition(
                    ContentDisposition.builder("form-data").name("file").filename(wav.getFilename()).build()
            );
            fileHeaders.setContentType(MediaType.parseMediaType("audio/wav"));

            HttpEntity<ByteArrayResource> filePart = new HttpEntity<>(wav, fileHeaders);
            HttpHeaders modelHeaders = new HttpHeaders();
            modelHeaders.setContentDisposition(
                    ContentDisposition.builder("form-data").name("model").build()
            );
            HttpEntity<String> modelPart = new HttpEntity<>("whisper-1", modelHeaders);

            MultiValueMap<String,Object> body = new LinkedMultiValueMap<>();
            body.add("file", filePart);
            body.add("model", modelPart);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBearerAuth(apiKey);

            HttpEntity<MultiValueMap<String,Object>> req = new HttpEntity<>(body, headers);
            ObjectMapper mapper = new ObjectMapper();

            uploadUrl = uploadFile(wav);

            transcript = executorService.submit(() -> {
                ResponseEntity<String> resp = restTemplate.exchange("https://api.openai.com/v1/audio/transcriptions",
                        HttpMethod.POST, req, String.class);
                JsonNode root = mapper.readTree(resp.getBody());
                return root.get("text")
                        .asText()
                        .trim();
            }).get();

        } catch (IOException | InterruptedException | ExecutionException e) {
            log.error("[오디오 처리 오류]", e);
            throw new RuntimeException("오디오 처리 실패: " + e.getMessage(), e);
        } finally {
            inputFile.delete();
            outputFile.delete();
        }
    }

    private String uploadFile(Resource resource) throws IOException {
        String originalName = resource.getFilename();
        String key = UUID.randomUUID() + "_" + originalName;
        long length = resource.contentLength();

        String contentType = URLConnection.guessContentTypeFromName(originalName);
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        PutObjectRequest putReq = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .contentLength(length)
                .build();


        try (InputStream in = resource.getInputStream()) {
            AsyncRequestBody body = AsyncRequestBody.fromInputStream(in, length, executorService);
            s3Client.putObject(putReq, body)
                    .whenComplete((resp, err) -> {
                        if (err != null) {
                            log.error("S3 업로드 실패: bucket={}, key={}", bucket, key, err);
                        }
                    });
        }

        return s3Utilities.getUrl(
                GetUrlRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .build()
        ).toExternalForm();
    }
}
