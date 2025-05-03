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
                        def envFilePath = "${env.WORKSPACE}/.env"

                        // .env 파일 동적으로 생성
                        writeFile file: envFilePath, text: DOTENV

                        // 존재 확인
                        if (!fileExists(envFilePath)) {
                            error "❌ .env 파일이 ${envFilePath} 위치에 존재하지 않습니다."
                        }

                        envProps = readProperties file: envFilePath
                        echo "✅ .env 파일 로딩 완료: ${envProps}"
                    }
                }
            }
        }
        // 2. 기존 컨테이너 정리
        stage('Clean up Existing Containers') {
            steps {
                script {
                    def composePath = "${env.WORKSPACE}/docker-compose.yml"
                    def envPath = "${env.WORKSPACE}/.env"

                    sh """
                        echo "🧹 docker-compose down"
                        docker-compose --env-file ${envPath} -f ${composePath} down || true
                    """
                }
            }
        }

        // 3. 빌드 및 배포
        stage('Docker Compose Up') {
            steps {
                script {
                    echo "🚀 docker-compose up"
                    // envProps에서 필요한 환경 변수를 설정
                    withEnv([
                        "DEARIE_DB_URL=${envProps.DEARIE_DB_URL}",
                        "DEARIE_DB_USER=${envProps.DEARIE_DB_USER}",
                        "DEARIE_DB_PASSWORD=${envProps.DEARIE_DB_PASSWORD}",
                        "DEARIE_DB_NAME=${envProps.DEARIE_DB_NAME}",
                        "LIGHT_DB_URL=${envProps.LIGHT_DB_URL}",
                        "LIGHT_DB_USER=${envProps.LIGHT_DB_USER}",
                        "LIGHT_DB_PASSWORD=${envProps.LIGHT_DB_PASSWORD}",
                        "LIGHT_DB_NAME=${envProps.LIGHT_DB_NAME}",
                        "JWT_SECRET=${envProps.JWT_SECRET}"
                    ]) {
                        sh """
                            docker-compose -f docker-compose.yml up -d --build
                        """
                    }
                }
            }
        }        
        // 4. Flyway 데이터 마이그레이션
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
                            return // 현재 프로젝트의 처리를 건너뛰고 다음 프로젝트로 넘어감
                        }
                        
                        // 환경 변수 값을 직접 가져와서 변수로 저장
                        def dbUrl = envProps.get("${projUpper}_DB_URL") ?: "jdbc:postgresql://${project}-db:5432/${project}"
                        def dbUser = envProps.get("${projUpper}_DB_USER") ?: "ssafy"
                        def dbPassword = envProps.get("${projUpper}_DB_PASSWORD") ?: "ssafy"
                        
                        echo "🚀 Running Flyway for ${project} - path: ${migrationPath}"
                        echo "🔗 Using Database URL: ${dbUrl}"
                        
                        // 변수를 직접 문자열에 삽입
                        def baseCmd = """
                            docker run --rm \\
                            --network ${project}-net \\
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
                            return // 현재 프로젝트 건너뛰기
                        }
                        
                        def infoJson
                        try {
                            infoJson = readJSON text: infoOutput
                            
                            // 마이그레이션이 필요한지 확인
                            def pendingMigrations = infoJson.migrations?.findAll { it.state == "pending" }
                            if (!pendingMigrations || pendingMigrations.isEmpty()) {
                                echo "✅ No pending migrations for ${project}, skipping migrate command"
                                return // 현재 프로젝트 건너뛰기
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
                            sh "${baseCmd} migrate || true" // 마이그레이션 실패해도 파이프라인은 계속 진행
                        }
                    }
                }
            }
        }

        // 5. 빌드 성공 여부 상태 반영
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

                sh 'find . -name ".env" -delete || true'
                sh 'rm -f payload.json || true'
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
                        docker run -d --name dearie-backend --network shared_backend -p 8082:8082 dearie-backend:stable
                        docker run -d --name lightreborn-backend --network shared_backend -p 8081:8081 lightreborn-backend:stable
                    '''
                }
            }
        }
    }
}
