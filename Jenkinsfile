def envProps
def buildSuccess = false

pipeline {
    agent any

    parameters {
  		choice(name: 'ENV', choices: ['develop', 'master'], description: 'Select deploy environment')
	}

    environment {
        MATTERMOST_WEBHOOK_ID = 'MATTERMOST_WEBHOOK'
    }

    stages {
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
        
        // 2. generate env
        stage('Generate .env') {
            steps {
                script {
                    // echo ">>> envProps 상태 확인: ${envProps}"
                    
                    def envFilePath = "${env.WORKSPACE}/cicd/.env"
                    
                    // envProps가 비어있는지 확인
                    if (!envProps || envProps.isEmpty()) {
                        error "❌ envProps가 비어있습니다. 이전 단계에서 .env 파일을 제대로 읽지 못했습니다."
                    }
                    
                    // 필수 변수들이 있는지 확인
                    def requiredVars = ['DEARIE_DB_URL', 'DEARIE_DB_USER', 'DEARIE_DB_PASSWORD', 'DEARIE_DB_NAME', 'DEARIE_JWT_SECRET',
                                        'LIGHT_DB_URL', 'LIGHT_DB_USER', 'LIGHT_DB_PASSWORD', 'LIGHT_DB_NAME', 'LIGHT_JWT_SECRET']
                    
                    requiredVars.each { var ->
                        if (!envProps.containsKey(var)) {
                            error "❌ 필수 변수 ${var}가 envProps에 없습니다."
                        }
                    }
                    
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
                    OPENAI_API_KEY=${envProps.OPENAI_API_KEY}
                    spring.cloud.aws.credentials.access-key=${envProps.S3_ACCESS_KEY}
                    spring.cloud.aws.credentials.secret-key=${envProps.S3_SECRET_KEY}
                    spring.cloud.aws.s3.bucket=${envProps.S3_BUCKET}
                    spring.cloud.aws.region.static=ap-northeast-2
                    """.stripIndent().trim()
                    
                    writeFile file: envFilePath, text: newEnvContent
                    echo "✅ 실제 값으로 .env 재생성 완료"
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
                        "OPENAI_API_KEY=${envProps.OPENAI_API_KEY}",
                        "spring.cloud.aws.credentials.access-key=${envProps.S3_ACCESS_KEY}",
                        "spring.cloud.aws.credentials.secret-key=${envProps.S3_SECRET_KEY}",
                        "spring.cloud.aws.s3.bucket=${envProps.S3_BUCKET}",
                        "spring.cloud.aws.region.static=ap-northeast-2"
                    ]) {
                        sh """
                            docker-compose --env-file ${envPath} -f ${composePath} up -d --build
                        """
                    }
                }
            }
        }
        
        // 5. 컨테이너 상태 확인 및 안정화 대기
        // stage('Wait for Containers') {
        //     steps {
        //         script {
        //             echo "⏳ 컨테이너 안정화 대기 중..."
        //             sh """
        //                 # 15초 대기
        //                 sleep 15
                        
        //                 # 컨테이너 상태 확인
        //                 docker ps
                        
        //                 # 백엔드 컨테이너 헬스체크
        //                 for i in 1 2 3 4 5 6; do
        //                     if docker ps | grep -E "dearie-backend|lightreborn-backend" | grep -q Running; then
        //                         echo "✅ 백엔드 컨테이너가 실행 중입니다"
        //                         break
        //                     fi
        //                     echo "백엔드 컨테이너 확인 중... (\$i/6)"
        //                     sleep 5
        //                 done
                        
        //                 # 로그 확인
        //                 docker logs dearie-backend --tail 20 || true
        //                 docker logs lightreborn-backend --tail 20 || true
        //             """
        //         }
        //     }
        // }
        
        // 6. Flyway 데이터 마이그레이션
        stage('Flyway Check and Migration') {
            steps {
                script {
                    def projects = ['dearie', 'lightreborn']
                    def workspace = env.WORKSPACE.replaceFirst("^/var/jenkins_home", "/home/ubuntu/jenkins-data")
                    
                    projects.each { project ->
                        def projUpper = project.toUpperCase()
                        def migrationPath = (params.ENV == 'master') ?
                            "${workspace}/${project}/backend/src/main/resources/db/migration_master" :
                            "${workspace}/${project}/backend/src/main/resources/db/migration"
                        
                        // 마이그레이션 파일 존재 확인
                        def hasMigrationFiles = sh(script: "ls -la ${migrationPath}/*.sql 2>/dev/null || true", returnStatus: true) == 0
                        
                        if (!hasMigrationFiles) {
                            echo "⚠️ No migration files found in ${migrationPath}, skipping Flyway for ${project}"
                            return
                        }
                        
                        // 환경 변수 값을 직접 가져와서 변수로 저장
                        def dbUrl = envProps.get("${projUpper}_DB_URL") ?: "jdbc:postgresql://${project}-db:5432/${project}"
                        def dbUser = envProps.get("${projUpper}_DB_USER") ?: "ssafy"
                        def dbPassword = envProps.get("${projUpper}_DB_PASSWORD") ?: "ssafy"
                        
                        echo "🚀 Running Flyway for ${project} - path: ${migrationPath}"
                        echo "🔗 Using Database URL: ${dbUrl}"
                        
                        // 네트워크 이름을 실제 사용 중인 것으로 변경
                        def networkName = (project == 'dearie') ? 'backend_dearie' : 'backend_lightreborn'
                        
                        def baseCmd = """
                            docker run --rm \\
                            --network ${networkName} \\
                            -v ${migrationPath}:/flyway/sql \\
                            flyway/flyway \\
                            -locations=filesystem:/flyway/sql \\
                            -url='${dbUrl}' \\
                            -user=${dbUser} \\
                            -password=${dbPassword} \\
                            -baselineOnMigrate=true
                        """.stripIndent().trim()
                        
                        // 먼저 info 명령으로 상태 확인
                        def infoOutput = sh(script: "${baseCmd} info -outputType=json || true", returnStdout: true).trim()
                        
                        // 에러 메시지가 포함되어 있는지 확인
                        if (infoOutput.contains("ERROR:") || infoOutput.contains("Usage flyway")) {
                            echo "⚠️ Flyway info command failed for ${project}: ${infoOutput}"
                            echo "⚠️ Skipping Flyway migration for ${project}"
                            return
                        }
                        
                        def infoJson
                        try {
                            infoJson = readJSON text: infoOutput
                            
                            // 마이그레이션이 필요한지 확인
                            def pendingMigrations = infoJson.migrations?.findAll { it.state == "pending" }
                            if (!pendingMigrations || pendingMigrations.isEmpty()) {
                                echo "✅ No pending migrations for ${project}, skipping migrate command"
                                return
                            }
                            
                            // 실패한 마이그레이션이 있는지 확인
                            def failedMigrations = infoJson.migrations?.findAll { 
                                it.state.toLowerCase() in ['failed', 'missing_success', 'outdated', 'ignored'] 
                            }
                            
                            if (failedMigrations && !failedMigrations.isEmpty()) {
                                echo "🔧 Failed migrations detected for ${project}, running repair"
                                sh "${baseCmd} repair"
                            }
                            
                            // 마이그레이션 실행
                            echo "🚀 Running migrations for ${project}"
                            sh "${baseCmd} migrate"
                        } catch (e) {
                            echo "⚠️ Error processing Flyway info for ${project}: ${e.message}"
                            echo "⚠️ Attempting to migrate anyway"
                            sh "${baseCmd} migrate || true"
                        }
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
                    rm -f payload.json 2>/dev/null || true
                """
            }
        }

        success {
            script {
                if (params.ENV == 'master') {
                    echo '🎉 Build 성공 → Stable 이미지 태깅 및 푸시'
                    sh '''
                        docker tag dearie-backend dearie-backend:stable
                        docker tag lightreborn-backend lightreborn-backend:stable
                        docker push dearie-backend:stable
                        docker push lightreborn-backend:stable
                    '''
                }
            }
        }

        failure {
            script {
                if (params.ENV == 'master') {
                    echo '⛔ 실패 → 이전 stable 이미지로 롤백 시도'
                    sh '''
                        docker stop dearie-backend || true
                        docker stop lightreborn-backend || true
                        docker rm dearie-backend || true
                        docker rm lightreborn-backend || true
                        docker pull dearie-backend:stable
                        docker pull lightreborn-backend:stable
                        
                        # 올바른 네트워크 이름 사용
                        docker run -d --name dearie-backend --network backend_dearie -p 8082:8082 dearie-backend:stable
                        docker run -d --name lightreborn-backend --network backend_lightreborn -p 8081:8081 lightreborn-backend:stable
                    '''
                }
            }
        }
    }
}