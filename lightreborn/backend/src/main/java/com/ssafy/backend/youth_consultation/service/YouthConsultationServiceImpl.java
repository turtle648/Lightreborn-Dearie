package com.ssafy.backend.youth_consultation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ssafy.backend.auth.exception.AuthErrorCode;
import com.ssafy.backend.auth.exception.AuthException;
import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.common.utils.parser.ExcelUtils;
import com.ssafy.backend.youth_consultation.exception.YouthConsultationErrorCode;
import com.ssafy.backend.youth_consultation.exception.YouthConsultationException;
import com.ssafy.backend.youth_consultation.model.collector.*;
import com.ssafy.backend.youth_consultation.model.context.SurveyContext;
import com.ssafy.backend.youth_consultation.model.context.TranscriptionContext;
import com.ssafy.backend.youth_consultation.model.dto.request.*;
import com.ssafy.backend.youth_consultation.model.dto.response.*;
import com.ssafy.backend.youth_consultation.model.entity.*;
import com.ssafy.backend.youth_consultation.model.state.CounselingConstants;
import com.ssafy.backend.youth_consultation.model.state.SurveyStepConstants;
import com.ssafy.backend.youth_consultation.model.vo.IsolationYouthVO;
import com.ssafy.backend.youth_consultation.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Utilities;

import javax.sql.DataSource;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
    private final UserRepository userRepository;
    private final DataSource dataSource;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${openai.api.key}")
    private String apiKey;

    // CLI 명령어(기본: ffmpeg) 또는 절대 경로 설정
    @Value("${openai.ffmpeg.path:ffmpeg}")
    private String ffmpegCmd;

    @Override
    public GetCounselingLogsResponseDTO getCounselingLog(int pageNum, int sizeNum) {
        Pageable pageable = PageRequest.of(pageNum, sizeNum, Sort.by("consultationDate").descending());

        Page<CounselingLog> counselingLogPage = counselingLogRepository.findAll(pageable);

        return GetCounselingLogsResponseDTO.builder()
                .currentPage(counselingLogPage.getNumber())
                .totalPages(counselingLogPage.getTotalPages())
                .totalElements(counselingLogPage.getTotalElements())
                .counselingLogs(counselingLogPage.getContent())
                .build();
    }

    @Override
    public GetCounselingLogsResponseDTO getMonthlyCounselingLog(GetMonthlyCounselingLogDTO request) {
        LocalDate now = LocalDate.now();
        LocalDateTime start = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = start.plusMonths(1).minusNanos(1);

        if (request.getYear() != null) {
            start = LocalDate.of(request.getYear(), 1, 1).atStartOfDay();
            end = LocalDate.of(request.getYear(), 12, 31).atTime(LocalTime.MAX);
        }

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

        Page<CounselingLog> counselingLog = counselingLogRepository.findAllByConsultationDateBetween(
                start,
                end,
                pageable
        );

        return GetCounselingLogsResponseDTO.builder()
                .currentPage(counselingLog.getNumber())
                .totalPages(counselingLog.getTotalPages())
                .totalElements(counselingLog.getTotalElements())
                .counselingLogs(counselingLog.getContent())
                .build();
    }

    @Override
    public GetCounselingLogResponseDTO getCounselingLogById(Long id) {
        CounselingLog counselingLog = counselingLogRepository.findById(id)
                .orElseThrow(() ->
                        new YouthConsultationException(
                                YouthConsultationErrorCode.NO_MATCH_COUNSELING
                        )
                );

        return GetCounselingLogResponseDTO.builder()
                .counselingLog(counselingLog)
                .build();
    }

    @Override
    public ExportCounselingLogResponseDTO exportCounselingLogToExcel() {
        String query = """
                        SELECT
                            cl.id AS "상담ID",
                            cl.consultation_date AS "상담일자",
                            cl.summarize AS "요약",
                            cl.client_keyword AS "내담자키워드",
                            cl.counselor_keyword AS "상담사키워드",
                            cl.memo_keyword AS "메모키워드",
                            cl.process_step AS "진행단계",
                            cl.voice_file_url AS "음성파일URL",
                            iy.id AS "청년ID",
                            iy.economic_level AS "경제수준",
                            iy.isolation_level AS "고립수준",
                            iy.isolated_score AS "고립점수",
                            iy.economic_activity_recent AS "최근경제활동",
                            iy.process_step AS "청년진행단계",
                            pi.name AS "청년이름",
                            pi.phone_number AS "전화번호",
                            pi.emergency_contact AS "비상연락처",
                            COALESCE(pi.brith_date, pi.birth_date) AS "생년월일"
                        FROM counseling_log cl
                        JOIN isolated_youths iy ON cl.isolated_youth_id = iy.id
                        JOIN personal_info pi ON iy.personal_info_id = pi.id
                        ORDER BY cl.id DESC
                        """;

        LocalDateTime time = LocalDateTime.now();
        String sheetName = "상담일지_" + time.format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query);
             Workbook workbook = ExcelUtils.resultSetToWorkbook(rs, sheetName);
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            workbook.write(outputStream);
            byte[] fileContent = outputStream.toByteArray();

            return ExportCounselingLogResponseDTO.builder()
                    .fileContent(fileContent)
                    .fileName(sheetName + ".xlsx")
                    .contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .fileSize(fileContent.length)
                    .generatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                    .build();

        } catch (Exception e) {
            log.error("[Excel 다운로드 실패]", e);
            throw new RuntimeException("Excel 다운로드 중 오류가 발생했습니다.", e);
        }
    }

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
    public AddScheduleResponseDTO addSchedule(String userId, Long id, AddScheduleRequestDTO addScheduleRequestDTO) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND));

        IsolatedYouth isolatedYouth = isolatedYouthRepository.findById(id)
                .orElseThrow(() ->
                        new YouthConsultationException(YouthConsultationErrorCode.NO_MATCH_PERSON)
                );

        CounselingLog log = counselingLogRepository.save(
                CounselingLog.builder()
                        .user(user)
                        .consultationDate(addScheduleRequestDTO.getDate().atStartOfDay())
                        .isolatedYouth(isolatedYouth)
                        .counselingProcess(CounselingConstants.DEFAULT_STEP)
                        .build()
        );

        return AddScheduleResponseDTO.builder()
                .counseling(log)
                .build();
    }

    @Transactional
    @Override
    public SpeechResponseDTO getGeneralSummarize(String loginUser, SpeechRequestDTO requestDTO) {
        User user = userRepository.findByUserId(loginUser)
                .orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND));

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

        counselingLogRepository.save(
                CounselingLog.builder()
                        .user(user)
                        .fullScript(transcript)
                        .counselorKeyword(counselor)
                        .memoKeyword(notes)
                        .isolatedYouth(isolatedYouth)
                        .clientKeyword(client)
                        .summarize(summarize)
                        .voiceFileUrl(transcriptionContext.getUploadUrl())
                        .counselingProcess(CounselingProcess.COMPLETED)
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

            PersonalInfo savedPersonalInfo = personalInfoRepository.save(
                    PersonalInfo.builder()
                            .name(personalInfoCollector.getName())
                            .phoneNumber(personalInfoCollector.getPhoneNumber())
                            .emergencyContact(personalInfoCollector.getEmergencyContent())
                            .birthDate(personalInfoCollector.getBirthDate())
                            .build()
            );

            SurveyVersion newSurveyVersion = surveyVersionRepository.save(
                    SurveyVersion.builder()
                            .personalInfo(savedPersonalInfo)
                            .build()
            );

            surveyAnswerCollector.addVersion(newSurveyVersion);
            surveyAnswerRepository.saveAll(surveyAnswerCollector.getAnswers());

            isolatedYouthRepository.save(
                    IsolatedYouth.builder()
                            .isolatedScore(surveyAnswerCollector.getScore())
                            .personalInfo(savedPersonalInfo)
                            .surveyProcessStep(SurveyProcessStep.SELF_DIAGNOSIS)
                            .build()
            );

            return SurveyUploadDTO.builder()
                    .personalInfo(personalInfoCollector)
                    .answers(surveyAnswerCollector)
                    .build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ConsultationResponseDTO getConsultationSummaryStats() {

        //1. 누적 통계
        List<IsolatedYouthRepository.CategoryCount> stats = isolatedYouthRepository.countByIsolationLevel();

        long total = stats.stream()
                .mapToLong(IsolatedYouthRepository.CategoryCount::getCount)
                .sum();

        Map<String,Long> byCategory = stats.stream()
                .collect(Collectors.toMap(
                        IsolatedYouthRepository.CategoryCount::getCategory,
                        IsolatedYouthRepository.CategoryCount::getCount
                ));

        //2. 최근 3개월 신규 등록
        //2-1. 최근 3개월 상담자 정보 호출
        LocalDate cutoff = LocalDate.now().minusMonths(3);
        List<IsolatedYouthRepository.MonthCount> raw = isolatedYouthRepository.countRecentRegistrations(cutoff);

        //2-2. 최근 3개월 달 리스트 생성
        List<Integer> months = IntStream.rangeClosed(0, 2)
                .mapToObj(i -> LocalDate.now().minusMonths(2-i).getMonthValue())
                .toList();

        //2-3. MonthlyConsultationDto로 매핑하면서, 해당 월에 대한 정보가 없으면 0으로 채우기
        List<MonthlyConsultationDTO> recent = months.stream()
                .map(m -> {
                    long cnt = raw.stream()
                            .filter(r -> r.getMonth().equals(m))
                            .mapToLong(IsolatedYouthRepository.MonthCount::getCount)
                            .findFirst()
                            .orElse(0L);
                    return new MonthlyConsultationDTO(m, cnt);
                })
                .toList();

        return new ConsultationResponseDTO(total, byCategory, recent);
    }

    @Override
    public YearlyConsultationDTO getYearlyConsultationSummary() {
        int currYear = Year.now().getValue();
        int prevYear = currYear - 1;

        List<Integer> currentYearCounts = convertToMonthlyArray(isolatedYouthRepository.countMonthByYear(currYear));
        List<Integer> prevYearCounts = convertToMonthlyArray(isolatedYouthRepository.countMonthByYear(prevYear));

        return YearlyConsultationDTO.builder()
                .currentYear(currYear)
                .currentMonthlyCount(currentYearCounts)
                .previousYear(prevYear)
                .previousMonthlyCount(prevYearCounts)
                .build();
    }

    private int calculateAge(PersonalInfo pi) {
        return Period.between(pi.getBirthDate(), LocalDate.now()).getYears();
    }

    @Override
    public Page<IsolatedYouthResponseDTO> getList(Pageable pageable) {
        return counselingLogRepository.findAll(pageable)
                .map(this::toIsolatedDto);
    }

    private IsolatedYouthResponseDTO toIsolatedDto(CounselingLog log)
    {
        PersonalInfo pi = log.getIsolatedYouth().getPersonalInfo();
        int age = calculateAge(pi);

        return new IsolatedYouthResponseDTO(
                pi.getName(),
                age,
                log.getIsolatedYouth().getIsolationLevel(),
                log.getConsultationDate(),
                log.getMemoKeyword());
    }

    @Override
    public Page<PreSupportIsolatedYouthResponseDTO> getPresupportList(Pageable pageable) {
        return isolatedYouthRepository.findAll(pageable)
                .map(this::toDto);
    }

    @Override
    public CounselingSummaryResponseDTO getPersonalCounselingLogSummary(Long personalInfoId) {
        IsolatedYouth isolatedYouth = isolatedYouthRepository.findByPersonalInfoId(personalInfoId)
                .orElseThrow(() -> new YouthConsultationException(YouthConsultationErrorCode.NO_MATCH_PERSON));

        PersonalInfo personalInfo = isolatedYouth.getPersonalInfo();

        Pageable counselingPageable = PageRequest.of(0, 5, Sort.by("consultationDate").ascending());
        Page<CounselingLog> counselingLogs = counselingLogRepository.findAllByIsolatedYouth(isolatedYouth, counselingPageable);

        Optional<SurveyVersion> surveyVersion = surveyVersionRepository
                .findTopByPersonalInfoOrderByVersionDesc(isolatedYouth.getPersonalInfo());

        Pageable surveyPageable = PageRequest.of(0, 5, Sort.by("surveyDate").ascending());
        Page<SurveyVersion> surveyVersions =
                surveyVersionRepository.findAllByPersonalInfo(isolatedYouth.getPersonalInfo(), surveyPageable);

        CounselingResponseCollector counselingCollector = new CounselingResponseCollector(counselingLogs);
        SurveyScaleResponseCollector surveyScaleResponseCollector = new SurveyScaleResponseCollector(
                surveyVersion.orElse(null),
                surveyVersions.getContent()
        );

        return CounselingSummaryResponseDTO.builder()
                .personalId(personalInfoId)
                .name(personalInfo.getName())
                .age(personalInfo.getAge())
                .isolatedScore(isolatedYouth.getIsolatedScore())
                .counselingList(counselingCollector.getCounselingResponseDTOS())
                .currSurveyScale(surveyScaleResponseCollector.getSurveyScaleResponseDTO())
                .surveyList(surveyScaleResponseCollector.getSurveyScaleResponseDTOS())
                .build();
    }

    @Override
    public SurveyResponseSummaryDTO getSurveyResponseSummaryInfo(Long personalInfoId, Long versionId) {
        PersonalInfo personalInfo = personalInfoRepository.findById(personalInfoId)
                .orElseThrow(() -> new YouthConsultationException(YouthConsultationErrorCode.NO_MATCH_PERSON));

        SurveyVersion version = surveyVersionRepository.findById(versionId)
                        .orElseThrow(() -> new YouthConsultationException(YouthConsultationErrorCode.NO_MATCH_SURVEY));

        List<SurveyQuestion> questions = surveyQuestionRepository.findAll();
        List<SurveyAnswer> answers = surveyAnswerRepository.findAllBySurveyVersion(version);

        SurveyScaleResponseCollector surveyScaleResponseCollector = new SurveyScaleResponseCollector(
                version
        );

        SurveyQuestionWithAnswerCollector surveyQuestionWithAnswerCollector = new SurveyQuestionWithAnswerCollector(
                answers
        );

        return SurveyResponseSummaryDTO.builder()
                .name(personalInfo.getName())
                .age(personalInfo.getAge())
                .surveyScale(surveyScaleResponseCollector.getSurveyScaleResponseDTO())
                .answers(surveyQuestionWithAnswerCollector.getSurveyQuestionWithAnswerDTOS())
                .build();
    }

    private PreSupportIsolatedYouthResponseDTO toDto(IsolatedYouth iy)
    {
        PersonalInfo pi = iy.getPersonalInfo();
        int age = calculateAge(pi);

        return new PreSupportIsolatedYouthResponseDTO(pi.getName(), age, iy.getSurveyProcessStep());
    }


    private List<Integer> convertToMonthlyArray(List<Object[]> rawCounts){
        List<Integer> monthly = IntStream.range(0, 12).boxed().map(i -> 0).collect(Collectors.toList());

        for(Object[] row : rawCounts){
            int month = ((Number) row[0]).intValue();
            int cnt = ((Number) row[1]).intValue();
            monthly.set(month - 1,cnt);
        }

        return monthly;
    }

    public SpeechResponseDTO updateCounselingLog(Long id, UpdateCounselingLogRequestDTO requestDTO) {
        CounselingLog counselingLog = counselingLogRepository.findById(id)
                .orElseThrow(() ->
                        new YouthConsultationException(YouthConsultationErrorCode.NO_MATCH_COUNSELING)
                );

        String summary = StringUtils.hasText(requestDTO.getSummary()) ? requestDTO.getSummary(): counselingLog.getSummarize();
        String client = StringUtils.hasText(requestDTO.getClient()) ? requestDTO.getClient(): counselingLog.getClientKeyword();
        String counselor = StringUtils.hasText(requestDTO.getCounselor()) ? requestDTO.getCounselor(): counselingLog.getCounselorKeyword();
        String memos = StringUtils.hasText(requestDTO.getMemos()) ? requestDTO.getMemos(): counselingLog.getMemoKeyword();

        CounselingLog newLog = counselingLogRepository.save(
                CounselingLog.builder()
                        .id(id)
                        .user(counselingLog.getUser())
                        .consultationDate(counselingLog.getConsultationDate())
                        .isolatedYouth(counselingLog.getIsolatedYouth())
                        .fullScript(counselingLog.getFullScript())
                        .voiceFileUrl(counselingLog.getVoiceFileUrl())
                        .counselingProcess(CounselingConstants.COMPLETED)
                        .summarize(summary)
                        .clientKeyword(client)
                        .counselorKeyword(counselor)
                        .memoKeyword(memos)
                        .build()
        );

        return SpeechResponseDTO.builder()
                .summary(newLog.getSummarize())
                .client(newLog.getClientKeyword())
                .counselor(newLog.getCounselorKeyword())
                .memos(newLog.getMemoKeyword())
                .build();
    }

    @Override
    public void patchIsolationYouthStep(Long youthId, PatchProcessStep processStep) {
        IsolatedYouth youth = isolatedYouthRepository.findById(youthId)
                .orElseThrow(() -> new YouthConsultationException(YouthConsultationErrorCode.NO_MATCH_PERSON));

        IsolationYouthVO isolationYouthVO = IsolationYouthVO.of(youth, processStep.getProcessStep());

        isolatedYouthRepository.save(
                IsolationYouthVO.toEntity(isolationYouthVO)
        );
    }

    @Override
    @KafkaListener(topics = "${spring.kafka.topic.name}")
    @Transactional
    public void getKafkaSurveySendDate(SurveySendRequestDTO requestDTO) {
        log.info("📥 [Kafka 수신] survey-send 토픽 수신: {}", requestDTO);

        Map<String, SurveyQuestion> questions = getQuestions();
        log.debug("🧠 [질문 로드] 전체 질문 수: {}", questions.size());

        UserInfoDTO userInfoDTO = requestDTO.getUser();
        log.info("👤 [사용자 정보] 이름: {}, 전화번호: {}", userInfoDTO.getName(), userInfoDTO.getPhoneNumber());

        List<SurveyAnswerDTO> answers = requestDTO.getAnswers();
        log.info("📊 [응답 수] 총 응답 수: {}", answers.size());

        PersonalInfo user = personalInfoRepository
                .findByNameAndPhoneNumber(userInfoDTO.getName(), userInfoDTO.getPhoneNumber())
                .orElse(null);

        if (user != null) {
            log.info("✅ [기존 사용자] 이름: {}, ID: {}", user.getName(), user.getId());
        } else {
            log.info("🆕 [신규 사용자] 등록 필요");
        }

        SurveyAnswerCollector collector = new SurveyAnswerCollector();

        for (SurveyAnswerDTO answer : answers) {
            SurveyQuestion question = questions.get(answer.getQuestion());

            if (question == null) {
                log.warn("⚠️ [오류] 질문 코드 '{}'에 해당하는 질문이 존재하지 않음", answer.getQuestion());
                continue;
            }

            log.debug("📝 [응답 처리] 질문: {}", question.getContent());

            if (answer.getAnswerChoice() == null) {
                log.debug("🔤 [주관식 응답] {}", answer.getAnswerText());
                collector.addAnswerText(question, answer.getAnswerText());
            } else {
                log.debug("⭕ [객관식 응답] {}", answer.getAnswerChoice());
                collector.addAnswerChoice(question, answer.getAnswerChoice());
            }
        }

        if (user != null) {
            Optional<SurveyVersion> surveyVersion = surveyVersionRepository.findTopByPersonalInfoOrderByVersionDesc(user);

            if (surveyVersion.isEmpty()) {
                log.info("📌 [설문 버전 없음] 초기 버전 생성");
                SurveyVersion newSurveyVersion = surveyVersionRepository.save(
                        SurveyVersion.builder().personalInfo(user).build()
                );
                collector.addVersion(newSurveyVersion);
            } else {
                log.info("📌 [기존 설문 버전] 최신 버전: {}", surveyVersion.get().getVersion());
                SurveyVersion newSurveyVersion = surveyVersionRepository.save(
                        SurveyVersion.builder()
                                .version(surveyVersion.get().getVersion() + 1L)
                                .personalInfo(user)
                                .build()
                );
                collector.addVersion(newSurveyVersion);
            }

        } else {
            PersonalInfo savedPersonalInfo = personalInfoRepository.save(
                    PersonalInfo.builder()
                            .name(userInfoDTO.getName())
                            .phoneNumber(userInfoDTO.getPhoneNumber())
                            .emergencyContact(userInfoDTO.getEmergencyContact())
                            .birthDate(userInfoDTO.getBirthDate())
                            .build()
            );
            log.info("💾 [신규 사용자 저장] ID: {}", savedPersonalInfo.getId());

            isolatedYouthRepository.save(
                    IsolatedYouth.builder()
                            .isolatedScore(requestDTO.getSurveyResult())
                            .personalInfo(savedPersonalInfo)
                            .surveyProcessStep(SurveyProcessStep.SELF_DIAGNOSIS)
                            .build()
            );

            SurveyVersion newSurveyVersion = surveyVersionRepository.save(
                    SurveyVersion.builder()
                            .personalInfo(savedPersonalInfo)
                            .build()
            );
            log.info("🆕 [설문 버전 생성] 신규 사용자용 버전 생성");

            collector.addVersion(newSurveyVersion);
        }

        surveyAnswerRepository.saveAll(collector.getAnswers());
        log.info("📤 [저장 완료] 설문 응답 총 {}건 저장됨", collector.getAnswers().size());
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
