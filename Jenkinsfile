def envProps
def buildSuccess = false


def generateEnvString = { keys ->
    keys.collect { key -> "${key}=${envProps[key]}" }.join('\n')
}

def generateWithEnvList = { keys ->
    keys.collect { key -> "${key}=${envProps[key]}" }
}

pipeline {
    agent any

    parameters {
  		choice(name: 'ENV', choices: ['develop', 'master'], description: 'Select deploy environment')
	}

    environment {
        MATTERMOST_WEBHOOK_ID = 'MATTERMOST_WEBHOOK'
    }

    stages {
        stage('Decide Environment') {
        // 0. 브랜치 기반 ENV 자동 설정
            steps {
                script {
                    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                    def selectedEnv = params.ENV?.trim()?.toLowerCase()

                    if (!selectedEnv || !(selectedEnv in ['develop', 'master'])) {
                        selectedEnv = (branch == 'develop') ? 'develop' : 'master'
                        echo "🔄 ENV auto-detected as: ${selectedEnv}"
                    } else {
                        echo "✅ ENV manually selected: ${selectedEnv}"
                    }
                    env.ENV = selectedEnv
                }
            }
        }

        // 1. 먼저 .env 파일부터 읽음
        stage('Load .env File') {
            steps {
                withCredentials([string(credentialsId: 'soboro-dotenv', variable: 'DOTENV')]) {
                    script {
                        def envFilePath = "${env.WORKSPACE}/cicd/.env"
                        
                        def correctedContent = DOTENV.replaceAll(/([A-Z][A-Z0-9_]+)=/, '\n$1=').trim()
                
                        writeFile file: envFilePath, text: correctedContent
                
                        // 이제 제대로 파싱
                        envProps = [:]
                        correctedContent.readLines().each { line ->
                            if (line && line.contains('=') && !line.trim().startsWith('#')) {
                                def split = line.split('=', 2)
                                    if (split.length == 2) {
                                        envProps[split[0].trim()] = split[1].trim()
                                    }
                                }
                            }
                            
                        echo "✅ .env 파일 읽기 완료: ${envProps.size()}개 프로퍼티"
                        // echo "✅ 키 목록: ${envProps.keySet()}"
                    }
                }
            }
        }
        
        // 2. generate env - backend
        stage('Generate .env') {
            steps {
                script {
                    def requiredVars = [
                        'DEARIE_DB_URL', 'DEARIE_DB_USER', 'DEARIE_DB_PASSWORD', 'DEARIE_DB_NAME', 'DEARIE_JWT_SECRET',
                        'LIGHT_DB_URL', 'LIGHT_DB_USER', 'LIGHT_DB_PASSWORD', 'LIGHT_DB_NAME', 'LIGHT_JWT_SECRET',
                        'KAFKA_BOOTSTRAP_SERVERS', 'KAFKA_TOPIC_NAME', 'KAFKA_CONSUMER_GROUP_ID',
                        'OPENAI_API_KEY', 'S3_ACCESS_KEY', 'S3_SECRET_KEY', 'S3_BUCKET_DEARIE', 'S3_BUCKET_LIGHTREBORN',
                        'NEXT_PUBLIC_NAVER_CLIENT_ID', 'KAKAO_REST_API_KEY'
                    ]

                    requiredVars.each { var ->
                        if (!envProps.containsKey(var)) {
                            error "❌ 필수 변수 ${var}가 envProps에 없습니다."
                        }
                    }

                    def newEnvContent = generateEnvString(requiredVars) + '\nspring.profiles.active=prod'

                    writeFile file: "${env.WORKSPACE}/cicd/.env", text: newEnvContent.trim()
                    echo "✅ .env 재생성 완료"
                }
            }
        }

        // generate env - lightreborn-frontend
        stage('Generate frontend .env.production') {
            steps {
                script {
                    def frontendEnv = """
                    NEXT_PUBLIC_NAVER_CLIENT_ID=${envProps.NEXT_PUBLIC_NAVER_CLIENT_ID}
                    NEXT_PUBLIC_API_URL=/api/dashboard/
                    """.stripIndent().trim()

                    writeFile file: "${env.WORKSPACE}/lightreborn/frontend/.env.production", text: frontendEnv
                    echo "✅ lightreborn frontend용 .env.production 생성 완료"
                }
            }
        }

        // generate env - dearie-frontend
        stage('Generate frontend .env.dearie.production') {
            steps {
                script {
                    def frontendEnv = """
                    NEXT_PUBLIC_BASE_PATH=/dearie
                    NEXT_PUBLIC_API_URL=/api/app/
                    NEXT_PUBLIC_MAPBOX_TOKEN=${envProps.NEXT_PUBLIC_MAPBOX_TOKEN}
                    NEXT_PUBLIC_MAPTILER_KEY=${envProps.NEXT_PUBLIC_MAPTILER_KEY}
                    NEXT_PUBLIC_NAVER_CLIENT_ID=${envProps.NEXT_PUBLIC_NAVER_CLIENT_ID}
                    KAKAO_REST_API_KEY=${envProps.KAKAO_REST_API_KEY}
                    """.stripIndent().trim()

                    writeFile file: "${env.WORKSPACE}/dearie/frontend/.env.dearie.production", text: frontendEnv
                    echo "✅ dearie frontend용 .env.dearie.production 생성 완료"
                }
            }
        }


        // 3. 기존 컨테이너 정리
        stage('Clean up Existing Containers') {
            steps {
                script {
                    def composePath = "${env.WORKSPACE}/docker-compose.yml"
                    def envPath = "${env.WORKSPACE}/cicd/.env"

                    sh """
                        echo \"🧹 docker-compose down (remove orphans)\"
                        docker-compose --env-file ${envPath} -f ${composePath} down --remove-orphans || true
                      
                        docker rm -f dearie-backend lightreborn-backend dearie-frontend lightreborn-frontend || true
                    """
                }
            }
        }

        // 4. 빌드 및 배포
        stage('Docker Compose Up') {
            steps {
                script {
                    def composePath = "${env.WORKSPACE}/docker-compose.yml"
                    def envPath = "${env.WORKSPACE}/cicd/.env"

                    def runtimeEnvKeys = [
                        'DEARIE_DB_URL', 'DEARIE_DB_USER', 'DEARIE_DB_PASSWORD', 'DEARIE_DB_NAME', 'DEARIE_JWT_SECRET',
                        'LIGHT_DB_URL', 'LIGHT_DB_USER', 'LIGHT_DB_PASSWORD', 'LIGHT_DB_NAME', 'LIGHT_JWT_SECRET',
                        'KAFKA_BOOTSTRAP_SERVERS', 'KAFKA_TOPIC_NAME', 'KAFKA_CONSUMER_GROUP_ID',
                        'OPENAI_API_KEY',
                        'S3_ACCESS_KEY', 'S3_SECRET_KEY', 'S3_BUCKET_DEARIE','S3_BUCKET_LIGHTREBORN',
                        'NEXT_PUBLIC_NAVER_CLIENT_ID',
                        'NEXT_PUBLIC_MAPTILER_KEY', 'NEXT_PUBLIC_MAPBOX_TOKEN'
                    ]

                    withEnv(generateWithEnvList(runtimeEnvKeys)) {
                        sh """
                            docker-compose --env-file ${envPath} -f ${composePath} up -d --build
                        """
                    }
                }
            }
        }
        
        // 5. Flyway 데이터 마이그레이션
        stage('Flyway Check and Migration') {
            steps {
                script {
                    def projects = ['dearie', 'lightreborn']
                    
                    projects.each { project ->
                        def projUpper = project.toUpperCase()
                        
                        def migrationPath = (params.ENV == 'master') ?
                            "${env.WORKSPACE}/${project}/backend/src/main/resources/db/migration_master" :
                            "${env.WORKSPACE}/${project}/backend/src/main/resources/db/migration"
                        
                        echo "🔍 Debug - Migration Path: ${migrationPath}"
                        
                        // 마이그레이션 파일 존재 확인
                        sh "echo '📋 마이그레이션 파일 확인:' && ls -la ${migrationPath} || true"
                        
                        def hasMigrationFiles = sh(script: "ls ${migrationPath}/*.sql 2>/dev/null", returnStatus: true) == 0
                        
                        if (!hasMigrationFiles) {
                            echo "⚠️ No migration files found in ${migrationPath}, skipping Flyway for ${project}"
                            return
                        }
                        
                        // 네트워크 이름을 먼저 정의
                        def networkName = "${project}-net"
                        def dbHost = "${project}-db"
                        
                        // 프로젝트별 DB 사용자/비밀번호 설정
                        def dbUser = envProps.get("${projUpper}_DB_USER") ?: envProps["${projUpper}_DB_USER"] ?: "ssafy"
                        def dbPassword = envProps.get("${projUpper}_DB_PASSWORD") ?: envProps["${projUpper}_DB_PASSWORD"] ?: "ssafy"
                        
                        echo "🔍 Debug - Final DB User: ${dbUser}"
                        echo "🔍 Debug - Final DB Password: ${dbPassword}"
                    
                        def dbName = project
                        
                        // ===== 수정 시작: 임시 디렉토리에 파일 복사 =====
                        def tempDir = "/tmp/${project}_migration_${env.BUILD_NUMBER}"
                        
                        // 임시 디렉토리 생성 및 SQL 파일 복사
                        sh """
                            mkdir -p ${tempDir}
                            cp ${migrationPath}/*.sql ${tempDir}/ || true
                            echo "📋 임시 디렉토리 파일 확인:"
                            ls -la ${tempDir}
                            cat ${tempDir}/*.sql | head -n 5
                        """
                        // ===== 수정 끝 =====
                        
                        // Flyway 명령 기본 템플릿 수정 (볼륨 마운트 경로 변경)
                        def baseCmd = """
                            docker run --rm \\
                            --network ${networkName} \\
                            -v ${tempDir}:/flyway/sql \\
                            flyway/flyway \\
                            -locations=filesystem:/flyway/sql \\
                            -url='jdbc:postgresql://${dbHost}:5432/${dbName}' \\
                            -user=${dbUser} \\
                            -password=${dbPassword} \\
                            -baselineOnMigrate=true
                        """.stripIndent().trim()
                        
                        // Flyway info 실행
                        echo "🔍 Checking Flyway info..."
                        try {
                            // 컨테이너 내부 파일 확인
                            sh """
                                echo "📋 컨테이너 내부 파일 확인:"
                                docker run --rm -v ${tempDir}:/flyway/sql alpine ls -la /flyway/sql
                            """
                            
                            def infoOutput = sh(script: "${baseCmd} info", returnStdout: true)
                            echo "📋 Flyway info output:"
                            echo infoOutput
                            
                            // 파일 목록 출력
                            echo "📋 Migration files in directory:"
                            sh "ls -la ${tempDir}"
                            
                            // 마이그레이션 파일 내용 미리보기
                            sh "echo '📋 First few lines of migration files:' && head -n 10 ${tempDir}/*.sql || true"
                        } catch (err) {
                            echo "⚠️ Info command failed: ${err.message}"
                        }
                        
                        // 마이그레이션 시도 (경고 표시)
                        echo "🚀 Running Flyway migration..."
                        try {
                            // 마이그레이션 자세한 로그 활성화 (-X 옵션 추가)
                            sh "${baseCmd} -X migrate"
                        } catch (err) {
                            echo "⚠️ Migration failed: ${err.message}"
                            echo "💡 Trying to repair the metadata..."
                            // repair 시도 (메타데이터 정리)
                            sh "${baseCmd} repair"
                            echo "🔄 Retrying migration after repair..."
                            sh "${baseCmd} migrate"
                        }
                        
                        // 임시 디렉토리 정리
                        sh "rm -rf ${tempDir}"
                    }
                }
            }
        }

        // 7. 빌드 성공 여부 상태 반영
        stage('Mark Image Build Success') {
            steps {
                script {
                    buildSuccess = true
                    echo "🫠 현재 빌드 상태: ${currentBuild.result}"
                    echo "✅ 이미지 빌드 성공 상태로 설정: ${buildSuccess}"
                }
            }
        }
    }

    post {
        always {
            script {
                def sendMessage = { String msg ->
                    def payload = groovy.json.JsonOutput.toJson([text: msg])
                    writeFile file: 'payload.json', text: payload

                    withCredentials([string(credentialsId: MATTERMOST_WEBHOOK_ID, variable: 'MATTERMOST_WEBHOOK')]) {
                        sh '''
                            curl -X POST -H 'Content-Type: application/json' -d @payload.json $MATTERMOST_WEBHOOK
                        '''
                    }
                }

                if (buildSuccess || currentBuild.result == 'SUCCESS') {
                    sendMessage("🎉 배포 성공 : `${env.ENV}` 환경\n- Job: `${env.JOB_NAME}`\n- Build: #${env.BUILD_NUMBER}")
                } else {
                    sendMessage("❌ 배포 실패 : `${env.ENV}` 환경\n- Job: `${env.JOB_NAME}`\n- Build: #${env.BUILD_NUMBER}\n- [로그 확인하기](${env.BUILD_URL})")
                }

                // 컨테이너가 안정화된 후에 .env 파일 삭제
                sh """
                    echo "🧹 보안상 민감한 파일 정리 중..."
                    find . -name ".env" -type f -delete 2>/dev/null || true
                    find . -name ".env.production" -type f -delete 2>/dev/null || true
                    find . -name ".env.dearie.production" -type f -delete 2>/dev/null || true
                    rm -f payload.json 2>/dev/null || true
                """
            }
        }

        success {
            script {
                if (params.ENV == 'master') {
                    echo '🎉 Build 성공 → Stable 이미지 태깅 및 푸시'
                    sh '''
                        # backend
                        docker tag dearie-backend dearie-backend:stable
                        docker tag lightreborn-backend lightreborn-backend:stable

                        # frontend
                        docker tag dearie-frontend dearie-frontend:stable
                        docker tag lightreborn-frontend lightreborn-frontend:stable

                        # build all
                        docker build -t dearie-backend:stable .
                        docker build -t lightreborn-backend:stable .
                        docker build -t dearie-frontend:stable .
                        docker build -t lightreborn-frontend:stable .
                    '''
                }
            }
        }

        failure {
            script {
                if (params.ENV == 'master') {
                    echo '⛔ 실패 → 이전 stable 이미지로 롤백 시도'
                    sh '''
                        # stop & remove
                        docker stop dearie-backend || true
                        docker stop lightreborn-backend || true
                        docker stop dearie-frontend || true
                        docker stop lightreborn-frontend || true

                        docker rm dearie-backend || true
                        docker rm lightreborn-backend || true
                        docker rm dearie-frontend || true
                        docker rm lightreborn-frontend || true

                        # run rollback
                        docker run -d --name dearie-backend --network dearie-net -p 8082:8082 dearie-backend:stable
                        docker run -d --name lightreborn-backend --network lightreborn-net -p 8081:8081 lightreborn-backend:stable
                        docker run -d --name dearie-frontend --network dearie-net  -p 3001:3001 dearie-frontend:stable
                        docker run -d --name lightreborn-frontend --network lightreborn-net -p 3000:3000 lightreborn-frontend:stable
                    '''
                }
            }
        }
    }
}
