pipeline {
    agent any

    parameters {
  		choice(name: 'ENV', choices: ['develop', 'master'], description: 'Select deploy environment')
	}

    environment {
        MATTERMOST_WEBHOOK_ID = 'MATTERMOST_WEBHOOK'
        IMAGE_BUILD_SUCCESS = "false"
    }

    stages {
        // 1. 먼저 .env 파일부터 읽음
        stage('Load .env File') {
            steps {
                withCredentials([string(credentialsId: 'soboro-dotenv', variable: 'DOTENV')]) {
                    script {
                        def envFilePath = "cicd/.env"

                        // .env 파일 동적으로 생성
                        writeFile file: envFilePath, text: DOTENV

                        // 존재 확인
                        if (!fileExists(envFilePath)) {
                            error "❌ .env 파일이 ${envFilePath} 위치에 존재하지 않습니다."
                        }

                        env.ENV_PROPS = readProperties file: envFilePath
                        echo "✅ .env 파일을 Credentials로부터 로딩 완료"
                    }
                }
            }
        }

        // 2. 빌드 및 배포
        stage('Docker Compose Up') {
            steps {
                script {
                    echo "🚀 docker-compose up"
                    sh """
                        docker-compose -f docker-compose.yml up -d --build
                    """
                }
            }
        }        
        // 3. Flyway 데이터 마이그레이션
        stage('Flyway Check and Migration') {
            steps {
                script {
                    def projects = ['dearie', 'lightreborn']
                    def workspace = env.WORKSPACE.replaceFirst("^/var/jenkins_home", "/home/ubuntu/jenkins-data")
                    
                    projects.each { project ->
                        def dbUrl = envProps["${project.toUpperCase()}_DB_URL"]
                        def dbUser = envProps["${project.toUpperCase()}_DB_USER"]
                        def dbPassword = envProps["${project.toUpperCase()}_DB_PASSWORD"]
                        def migrationPath = (params.ENV == 'master') ?
                            "${workspace}/${project}/backend/src/main/resources/db/migration_master" :
                            "${workspace}/${project}/backend/src/main/resources/db/migration"

                        echo "🚀 Running Flyway for ${project} - path: ${migrationPath}"

                        def baseCmd = """
                            docker run --rm \\
                              --network shared-net \\
                              -v ${migrationPath}:/flyway/sql \\
                              flyway/flyway \\
                              -locations=filesystem:/flyway/sql \\
                              -url='${dbUrl}' \\
                              -user=${dbUser} \\
                              -password=${dbPassword}
                        """.stripIndent().trim()

                        def infoOutput = sh(script: "${baseCmd} info -outputType=json || true", returnStdout: true).trim()
                        def infoJson

                        try {
                            infoJson = readJSON text: infoOutput
                        } catch (e) {
                            if (infoOutput.contains("Validate failed") || infoOutput.contains("Detected failed migration")) {
                                echo "⚠️ Repairing Flyway for ${project}"
                                sh "${baseCmd} repair"
                                infoOutput = sh(script: "${baseCmd} info -outputType=json", returnStdout: true).trim()
                                infoJson = readJSON text: infoOutput
                            } else {
                                error "❌ Flyway info failed for ${project}: ${infoOutput}"
                            }
                        }

                        def needsRepair = infoJson?.migrations?.any {
                            it.state.toLowerCase() in ['failed', 'missing_success', 'outdated', 'ignored']
                        } ?: false

                        if (needsRepair) {
                            echo "🔧 Migration issue detected for ${project}, running repair"
                            sh "${baseCmd} repair"
                        }

                        sh "${baseCmd} migrate"
                    }
                }
            }
        }

        // 4. 빌드 성공 여부 상태 반영
        stage('Mark Image Build Success') {
            steps {
                script {
                    env.IMAGE_BUILD_SUCCESS = "true"
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

                if (env.IMAGE_BUILD_SUCCESS == "true") {
                    sendMessage("✅ 배포 성공 : `${env.ENV}` 환경\n- Job: `${env.JOB_NAME}`\n- Build: #${env.BUILD_NUMBER}")
                } else {
                    sendMessage("❌ 배포 실패 : `${env.ENV}` 환경\n- Job: `${env.JOB_NAME}`\n- Build: #${env.BUILD_NUMBER}\n- [로그 확인하기](${env.BUILD_URL})")
                }

                sh 'find . -name ".env" -delete || true'
                sh 'rm -f payload.json || true'
            }
        }

        success {
            when {
                expression { params.ENV == 'master' }
            }
            steps {
                echo '🎉 Build 성공 → Stable 이미지 태깅 및 푸시'
                sh '''
                    docker tag dearie-backend dearie-backend:stable
                    docker tag lightreborn-backend lightreborn-backend:stable
                    docker push dearie-backend:stable
                    docker push lightreborn-backend:stable
                '''
            }
        }

        failure {
            when {
                expression { params.ENV == 'master' }
            }
            steps {
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
