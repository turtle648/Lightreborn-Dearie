# 1. 빌드
FROM openjdk:21-jdk-slim AS build

WORKDIR /app

# Gradle 캐싱을 위해 먼저 의존성 관련 파일 복사
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./

# 실행 권한 부여
RUN chmod +x gradlew

# 전체 프로젝트 복사 후 재빌드
COPY . .
RUN chmod +x gradlew

# 빌드
RUN ./gradlew build -x test --no-daemon

# 실제 런타임 이미지
FROM openjdk:21-jdk

WORKDIR /app

# OpenCV 관련 필수 라이브러리 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    libopencv-dev \
    libtbb-dev \
    libgtk2.0-dev \
    pkg-config \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev && \
    rm -rf /var/lib/apt/lists/*


# jar 파일 복사
COPY --from=build /app/build/libs/*.jar dearie-backend.jar

EXPOSE 8082

CMD ["java", "-jar", "dearie-backend.jar"]