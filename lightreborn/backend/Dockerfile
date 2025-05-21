# 1. 빌드 단계
FROM openjdk:21-jdk-slim AS build

WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./
RUN chmod +x gradlew

COPY . .
RUN chmod +x gradlew
RUN ./gradlew build -x test --no-daemon

# 2. 실행 단계 (FFmpeg 포함)
FROM openjdk:21-jdk-slim

WORKDIR /app

# FFmpeg 설치
RUN apt update && \
    apt install -y ffmpeg && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

ENV FFMPEG_PATH=/usr/bin/ffmpeg

COPY --from=build /app/build/libs/*.jar lightreborn-backend.jar

EXPOSE 8081

CMD ["java", "-jar", "lightreborn-backend.jar"]
