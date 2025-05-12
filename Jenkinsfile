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
        // 0. 브랜치 기반 ENV 자동 설정
        stage('Decide Environment') {
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
                        'OPENAI_API_KEY', 'S3_ACCESS_KEY', 'S3_SECRET_KEY', 'S3_BUCKET',
                        'NEXT_PUBLIC_NAVER_CLIENT_ID'
                    ]

                    requiredVars.each { var ->
                        if (!envProps.containsKey(var)) {
                            error "❌ 필수 변수 ${var}가 envProps에 없습니다."
                        }
                    }
<<<<<<< Updated upstream

                    def newEnvContent = generateEnvString(requiredVars) + '\nspring.profiles.active=prod'

                    writeFile file: "${env.WORKSPACE}/cicd/.env", text: newEnvContent.trim()
                    echo "✅ .env 재생성 완료"
=======
                    
                    def newEnvContent = """
                    DEARIE_DB_URL=${envProps.DEARIE_DB_URL}
                    DEARIE_DB_USER=${envProps.DEARIE_DB_USER}
                    DEARIE_DB_PASSWORD=${envProps.DEARIE_DB_PASSWORD}
                    DEARIE_DB_NAME=${envProps.DEARIE_DB_NAME}
                    DEARIE_JWT_SECRET=${envProps.DEARIE_JWT_SECRET}
                    LIGHT_DB_URL=${envProps.LIGHT_DB_URL}
                    LIGHT_DB_USER=${envProps.LIGHT_DB_USER}
                    LIGHT_DB_PASSWORD=${envProps.LIGHT_DB_PASSWORD}
                    LIGHT_DB_NAME=${envProps.LIGHT_DB_NAME}
                    LIGHT_JWT_SECRET=${envProps.LIGHT_JWT_SECRET}
                    spring.kafka.bootstrap-servers=${envProps.KAFKA_BOOTSTRAP_SERVERS}
                    spring.kafka.topic.name=${envProps.KAFKA_TOPIC_NAME}
                    spring.kafka.consumer.group-id=${envProps.KAFKA_CONSUMER_GROUP_ID}
                    OPENAI_API_KEY=${envProps.OPENAI_API_KEY}
                    S3_ACCESS_KEY=${envProps.S3_ACCESS_KEY}
                    S3_SECRET_KEY=${envProps.S3_SECRET_KEY}
                    S3_BUCKET_LIGHTREBORN=${envProps.S3_BUCKET_LIGHTREBORN}
                    S3_BUCKET_DEARIE=${envProps.S3_BUCKET_DEARIE}
                    spring.profiles.active=prod
                    NEXT_PUBLIC_NAVER_CLIENT_ID=${envProps.NEXT_PUBLIC_NAVER_CLIENT_ID}
                    """.stripIndent().trim()
                    
                    writeFile file: envFilePath, text: newEnvContent
                    echo "✅ 실제 값으로 .env 재생성 완료"
>>>>>>> Stashed changes
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
                        echo "🧹 docker-compose down"
                        docker-compose --env-file ${envPath} -f ${composePath} down || true
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

<<<<<<< Updated upstream
                    def runtimeEnvKeys = [
                        'DEARIE_DB_URL', 'DEARIE_DB_USER', 'DEARIE_DB_PASSWORD', 'DEARIE_DB_NAME', 'DEARIE_JWT_SECRET',
                        'LIGHT_DB_URL', 'LIGHT_DB_USER', 'LIGHT_DB_PASSWORD', 'LIGHT_DB_NAME', 'LIGHT_JWT_SECRET',
                        'KAFKA_BOOTSTRAP_SERVERS', 'KAFKA_TOPIC_NAME', 'KAFKA_CONSUMER_GROUP_ID',
                        'OPENAI_API_KEY',
                        'S3_ACCESS_KEY', 'S3_SECRET_KEY', 'S3_BUCKET',
                        'NEXT_PUBLIC_NAVER_CLIENT_ID'
                    ]

                    withEnv(generateWithEnvList(runtimeEnvKeys)) {
=======
                    echo "🚀 docker-compose up"
                    echo "⭐️ 전달할 env경로? : ${envPath}"
                    
                    // envProps에서 필요한 환경 변수를 설정
                    withEnv([
                        "DEARIE_DB_URL=${envProps.DEARIE_DB_URL}",
                        "DEARIE_DB_USER=${envProps.DEARIE_DB_USER}",
                        "DEARIE_DB_PASSWORD=${envProps.DEARIE_DB_PASSWORD}",
                        "DEARIE_DB_NAME=${envProps.DEARIE_DB_NAME}",
                        "DEARIE_JWT_SECRET=${envProps.DEARIE_JWT_SECRET}",
                        "LIGHT_DB_URL=${envProps.LIGHT_DB_URL}",
                        "LIGHT_DB_USER=${envProps.LIGHT_DB_USER}",
                        "LIGHT_DB_PASSWORD=${envProps.LIGHT_DB_PASSWORD}",
                        "LIGHT_DB_NAME=${envProps.LIGHT_DB_NAME}",
                        "LIGHT_JWT_SECRET=${envProps.LIGHT_JWT_SECRET}",
                        "KAFKA_BOOTSTRAP_SERVERS=${envProps.KAFKA_BOOTSTRAP_SERVERS}",
                        "KAFKA_TOPIC_NAME=${envProps.KAFKA_TOPIC_NAME}",
                        "KAFKA_CONSUMER_GROUP_ID=${envProps.KAFKA_CONSUMER_GROUP_ID}",
                        "OPENAI_API_KEY=${envProps.OPENAI_API_KEY}",
                        "spring.cloud.aws.credentials.access-key=${envProps.S3_ACCESS_KEY}",
                        "spring.cloud.aws.credentials.secret-key=${envProps.S3_SECRET_KEY}",
                        "S3_BUCKET_LIGHTREBORN=${envProps.S3_BUCKET_LIGHTREBORN}",
                        "S3_BUCKET_DEARIE=${envProps.S3_BUCKET_DEARIE}",
                        "spring.cloud.aws.region.static=ap-northeast-2",
                        "NEXT_PUBLIC_NAVER_CLIENT_ID=${envProps.NEXT_PUBLIC_NAVER_CLIENT_ID}"
                    ]) {
>>>>>>> Stashed changes
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

                        def hostMigrationPath = "/home/ubuntu/jenkins-data/workspace/soboro/${project}/backend/src/main/resources/db/migration"

                        def baseCmd = """
                            docker run --rm \\
                            --network ${networkName} \\
                            -v ${hostMigrationPath}:/flyway/sql \\
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
                            def infoOutput = sh(script: "${baseCmd} info", returnStdout: true)
                            echo "📋 Flyway info output:"
                            echo infoOutput
                        } catch (err) {
                            echo "⚠️ Info command failed: ${err.message}"
                        }
                        
                        // 직접 마이그레이션 실행
                        echo "🚀 Running Flyway migration..."
                        sh "${baseCmd} migrate"
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
