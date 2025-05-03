package com.ssafy.backend.youth_consultation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ssafy.backend.auth.model.dto.TranscriptionResultDTO;
import com.ssafy.backend.youth_consultation.entity.CounselingLog;
import com.ssafy.backend.youth_consultation.entity.IsolatedYouth;
import com.ssafy.backend.youth_consultation.entity.SurveyProcessStep;
import com.ssafy.backend.youth_consultation.exception.YouthConsultationErrorCode;
import com.ssafy.backend.youth_consultation.exception.YouthConsultationException;
import com.ssafy.backend.youth_consultation.model.dto.request.SpeechRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.SpeechResponseDTO;
import com.ssafy.backend.youth_consultation.repository.CounselingLogRepository;
import com.ssafy.backend.youth_consultation.repository.IsolatedYouthRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.*;
import java.net.URLConnection;
import java.nio.file.Files;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpeechServiceImpl implements SpeechService {
    private final RestTemplate restTemplate;
    private final ExecutorService executorService;
    private final IsolatedYouthRepository isolatedYouthRepository;
    private final CounselingLogRepository counselingLogRepository;
    private final S3AsyncClient s3Client;
    private final S3Utilities s3Utilities;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${openai.api.key}")
    private String apiKey;

    // CLI 명령어(기본: ffmpeg) 또는 절대 경로 설정
    @Value("${openai.ffmpeg.path:ffmpeg}")
    private String ffmpegCmd;

    @Transactional
    public SpeechResponseDTO getGeneralSummarize(SpeechRequestDTO requestDTO) {
        IsolatedYouth isolatedYouth = isolatedYouthRepository.findById(requestDTO.getIsolatedYouthId())
                .orElseThrow(() -> new YouthConsultationException(YouthConsultationErrorCode.NO_MATCH_PERSON));

        TranscriptionResultDTO resultDTO = transcribe(requestDTO.getFile());
        String transcript = resultDTO.getTranscript();
        String client = extractClient(transcript);
        String counselor = extractCounselorContent(transcript);
        String notes = extractNotesAndMemos(transcript);
        String summarize = summarizeText(transcript);

        isolatedYouthRepository.save(
                IsolatedYouth.builder()
                        .id(isolatedYouth.getId())
                        .isolatedScore(isolatedYouth.getIsolatedScore())
                        .economicLevel(isolatedYouth.getEconomicLevel())
                        .personalInfo(isolatedYouth.getPersonalInfo())
                        .economicActivityRecent(isolatedYouth.getEconomicActivityRecent())
                        .isolationLevel(isolatedYouth.getIsolationLevel())
                        .surveyProcessStep(SurveyProcessStep.SELF_DIAGNOSIS)
                        .build()
        );

        counselingLogRepository.save(
                CounselingLog.builder()
                        .fullScript(transcript)
                        .counselorKeyword(counselor)
                        .memoKeyword(notes)
                        .isolatedYouth(isolatedYouth)
                        .clientKeyword(client)
                        .summarize(summarize)
                        .voiceFileUrl(resultDTO.getUploadUrl())
                        .build()
        );

        return SpeechResponseDTO.builder()
                .transcript(transcript)
                .client(client)
                .counselor(counselor)
                .memos(notes)
                .summary(summarize)
                .build();
    }

    @Override
    public void uploadIsolationYouthInfo(MultipartFile file) {
        try {
            File convFile = File.createTempFile("upload-", ".docx");
            file.transferTo(convFile);

            XWPFDocument doc = new XWPFDocument(new FileInputStream(convFile));
//            XWPFTable table = null;

            StringBuilder sb = new StringBuilder("\n[표 내용]\n");

            for (IBodyElement element : doc.getBodyElements()) {
                if (element instanceof XWPFTable) {
                    XWPFTable table = (XWPFTable) element;

                    for (XWPFTableRow row : table.getRows()) {
                        for (XWPFTableCell cell : row.getTableCells()) {
                            sb.append(cell.getText()).append("\t");
                        }
                        sb.append("\n");
                    }
                }
            }

//            Iterator<IBodyElement> docElementsIterator = doc.getBodyElementsIterator();
//            while(docElementsIterator.hasNext()) {
//                IBodyElement docElement = docElementsIterator.next();
//
//                if("TABLE".equalsIgnoreCase(docElement.getElementType().name())) {
//                    List<XWPFTable> xwpfTableList = docElement.getBody().getTables();
//
//                    table = xwpfTableList.get(0);
//                    sb.append(xwpfTableList.get(0));
//                }
//            }

            log.info("[SpeechServiceImpl] uploadIsolationYouthInfo {}", sb);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private TranscriptionResultDTO transcribe(MultipartFile file) {
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

            String path = uploadFile(wav);

            String transcript = executorService.submit(() -> {
                ResponseEntity<String> resp = restTemplate.exchange("https://api.openai.com/v1/audio/transcriptions",
                        HttpMethod.POST, req, String.class);
                JsonNode root = mapper.readTree(resp.getBody());
                return root.get("text")
                        .asText()
                        .trim();
            }).get();

            return TranscriptionResultDTO.builder()
                    .transcript(transcript)
                    .uploadUrl(path)
                    .build();

        } catch (IOException | InterruptedException | ExecutionException e) {
            log.error("[오디오 처리 오류]", e);
            throw new RuntimeException("오디오 처리 실패: " + e.getMessage(), e);
        } finally {
            inputFile.delete();
            outputFile.delete();
        }
    }

    public String uploadFile(Resource resource) throws IOException {
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


    private String getGptAnswer(String systemPrompt, String... userPrompts) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode payload = mapper.createObjectNode();
            payload.put("model", "gpt-3.5-turbo");
            payload.put("temperature", 0.2);
            payload.put("max_tokens", 1000);
            ArrayNode messages = mapper.createArrayNode();

            ObjectNode system = mapper.createObjectNode()
                    .put("role", "system")
                    .put("content", systemPrompt);
            messages.add(system);


            for (String userPrompt : userPrompts) {
                ObjectNode userMsg = mapper.createObjectNode()
                        .put("role", "user")
                        .put("content", userPrompt);
                messages.add(userMsg);
            }

            payload.set("messages", messages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<String> request = new HttpEntity<>(mapper.writeValueAsString(payload), headers);

            return executorService.submit(() -> {
                ResponseEntity<String> resp = restTemplate.postForEntity("https://api.openai.com/v1/chat/completions",
                        request, String.class);
                JsonNode root = mapper.readTree(resp.getBody());
                return root.path("choices")
                        .get(0)
                        .path("message")
                        .path("content")
                        .asText()
                        .trim();
            }).get();

        } catch (Exception e) {
            log.error("[GPT 응답 오류]", e);
            return "";
        }
    }


    private String extractCounselorContent(String text) {
        String systemPrompt = """
                당신은 숙련된 심리 상담 전문가입니다.
                다음 전사에서 실제로 발화된 **상담자(counselor)의 개입**(인사·질문·조언 등)만을 식별하여,
                **가장 중요한 순서대로 최대 5개만**, 번호를 붙여 나열하세요.
                - 발화된 개입이 5개 미만이라면, 실제 개수만큼만 출력합니다. \s
                - 각 항목은 **‘1. 상담자는 …’** 형식으로만 작성해야 합니다. \s
                - 절대 “내담자”에 관한 내용이나, 맥락에 없는 문장은 생성하지 마세요. \s
                """;

        String userPrompt1 = """
                    === 예시 1 전사 ===
                    ‘사람이 많은 곳에 가면 너무 불편해요.’ ‘그 불편함이 언제부터 시작됐는지 설명해 주세요.’ ‘먼저 작은 목표부터 시도해 보는 건 어떨까요?’
                    
                    === 예시 1 응답 ===
                    상담자는 불편함의 시점을 구체적으로 파악하기 위해 질문했습니다,
                    상담자는 안전한 환경에서 단계적 노출을 제안했습니다,
                    상담자는 작은 성취 경험(짧은 산책)을 통해 자기효능감을 높이도록 안내했습니다,
                    상담자는 내담자의 감정 변화를 모니터링할 방법을 제시했습니다,
                    상담자는 비난 없는 지지적 환경 조성을 강조했습니다
                    """;

        String userPrompt2 = """
                === 실제 전사 ===
                """ + text;

        return getGptAnswer(systemPrompt, userPrompt1, userPrompt2);
    }

    private String extractClient(String text) {
        String systemPrompt = """
                    당신은 숙련된 심리 상담 전문가입니다.
                    다음 전사에서 실제로 발화된 내담자(client)의 핵심 키워드를 식별하여,
                    중요도 순서대로 최대 5개만, 번호를 붙여 문장으로 만들어 나열하세요.
                    - 추출 가능한 키워드가 5개 미만이면 실제 개수만큼만 출력합니다.
                    - 각 항목은 '1. 내담자는 ...' 형식으로만 작성하세요.
                    - 전사에 없는 내용을 생성하지 마세요.
                    """;

        String userPrompt1 = """
                    === 예시 1 전사 ===
                    ‘사람이 많은 곳에 가면 너무 불편해요.’ ‘그 불편함이 언제부터 시작됐는지 설명해 주세요.’ ‘먼저 작은 목표부터 시도해 보는 건 어떨까요?’
                    
                    === 예시 1 응답 ===
                    내담자는 사람 많은 장소에서 불편함과 불안함을 느낀다고 표현했습니다,
                    내담자는 고립된 환경에서 시간 흐름을 잊는다고 언급했습니다,
                    내담자는 일에 대한 흥미와 동시에 두려움을 경험하고 있음을 드러냈습니다,
                    내담자는 자신의 능력에 의문을 품으며 낮은 자기효능감을 표현했습니다,
                    내담자는 외부 환경이 정서적 안정에 큰 영향을 미친다고 설명했습니다
                    """;

        String userPrompt2 = """
                === 실제 전사 ===
                """ + text;

        return getGptAnswer(systemPrompt, userPrompt1, userPrompt2);
    }

    private String extractNotesAndMemos(String text) {
        String systemPrompt = """
                    당신은 숙련된 심리 상담 전문가입니다.
                    다음 전사에서 상담 중 발견된 특이사항(감정 급변, 반복 언급, 중대한 고백 등)과
                    상담자가 기록해야 할 주요 관찰 포인트만을 번호 목록으로 정리하세요.
                    - 항목은 최대 5개까지 나열하세요. 실제 항목이 5개 미만이면 그만큼만 출력합니다.
                    - 각 항목은 '1. 내용' 형식으로만 작성하세요.
                    - 전사 밖의 정보를 생성하지 마세요.
                    """;

        String userPrompt1 = """
                    === 예시 1 전사 ===
                    ‘사람이 많은 곳에 가면 너무 불편해요.’ ‘그 불편함이 언제부터 시작됐는지 설명해 주세요.’ ‘먼저 작은 목표부터 시도해 보는 건 어떨까요?’
                    
                    === 예시 1 응답 ===
                    내담자가 사람 많은 환경에서 심한 불안을 호소함,
                    내담자가 고립된 상태에서 일상 리듬 붕괴를 언급함,
                    상담자가 단계적 노출 기법을 제안하며 심리적 안전을 강조함,
                    상담자가 작은 목표 설정을 통해 자기효능감 회복을 유도함,
                    상담자가 지원 프로그램 참여를 권유하며 사회적 연결 강화를 촉진함
                    """;

        String userPrompt2 = """
                === 실제 전사 ===
                """ + text;

        return getGptAnswer(systemPrompt, userPrompt1, userPrompt2);
    }


    private String summarizeText(String text) {
        String systemPrompt = """
                당신은 한국어 전문 조수입니다.
                다음 대화 내용을 간결하고 정확하게 요약하세요.
                 - 누락 없이 핵심 정보를 포함합니다.
                 - 결과는 하나의 문단(2~3문장)으로 작성하세요.
                 - 번호나 추가 형식 없이, 순수 요약문만 출력하세요.
                """;
        String userPrompt = "다음 대화 내용을 한국어로 누락 없이 요약해 주세요:\n" + text;
        return getGptAnswer(systemPrompt, userPrompt);
    }

    private String getExtension(String name) {
        if (name == null || !name.contains(".")) return "";
        return name.substring(name.lastIndexOf("."));
    }
}
