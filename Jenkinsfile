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
                    echo "🔍 Jenkins Workspace: ${env.WORKSPACE}"
                    
                    def projects = ['dearie', 'lightreborn']
                    
                    projects.each { project ->
                        def projUpper = project.toUpperCase()
                        
                        def migrationPath = (params.ENV == 'master') ?
                            "${env.WORKSPACE}/${project}/backend/src/main/resources/db/migration_master" :
                            "${env.WORKSPACE}/${project}/backend/src/main/resources/db/migration"
                        
                        echo "🔍 Full Migration Path: ${migrationPath}"
                        
                        def networkName = "${project}-net"
                        def dbHost = "${project}-db"
                        def dbUser = envProps.get("${projUpper}_DB_USER") ?: "ssafy"
                        def dbPassword = envProps.get("${projUpper}_DB_PASSWORD") ?: "ssafy"
                        def dbName = project
                        def tempDir = "/tmp/flyway_sql_${project}_${env.BUILD_NUMBER}"
                        
                        sh """
                            echo "🔍 환경 변수 확인:"
                            echo "- Workspace: ${env.WORKSPACE}"
                            echo "- Migration Path: ${migrationPath}"
                            echo "- Network Name: ${networkName}"
                            echo "- DB Host: ${dbHost}"
                            echo "- DB User: ${dbUser}"
                            echo "- DB Name: ${dbName}"
                            echo "- Temp Dir: ${tempDir}"
                            
                            # 경로 존재 확인
                            if [ ! -d "${migrationPath}" ]; then
                                echo "⚠️ 마이그레이션 경로가 존재하지 않습니다: ${migrationPath}"
                                echo "⚠️ 전체 디렉토리 구조 확인"
                                find ${env.WORKSPACE}/${project} -path "*/db/migration*" -type d
                                exit 0
                            fi
                            
                            # 경로의 실제 내용 확인
                            echo "📋 경로 내용 확인 (ls -la):"
                            ls -la ${migrationPath}
                            
                            # SQL 파일 목록 확인 - 달러 기호 이스케이프 처리
                            sql_files=\$( find ${migrationPath} -name "*.sql" | sort )
                            file_count=\$( echo "\$sql_files" | grep -v '^\\$' | wc -l )
                            
                            if [ \$file_count -eq 0 ]; then
                                echo "⚠️ SQL 파일을 찾을 수 없습니다: ${migrationPath}"
                                exit 0
                            fi
                            
                            echo "🚀 Flyway 마이그레이션 시작 (프로젝트: ${project}, SQL 파일 수: \$file_count)"
                            
                            # 임시 디렉토리 생성 및 파일 복사
                            rm -rf ${tempDir}
                            mkdir -p ${tempDir}
                            
                            # 각 파일을 개별적으로 복사 - 달러 기호 이스케이프 처리
                            echo "\$sql_files" | while read file; do
                                if [ -f "\$file" ]; then
                                    # 파일명 형식 검증
                                    filename=\$( basename "\$file" )
                                    if [[ ! "\$filename" =~ ^V[0-9]+__.*\\.sql\\$ ]]; then
                                        echo "⚠️ 경고: 파일 '\$filename'이 Flyway 명명 규칙(V숫자__설명.sql)에 맞지 않습니다."
                                    fi
                                    echo "📄 복사 중: \$file → ${tempDir}/\$filename"
                                    cp "\$file" "${tempDir}/\$filename"
                                fi
                            done
                            
                            # 복사된 파일 확인
                            echo "📋 복사된 파일 목록:"
                            ls -la ${tempDir}
                            
                            # 디버깅: SQL 파일 내용 확인 (첫 10줄만)
                            echo "📄 SQL 파일 내용 (10줄):"
                            for f in \$( find ${tempDir} -name "*.sql" | sort ); do
                                echo "===== \$f ====="
                                head -n 10 \$f
                            done
                            
                            # 볼륨 마운트 테스트
                            echo "🔍 볼륨 마운트 테스트:"
                            docker run --rm -v ${tempDir}:/flyway/sql alpine ls -la /flyway/sql
                            
                            # 네트워크 존재 확인
                            if ! docker network ls | grep -q "${networkName}"; then
                                echo "⚠️ 네트워크가 존재하지 않습니다: ${networkName}. 생성합니다."
                                docker network create ${networkName} || true
                            fi
                            
                            # DB 컨테이너 실행 확인
                            if ! docker ps | grep -q "${dbHost}"; then
                                echo "⚠️ DB 컨테이너가 실행 중이지 않습니다: ${dbHost}"
                                exit 0
                            fi
                            
                            # Flyway 정보 확인
                            echo "🔍 Flyway info:"
                            docker run --rm \\
                                --network ${networkName} \\
                                -v ${tempDir}:/flyway/sql \\
                                flyway/flyway \\
                                -locations=filesystem:/flyway/sql \\
                                -url=jdbc:postgresql://${dbHost}:5432/${dbName} \\
                                -user=${dbUser} \\
                                -password=${dbPassword} \\
                                info
                            
                            # Flyway 마이그레이션 실행
                            echo "📦 Flyway 마이그레이션 실행 중..."
                            docker run --rm \\
                                --network ${networkName} \\
                                -v ${tempDir}:/flyway/sql \\
                                flyway/flyway \\
                                -locations=filesystem:/flyway/sql \\
                                -url=jdbc:postgresql://${dbHost}:5432/${dbName} \\
                                -user=${dbUser} \\
                                -password=${dbPassword} \\
                                -baselineOnMigrate=true \\
                                -outOfOrder=true \\
                                -validateMigrationNaming=true \\
                                -X migrate
                            
                            # 개발 환경일 경우 temp 디렉토리 보존 (디버깅용)
                            if [ "${params.ENV}" = "develop" ]; then
                                echo "🛠 develop 환경 → tempDir 정리 생략 (디버깅용)"
                            else
                                echo "🧹 임시 디렉토리 정리: ${tempDir}"
                                rm -rf ${tempDir}
                            fi
                        """
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
