
```
lightreborn
├─ backend
│  ├─ .gradle
│  │  ├─ 8.13
│  │  │  ├─ checksums
│  │  │  │  ├─ checksums.lock
│  │  │  │  ├─ md5-checksums.bin
│  │  │  │  └─ sha1-checksums.bin
│  │  │  ├─ executionHistory
│  │  │  │  ├─ executionHistory.bin
│  │  │  │  └─ executionHistory.lock
│  │  │  ├─ expanded
│  │  │  ├─ fileChanges
│  │  │  │  └─ last-build.bin
│  │  │  ├─ fileHashes
│  │  │  │  ├─ fileHashes.bin
│  │  │  │  ├─ fileHashes.lock
│  │  │  │  └─ resourceHashesCache.bin
│  │  │  ├─ gc.properties
│  │  │  └─ vcsMetadata
│  │  ├─ buildOutputCleanup
│  │  │  ├─ buildOutputCleanup.lock
│  │  │  ├─ cache.properties
│  │  │  └─ outputFiles.bin
│  │  ├─ file-system.probe
│  │  └─ vcs-1
│  │     └─ gc.properties
│  ├─ .idea
│  │  ├─ compiler.xml
│  │  ├─ gradle.xml
│  │  ├─ misc.xml
│  │  ├─ modules
│  │  │  └─ backend.main.iml
│  │  ├─ modules.xml
│  │  ├─ vcs.xml
│  │  └─ workspace.xml
│  ├─ build
│  │  ├─ classes
│  │  │  └─ java
│  │  │     └─ main
│  │  │        └─ com
│  │  │           └─ ssafy
│  │  │              └─ backend
│  │  │                 ├─ auth
│  │  │                 │  ├─ controller
│  │  │                 │  │  └─ AuthController.class
│  │  │                 │  ├─ entity
│  │  │                 │  │  └─ User.class
│  │  │                 │  ├─ exception
│  │  │                 │  │  ├─ AuthErrorCode.class
│  │  │                 │  │  └─ AuthException.class
│  │  │                 │  ├─ model
│  │  │                 │  │  └─ dto
│  │  │                 │  │     ├─ request
│  │  │                 │  │     │  ├─ LoginRequestDTO.class
│  │  │                 │  │     │  └─ SignUpDTO.class
│  │  │                 │  │     └─ response
│  │  │                 │  │        ├─ LoginResponseDTO$LoginResponseDTOBuilder.class
│  │  │                 │  │        └─ LoginResponseDTO.class
│  │  │                 │  ├─ repository
│  │  │                 │  │  └─ UserRepository.class
│  │  │                 │  └─ service
│  │  │                 │     ├─ AuthService.class
│  │  │                 │     └─ AuthServiceImpl.class
│  │  │                 ├─ BackendApplication.class
│  │  │                 ├─ common
│  │  │                 │  ├─ aspect
│  │  │                 │  │  └─ LoggingAspect.class
│  │  │                 │  ├─ config
│  │  │                 │  │  ├─ RedisConfig.class
│  │  │                 │  │  ├─ SecurityConfig.class
│  │  │                 │  │  ├─ SpeechConfig$LoggingClientHttpRequestInterceptor.class
│  │  │                 │  │  ├─ SpeechConfig.class
│  │  │                 │  │  └─ SwaggerConfig.class
│  │  │                 │  ├─ dto
│  │  │                 │  │  ├─ ApiErrorResponse$FieldErrorDetail.class
│  │  │                 │  │  ├─ ApiErrorResponse.class
│  │  │                 │  │  ├─ BaseResponse$BaseResponseBuilder.class
│  │  │                 │  │  ├─ BaseResponse.class
│  │  │                 │  │  └─ ErrorResponse.class
│  │  │                 │  ├─ exception
│  │  │                 │  │  ├─ BaseErrorCode.class
│  │  │                 │  │  ├─ CustomException.class
│  │  │                 │  │  ├─ ErrorCode.class
│  │  │                 │  │  ├─ GlobalExceptionHandler.class
│  │  │                 │  │  ├─ ValidationErrorResponse$FieldErrorDetail.class
│  │  │                 │  │  └─ ValidationErrorResponse.class
│  │  │                 │  ├─ interceptor
│  │  │                 │  │  └─ LoggingInterceptor.class
│  │  │                 │  └─ security
│  │  │                 │     ├─ CustomUserDetails.class
│  │  │                 │     ├─ CustomUserDetailsService.class
│  │  │                 │     ├─ JwtAuthenticationFilter.class
│  │  │                 │     └─ JwtTokenProvider.class
│  │  │                 ├─ promotion_network
│  │  │                 │  ├─ controller
│  │  │                 │  │  └─ PromotionNetworkController.class
│  │  │                 │  └─ entity
│  │  │                 │     ├─ PromotionStatus.class
│  │  │                 │     └─ PromotionType.class
│  │  │                 ├─ welfare_center
│  │  │                 │  ├─ controller
│  │  │                 │  │  └─ WelfareCenterController.class
│  │  │                 │  └─ entity
│  │  │                 │     └─ PartnerOrganization.class
│  │  │                 ├─ youth_consultation
│  │  │                 │  ├─ controller
│  │  │                 │  │  └─ YouthConsultationController.class
│  │  │                 │  ├─ entity
│  │  │                 │  │  ├─ Answer.class
│  │  │                 │  │  ├─ CounselingLog$CounselingLogBuilder.class
│  │  │                 │  │  ├─ CounselingLog.class
│  │  │                 │  │  ├─ CounselingProcess.class
│  │  │                 │  │  ├─ IsolatedYouth$IsolatedYouthBuilder.class
│  │  │                 │  │  ├─ IsolatedYouth.class
│  │  │                 │  │  ├─ PersonalInfo.class
│  │  │                 │  │  ├─ SurveyAnswer.class
│  │  │                 │  │  ├─ SurveyProcessStep.class
│  │  │                 │  │  └─ SurveyQuestion.class
│  │  │                 │  ├─ exception
│  │  │                 │  │  ├─ YouthConsultationErrorCode.class
│  │  │                 │  │  └─ YouthConsultationException.class
│  │  │                 │  ├─ model
│  │  │                 │  │  └─ dto
│  │  │                 │  │     ├─ request
│  │  │                 │  │     │  ├─ SpeechRequestDTO$SpeechRequestDTOBuilder.class
│  │  │                 │  │     │  └─ SpeechRequestDTO.class
│  │  │                 │  │     └─ response
│  │  │                 │  │        ├─ SpeechResponseDTO$SpeechResponseDTOBuilder.class
│  │  │                 │  │        └─ SpeechResponseDTO.class
│  │  │                 │  ├─ repository
│  │  │                 │  │  ├─ CounselingLogRepository.class
│  │  │                 │  │  └─ IsolatedYouthRepository.class
│  │  │                 │  └─ service
│  │  │                 │     ├─ SpeechService.class
│  │  │                 │     ├─ SpeechServiceImpl$1.class
│  │  │                 │     └─ SpeechServiceImpl.class
│  │  │                 └─ youth_population
│  │  │                    ├─ controller
│  │  │                    │  └─ YouthPopulationController.class
│  │  │                    └─ entity
│  │  │                       ├─ Hangjungs.class
│  │  │                       └─ YouthPopulation.class
│  │  ├─ generated
│  │  │  └─ sources
│  │  │     ├─ annotationProcessor
│  │  │     │  └─ java
│  │  │     │     └─ main
│  │  │     └─ headers
│  │  │        └─ java
│  │  │           └─ main
│  │  ├─ reports
│  │  │  └─ problems
│  │  │     └─ problems-report.html
│  │  ├─ resources
│  │  │  └─ main
│  │  │     ├─ application-local.properties
│  │  │     ├─ application-prod.properties
│  │  │     ├─ application-test.properties
│  │  │     └─ application.properties
│  │  └─ tmp
│  │     └─ compileJava
│  │        ├─ compileTransaction
│  │        │  ├─ backup-dir
│  │        │  └─ stash-dir
│  │        │     └─ BackendApplication.class.uniqueId0
│  │        └─ previous-compilation-data.bin
│  ├─ build.gradle
│  ├─ Dockerfile
│  ├─ gradle
│  │  └─ wrapper
│  │     ├─ gradle-wrapper.jar
│  │     └─ gradle-wrapper.properties
│  ├─ gradlew
│  ├─ gradlew.bat
│  ├─ settings.gradle
│  └─ src
│     ├─ main
│     │  ├─ java
│     │  │  └─ com
│     │  │     └─ ssafy
│     │  │        └─ backend
│     │  │           ├─ auth
│     │  │           │  ├─ controller
│     │  │           │  │  └─ AuthController.java
│     │  │           │  ├─ exception
│     │  │           │  │  ├─ AuthErrorCode.java
│     │  │           │  │  └─ AuthException.java
│     │  │           │  ├─ model
│     │  │           │  │  ├─ dto
│     │  │           │  │  │  ├─ request
│     │  │           │  │  │  │  ├─ LoginRequestDTO.java
│     │  │           │  │  │  │  └─ SignUpDTO.java
│     │  │           │  │  │  └─ response
│     │  │           │  │  │     └─ LoginResponseDTO.java
│     │  │           │  │  └─ entity
│     │  │           │  │     └─ User.java
│     │  │           │  ├─ repository
│     │  │           │  │  └─ UserRepository.java
│     │  │           │  └─ service
│     │  │           │     ├─ AuthService.java
│     │  │           │     └─ AuthServiceImpl.java
│     │  │           ├─ BackendApplication.java
│     │  │           ├─ common
│     │  │           │  ├─ aspect
│     │  │           │  │  └─ LoggingAspect.java
│     │  │           │  ├─ config
│     │  │           │  │  ├─ RedisConfig.java
│     │  │           │  │  ├─ S3Config.java
│     │  │           │  │  ├─ SecurityConfig.java
│     │  │           │  │  ├─ SpeechConfig.java
│     │  │           │  │  └─ SwaggerConfig.java
│     │  │           │  ├─ dto
│     │  │           │  │  ├─ ApiErrorResponse.java
│     │  │           │  │  ├─ BaseResponse.java
│     │  │           │  │  └─ ErrorResponse.java
│     │  │           │  ├─ exception
│     │  │           │  │  ├─ BaseErrorCode.java
│     │  │           │  │  ├─ CustomException.java
│     │  │           │  │  ├─ ErrorCode.java
│     │  │           │  │  ├─ file
│     │  │           │  │  │  ├─ FileErrorCode.java
│     │  │           │  │  │  ├─ FileParsingException.java
│     │  │           │  │  │  └─ MissingHeadersException.java
│     │  │           │  │  ├─ GlobalExceptionHandler.java
│     │  │           │  │  └─ ValidationErrorResponse.java
│     │  │           │  ├─ interceptor
│     │  │           │  │  └─ LoggingInterceptor.java
│     │  │           │  ├─ security
│     │  │           │  │  ├─ JwtAuthenticationFilter.java
│     │  │           │  │  └─ JwtTokenProvider.java
│     │  │           │  ├─ utils
│     │  │           │  │  ├─ enums
│     │  │           │  │  │  └─ FileType.java
│     │  │           │  │  ├─ FileParserUtils.java
│     │  │           │  │  ├─ HeaderMapping.java
│     │  │           │  │  └─ parser
│     │  │           │  │     ├─ CsvRawFileParser.java
│     │  │           │  │     ├─ RawFileParser.java
│     │  │           │  │     └─ XlsxRawFileParser.java
│     │  │           │  └─ vo
│     │  │           │     └─ Coordinate.java
│     │  │           ├─ promotion_network
│     │  │           │  ├─ controller
│     │  │           │  │  └─ PromotionNetworkController.java
│     │  │           │  ├─ entity
│     │  │           │  │  ├─ PromotionStatus.java
│     │  │           │  │  └─ PromotionType.java
│     │  │           │  ├─ model
│     │  │           │  │  └─ response
│     │  │           │  │     └─ PromotionNetworkResponseDTO.java
│     │  │           │  ├─ repository
│     │  │           │  │  ├─ PromotionStatusRepository.java
│     │  │           │  │  └─ PromotionTypeRepository.java
│     │  │           │  └─ service
│     │  │           │     ├─ PromotionNetworkService.java
│     │  │           │     └─ PromotionNetworkServiceImpl.java
│     │  │           ├─ welfare_center
│     │  │           │  ├─ controller
│     │  │           │  │  └─ WelfareCenterController.java
│     │  │           │  ├─ entity
│     │  │           │  │  └─ PartnerOrganization.java
│     │  │           │  ├─ model
│     │  │           │  │  └─ response
│     │  │           │  │     └─ WelfareCenterResponseDTO.java
│     │  │           │  ├─ repository
│     │  │           │  │  └─ WelfareCenterRepository.java
│     │  │           │  └─ service
│     │  │           │     ├─ WelfareCenterService.java
│     │  │           │     └─ WelfareCenterServiceImpl.java
│     │  │           ├─ youth_consultation
│     │  │           │  ├─ controller
│     │  │           │  │  └─ YouthConsultationController.java
│     │  │           │  ├─ exception
│     │  │           │  │  ├─ YouthConsultationErrorCode.java
│     │  │           │  │  └─ YouthConsultationException.java
│     │  │           │  ├─ model
│     │  │           │  │  ├─ collector
│     │  │           │  │  │  ├─ PersonalInfoCollector.java
│     │  │           │  │  │  └─ SurveyAnswerCollector.java
│     │  │           │  │  ├─ context
│     │  │           │  │  │  ├─ SurveyContext.java
│     │  │           │  │  │  └─ TranscriptionContext.java
│     │  │           │  │  ├─ dto
│     │  │           │  │  │  ├─ request
│     │  │           │  │  │  │  └─ SpeechRequestDTO.java
│     │  │           │  │  │  └─ response
│     │  │           │  │  │     ├─ SpeechResponseDTO.java
│     │  │           │  │  │     └─ SurveyUploadDTO.java
│     │  │           │  │  ├─ entity
│     │  │           │  │  │  ├─ CounselingLog.java
│     │  │           │  │  │  ├─ CounselingProcess.java
│     │  │           │  │  │  ├─ IsolatedYouth.java
│     │  │           │  │  │  ├─ PersonalInfo.java
│     │  │           │  │  │  ├─ SurveyAnswer.java
│     │  │           │  │  │  ├─ SurveyProcessStep.java
│     │  │           │  │  │  ├─ SurveyQuestion.java
│     │  │           │  │  │  └─ SurveyVersion.java
│     │  │           │  │  └─ state
│     │  │           │  │     └─ Answer.java
│     │  │           │  ├─ repository
│     │  │           │  │  ├─ CounselingLogRepository.java
│     │  │           │  │  ├─ IsolatedYouthRepository.java
│     │  │           │  │  ├─ PersonalInfoRepository.java
│     │  │           │  │  ├─ SurveyAnswerRepository.java
│     │  │           │  │  ├─ SurveyQuestionRepository.java
│     │  │           │  │  └─ SurveyVersionRepository.java
│     │  │           │  └─ service
│     │  │           │     ├─ SpeechService.java
│     │  │           │     └─ SpeechServiceImpl.java
│     │  │           └─ youth_population
│     │  │              ├─ controller
│     │  │              │  └─ YouthPopulationController.java
│     │  │              ├─ entity
│     │  │              │  ├─ Hangjungs.java
│     │  │              │  └─ YouthPopulation.java
│     │  │              ├─ model
│     │  │              │  └─ dto
│     │  │              │     ├─ response
│     │  │              │     │  └─ YouthPopulationResponseDTO.java
│     │  │              │     └─ vo
│     │  │              │        └─ HangjungKey.java
│     │  │              ├─ repository
│     │  │              │  ├─ HangjungsRepository.java
│     │  │              │  └─ YouthPopulationRepository.java
│     │  │              └─ service
│     │  │                 ├─ YouthPopulationService.java
│     │  │                 └─ YouthPopulationServiceImpl.java
│     │  └─ resources
│     │     ├─ application-local.properties
│     │     ├─ application-prod.properties
│     │     ├─ application-test.properties
│     │     ├─ application.properties
│     │     ├─ data
│     │     │  ├─ population
│     │     │  │  ├─ csv
│     │     │  │  │  ├─ wrong_youth_population_dummy_data.csv
│     │     │  │  │  └─ youth_population_dummy_data_utf8.csv
│     │     │  │  └─ xlsx
│     │     │  │     ├─ updated_youth_population_utf8.xlsx
│     │     │  │     ├─ youth_population_utf8.xlsx
│     │     │  │     └─ youth_population_wrong.xlsx
│     │     │  ├─ promotion
│     │     │  │  └─ xlsx
│     │     │  │     ├─ promotion_status_full_sample.xlsx
│     │     │  │     ├─ updated_promotion_status_full_sample.xlsx
│     │     │  │     └─ wrong_promotion_status_full_sample.xlsx
│     │     │  └─ welfare_center
│     │     │     ├─ csv
│     │     │     │  ├─ updated2_welfare_center_dummmy_data_utf8.csv
│     │     │     │  ├─ updated_welfare_center_dummmy_data_utf8.csv
│     │     │     │  ├─ welfare_center_dummmy_data_utf8.csv
│     │     │     │  └─ wrong_welfare_center_dummmy_data_utf8.csv
│     │     │     └─ xlsx
│     │     │        ├─ updated2_welfare_center_dummmy_data_utf8.xlsx
│     │     │        ├─ updated_welfare_center_dummmy_data_utf8.xlsx
│     │     │        ├─ welfare_center_dummmy_data_utf8.xlsx
│     │     │        └─ wrong_welfare_center_dummmy_data_utf8.xlsx
│     │     ├─ data_migration
│     │     │  ├─ V1__hangjungs_init.sql
│     │     │  ├─ V2__promotiontype_init.sql
│     │     │  └─ V3__survey_question_init.sql
│     │     ├─ db
│     │     │  └─ migration
│     │     │     └─ V1__hangjungs_init.sql
│     │     ├─ hangjungs_init.sql
│     │     ├─ promotiontype_init.sql
│     │     └─ static
│     │        └─ 청년 온라인 자가척도 작성.docx
│     └─ test
│        └─ java
│           └─ com
│              └─ ssafy
│                 └─ backend
│                    └─ BackendApplicationTests.java
└─ frontend
   ├─ .dockerignore
   ├─ .env
   ├─ .next
   │  ├─ app-build-manifest.json
   │  ├─ build-manifest.json
   │  ├─ cache
   │  │  ├─ .rscinfo
   │  │  ├─ images
   │  │  │  ├─ 3lwlZl7--UMKyQSQyW6YoEwt1Tc2dUYv45dzoTw52xc
   │  │  │  │  └─ 60.1746183956245.CXVwavOVpWDk_4gZUWS8kg68HyUuENTJ9KFzfSPbJ7E.Vy8iODYwNC0xOTY5MGFiNWU2YyI.webp
   │  │  │  ├─ bHN9m9y_MFG6k4mz3q2Epj5-NBtVEN8MFxnN4GpitCc
   │  │  │  │  └─ 60.1746172782469.CXVwavOVpWDk_4gZUWS8kg68HyUuENTJ9KFzfSPbJ7E.Vy8iODYwNC0xOTY5MDAwYzgzOCI.webp
   │  │  │  ├─ Iecy_TM5Hm4yCfde59RG_4nY5geTN71f9gtPZgcQUbY
   │  │  │  │  └─ 60.1746404561029.5ZfW4n7XtbYpaJ30d2pL-lkE1-scvmPZLV8_Q2qS0nE.Vy8iODYwNC0xOTY5ZGM1OTkyZSI.webp
   │  │  │  ├─ o1kAWDrwTvfQT7ibBud83ggmjrlO-6oYBHCpvZXiOzk
   │  │  │  │  └─ 60.1746452863903.6KgpCcqMhE1OGUMcY_QIAxLVZpyM2utCS2do67sVXQI.Vy8iODYwNC0xOTZhMGIyY2FmNyI.webp
   │  │  │  └─ ugDSt3AWaS7rBhtXRrP-8Xheb-_3ERlbW-Au-KvNTyY
   │  │  │     └─ 60.1746172753210.Wz73uh9pn3knpzub6v6wSwUxmeQpdn6mSmy53jh104o.Vy8iODYwNC0xOTY5MDAwYzgzOCI.webp
   │  │  ├─ swc
   │  │  │  └─ plugins
   │  │  │     └─ v7_windows_x86_64_9.0.0
   │  │  └─ webpack
   │  │     ├─ client-development
   │  │     │  ├─ 0.pack.gz
   │  │     │  ├─ 1.pack.gz
   │  │     │  ├─ 10.pack.gz
   │  │     │  ├─ 11.pack.gz
   │  │     │  ├─ 12.pack.gz
   │  │     │  ├─ 13.pack.gz
   │  │     │  ├─ 14.pack.gz
   │  │     │  ├─ 15.pack.gz
   │  │     │  ├─ 16.pack.gz
   │  │     │  ├─ 17.pack.gz
   │  │     │  ├─ 18.pack.gz
   │  │     │  ├─ 19.pack.gz
   │  │     │  ├─ 2.pack.gz
   │  │     │  ├─ 20.pack.gz
   │  │     │  ├─ 21.pack.gz
   │  │     │  ├─ 22.pack.gz
   │  │     │  ├─ 23.pack.gz
   │  │     │  ├─ 24.pack.gz
   │  │     │  ├─ 25.pack.gz
   │  │     │  ├─ 26.pack.gz
   │  │     │  ├─ 3.pack.gz
   │  │     │  ├─ 4.pack.gz
   │  │     │  ├─ 5.pack.gz
   │  │     │  ├─ 6.pack.gz
   │  │     │  ├─ 7.pack.gz
   │  │     │  ├─ 8.pack.gz
   │  │     │  ├─ 9.pack.gz
   │  │     │  ├─ index.pack.gz
   │  │     │  └─ index.pack.gz.old
   │  │     ├─ client-development-fallback
   │  │     │  ├─ 0.pack.gz
   │  │     │  ├─ 1.pack.gz
   │  │     │  ├─ index.pack.gz
   │  │     │  └─ index.pack.gz.old
   │  │     └─ server-development
   │  │        ├─ 0.pack.gz
   │  │        ├─ 1.pack.gz
   │  │        ├─ 10.pack.gz
   │  │        ├─ 11.pack.gz
   │  │        ├─ 12.pack.gz
   │  │        ├─ 13.pack.gz
   │  │        ├─ 14.pack.gz
   │  │        ├─ 15.pack.gz
   │  │        ├─ 16.pack.gz
   │  │        ├─ 17.pack.gz
   │  │        ├─ 18.pack.gz
   │  │        ├─ 19.pack.gz
   │  │        ├─ 2.pack.gz
   │  │        ├─ 20.pack.gz
   │  │        ├─ 21.pack.gz
   │  │        ├─ 22.pack.gz
   │  │        ├─ 23.pack.gz
   │  │        ├─ 24.pack.gz
   │  │        ├─ 25.pack.gz
   │  │        ├─ 26.pack.gz
   │  │        ├─ 27.pack.gz
   │  │        ├─ 3.pack.gz
   │  │        ├─ 4.pack.gz
   │  │        ├─ 5.pack.gz
   │  │        ├─ 6.pack.gz
   │  │        ├─ 7.pack.gz
   │  │        ├─ 8.pack.gz
   │  │        ├─ 9.pack.gz
   │  │        ├─ index.pack.gz
   │  │        └─ index.pack.gz.old
   │  ├─ package.json
   │  ├─ react-loadable-manifest.json
   │  ├─ server
   │  │  ├─ app-paths-manifest.json
   │  │  ├─ interception-route-rewrite-manifest.js
   │  │  ├─ middleware-build-manifest.js
   │  │  ├─ middleware-manifest.json
   │  │  ├─ middleware-react-loadable-manifest.js
   │  │  ├─ next-font-manifest.js
   │  │  ├─ next-font-manifest.json
   │  │  ├─ pages-manifest.json
   │  │  ├─ server-reference-manifest.js
   │  │  └─ server-reference-manifest.json
   │  ├─ static
   │  │  ├─ chunks
   │  │  │  └─ polyfills.js
   │  │  └─ development
   │  │     ├─ _buildManifest.js
   │  │     └─ _ssgManifest.js
   │  ├─ trace
   │  └─ types
   │     ├─ cache-life.d.ts
   │     └─ package.json
   ├─ Dockerfile
   ├─ eslint.config.mjs
   ├─ next-env.d.ts
   ├─ next.config.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.mjs
   ├─ public
   │  ├─ fonts
   │  │  └─ PretendardVariable.woff2
   │  └─ mockServiceWorker.js
   ├─ README.md
   ├─ src
   │  ├─ apis
   │  │  ├─ index.ts
   │  │  ├─ promotionNetworkApi.ts
   │  │  ├─ users.ts
   │  │  ├─ welfareCenterApi.ts
   │  │  ├─ youthConsultationApi.ts
   │  │  └─ youthPopulationApi.ts
   │  ├─ app
   │  │  ├─ dashboard
   │  │  │  ├─ consultation-management
   │  │  │  │  ├─ makenew
   │  │  │  │  │  └─ page.tsx
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ layout.tsx
   │  │  │  ├─ page.tsx
   │  │  │  ├─ promotion-network
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ welfare-center
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ youth-consultation
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ youth-management
   │  │  │  │  └─ page.tsx
   │  │  │  └─ youth-population
   │  │  │     └─ page.tsx
   │  │  ├─ favicon.ico
   │  │  ├─ globals.css
   │  │  ├─ layout.tsx
   │  │  ├─ login
   │  │  │  └─ page.tsx
   │  │  └─ page.tsx
   │  ├─ assets
   │  │  └─ logo.png
   │  ├─ components
   │  │  ├─ auth
   │  │  │  └─ LoginForm.tsx
   │  │  ├─ common
   │  │  │  ├─ Button.tsx
   │  │  │  ├─ Card.tsx
   │  │  │  ├─ SideBar.tsx
   │  │  │  └─ TopBar.tsx
   │  │  ├─ MSWInitializer.tsx
   │  │  ├─ promotionNetwork
   │  │  │  └─ PromotionMap.tsx
   │  │  ├─ welfareCenter
   │  │  │  └─ WelfareMap.tsx
   │  │  ├─ youthConsultation
   │  │  │  └─ ConsultationChart.tsx
   │  │  └─ youthPopluation
   │  │     └─ PopulationMap.tsx
   │  ├─ constants
   │  │  └─ colors.ts
   │  ├─ mocks
   │  │  ├─ browser.js
   │  │  └─ handlers.js
   │  └─ stores
   │     ├─ useAuthStore.ts
   │     ├─ usePromotionNetworkStore.ts
   │     ├─ useWelfareCenterStore.ts
   │     ├─ useYouthConsultaionStore.ts
   │     └─ useYouthPopulationStore.ts
   └─ tsconfig.json

```