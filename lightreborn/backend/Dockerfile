# 1. 빌드
FROM openjdk:21-jdk-slim AS build

WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./

# 실행 권한 부여
RUN chmod +x gradlew

COPY . .
RUN chmod +x gradlew

# 의존성 설치
RUN ./gradlew build -x test --no-daemon

# 2. 실행 단계
FROM openjdk:21-jdk

WORKDIR /app

# jar 이름 명확히 설정
COPY --from=build /app/build/libs/*.jar lightreborn-backend.jar

EXPOSE 8081

CMD ["java", "-jar", "lightreborn-backend.jar"]
