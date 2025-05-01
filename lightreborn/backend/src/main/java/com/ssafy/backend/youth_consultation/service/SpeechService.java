package com.ssafy.backend.youth_consultation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpeechService {
    private final RestTemplate restTemplate;

    @Value("${openai.api.key}")
    private String apiKey;

    // CLI 명령어(기본: ffmpeg) 또는 절대 경로 설정
    @Value("${openai.ffmpeg.path:ffmpeg}")
    private String ffmpegCmd;

    public String transcribe(MultipartFile file) {
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

            ResponseEntity<String> resp = restTemplate.exchange(
                    "https://api.openai.com/v1/audio/transcriptions",
                    HttpMethod.POST, req, String.class
            );
            log.info("[Whisper 응답] {}", resp.getBody());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(resp.getBody());
            return root.get("text").asText();
        } catch (IOException | InterruptedException e) {
            log.error("[오디오 처리 오류]", e);
            throw new RuntimeException("오디오 처리 실패: " + e.getMessage(), e);
        } finally {
            inputFile.delete();
            outputFile.delete();
        }
    }

    public String summarizeText(String text) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode payload = mapper.createObjectNode();
            payload.put("model", "gpt-3.5-turbo");
            payload.put("temperature", 0.2);
            payload.put("max_tokens", 1000);
            ArrayNode messages = mapper.createArrayNode();

            // 한국어 요약 전용 시스템 메시지
            ObjectNode system = mapper.createObjectNode()
                    .put("role", "system")
                    .put("content", "당신은 한국어로 대화를 요약하는 전문 조수입니다. 핵심 정보를 빠짐없이 간결하고 자연스럽게 정리하세요.");
            messages.add(system);

            ObjectNode userMsg = mapper.createObjectNode()
                    .put("role", "user")
                    .put("content", "다음 대화 내용을 한국어로 누락 없이 요약해 주세요:\n" + text);
            messages.add(userMsg);

            payload.set("messages", messages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<String> request = new HttpEntity<>(mapper.writeValueAsString(payload), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions",
                    request,
                    String.class
            );

            JsonNode root = mapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText().trim();

        } catch (Exception e) {
            log.error("[요약 오류]", e);
            return "";
        }
    }

    private String getExtension(String name) {
        if (name == null || !name.contains(".")) return "";
        return name.substring(name.lastIndexOf("."));
    }
}
