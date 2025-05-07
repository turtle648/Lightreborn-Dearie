package com.ssafy.backend.youth_consultation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ssafy.backend.youth_consultation.exception.YouthConsultationErrorCode;
import com.ssafy.backend.youth_consultation.exception.YouthConsultationException;
import com.ssafy.backend.youth_consultation.model.collector.PeopleInfoCollector;
import com.ssafy.backend.youth_consultation.model.collector.PersonalInfoCollector;
import com.ssafy.backend.youth_consultation.model.collector.SurveyAnswerCollector;
import com.ssafy.backend.youth_consultation.model.context.SurveyContext;
import com.ssafy.backend.youth_consultation.model.context.TranscriptionContext;
import com.ssafy.backend.youth_consultation.model.dto.request.AddScheduleRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.request.PeopleInfoRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.request.SpeechRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.AddScheduleResponseDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.PeopleInfoResponseDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.SpeechResponseDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.SurveyUploadDTO;
import com.ssafy.backend.youth_consultation.model.entity.*;
import com.ssafy.backend.youth_consultation.model.state.CounselingConstants;
import com.ssafy.backend.youth_consultation.model.state.SurveyStepConstants;
import com.ssafy.backend.youth_consultation.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Utilities;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class YouthConsultationServiceImpl implements YouthConsultationService {
    private final RestTemplate restTemplate;
    private final ExecutorService executorService;
    private final S3AsyncClient s3Client;
    private final S3Utilities s3Utilities;
    private final IsolatedYouthRepository isolatedYouthRepository;
    private final CounselingLogRepository counselingLogRepository;
    private final SurveyQuestionRepository surveyQuestionRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;
    private final SurveyVersionRepository surveyVersionRepository;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${openai.api.key}")
    private String apiKey;

    // CLI 명령어(기본: ffmpeg) 또는 절대 경로 설정
    @Value("${openai.ffmpeg.path:ffmpeg}")
    private String ffmpegCmd;

    @Override
    public PeopleInfoResponseDTO searchPeopleInfo(PeopleInfoRequestDTO peopleInfoRequestDTO) {
        SurveyProcessStep surveyProcessStep = SurveyStepConstants.DEFAULT_STEP;
        Pageable pageable = PageRequest.of(peopleInfoRequestDTO.getPageNum(), peopleInfoRequestDTO.getSizeNum());

        Page<IsolatedYouth> isolatedYouthPage = null;

        if(!StringUtils.hasText(peopleInfoRequestDTO.getName())) {
            isolatedYouthPage = isolatedYouthRepository.findBySurveyProcessStep(surveyProcessStep, pageable);
        }

        if(StringUtils.hasText(peopleInfoRequestDTO.getName())) {
            isolatedYouthPage = isolatedYouthRepository.findBySurveyProcessStepAndName(
                    surveyProcessStep,
                    peopleInfoRequestDTO.getName(),
                    pageable
            );
        }

        PeopleInfoCollector peopleInfoCollector = new PeopleInfoCollector(isolatedYouthPage);

        return peopleInfoCollector.getResponseDto();
    }

    @Override
    public AddScheduleResponseDTO addSchedule(Long id, AddScheduleRequestDTO addScheduleRequestDTO) {
        IsolatedYouth isolatedYouth = isolatedYouthRepository.findById(id)
                .orElseThrow(() ->
                        new YouthConsultationException(YouthConsultationErrorCode.NO_MATCH_PERSON)
                );

        CounselingLog log = counselingLogRepository.save(
                CounselingLog.builder()
                        .consultation_date(addScheduleRequestDTO.getDate().atStartOfDay())
                        .isolatedYouth(isolatedYouth)
                        .counselingProcess(CounselingConstants.DEFAULT_STEP)
                        .build()
        );

        return AddScheduleResponseDTO.builder()
                .counseling(log)
                .build();
    }

    @Transactional
    public SpeechResponseDTO getGeneralSummarize(SpeechRequestDTO requestDTO) {
        IsolatedYouth isolatedYouth = isolatedYouthRepository.findById(requestDTO.getIsolatedYouthId())
                .orElseThrow(() -> new YouthConsultationException(YouthConsultationErrorCode.NO_MATCH_PERSON));


        TranscriptionContext transcriptionContext = new TranscriptionContext(
                restTemplate,
                executorService,
                s3Client,
                s3Utilities,
                bucket,
                apiKey,
                ffmpegCmd,
                requestDTO.getFile()
        );

        transcriptionContext.transcribe();

        String transcript = transcriptionContext.getTranscript();
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
                        .voiceFileUrl(transcriptionContext.getUploadUrl())
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
    @Transactional
    public SurveyUploadDTO uploadIsolationYouthInfo(MultipartFile file) {
        try {

            Map<String, SurveyQuestion> questions = getQuestions();

            log.info("[SpeechServiceImpl] 질문 리스트 : {}",questions);

            SurveyContext surveyContext = new SurveyContext(questions, file);

            PersonalInfoCollector personalInfoCollector = surveyContext.getPersonalInfoCollector();
            SurveyAnswerCollector surveyAnswerCollector = surveyContext.getAnswers();

            Optional<PersonalInfo> existPersonalInfo = personalInfoRepository.findByNameAndPhoneNumber(
                    personalInfoCollector.getName(),
                    personalInfoCollector.getPhoneNumber()
            );

            if(existPersonalInfo.isPresent()) {
                Optional<SurveyVersion> surveyVersion = surveyVersionRepository.findTopByPersonalInfoOrderByVersionDesc(existPersonalInfo.get());

                if(surveyVersion.isEmpty()) {
                    SurveyVersion newSurveyVersion = surveyVersionRepository.save(
                            SurveyVersion.builder()
                                    .personalInfo(existPersonalInfo.get())
                                    .build()
                    );

                    surveyAnswerCollector.addVersion(newSurveyVersion);
                }

                surveyVersion.ifPresent(version -> {
                    SurveyVersion newVersion = surveyVersionRepository.save(
                            SurveyVersion.builder()
                                    .version(version.getVersion() + 1L)
                                    .personalInfo(version.getPersonalInfo())
                                    .build()
                    );

                    surveyAnswerCollector.addVersion(newVersion);
                });


            } else {
                PersonalInfo savedPersonalInfo = personalInfoRepository.save(
                        PersonalInfo.builder()
                                .name(personalInfoCollector.getName())
                                .phoneNumber(personalInfoCollector.getPhoneNumber())
                                .emergencyContact(personalInfoCollector.getEmergencyContent())
                                .brithDate(personalInfoCollector.getBirthDate())
                                .build()
                );

                SurveyVersion newSurveyVersion = surveyVersionRepository.save(
                        SurveyVersion.builder()
                                .personalInfo(savedPersonalInfo)
                                .build()
                );

                surveyAnswerCollector.addVersion(newSurveyVersion);
            }

            surveyAnswerRepository.saveAll(surveyAnswerCollector.getAnswers());

            return SurveyUploadDTO.builder()
                    .personalInfo(personalInfoCollector)
                    .answers(surveyAnswerCollector)
                    .build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Map<String, SurveyQuestion> getQuestions() {
        return surveyQuestionRepository.findAll()
                .stream()
                .collect(
                        Collectors.toMap(
                                q -> {
                                    if(q.getQuestionCode().isBlank()) {
                                        return q.getContent();
                                    }
                                    return q.getQuestionCode() + " " + q.getContent();
                                },
                                Function.identity()
                        )
                );
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
}
