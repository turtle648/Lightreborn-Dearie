# 1. 빌드
FROM node:22-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package.json package-lock.json ./

# 의존성 설치 (package-lock.json을 100% 따름)
RUN npm ci

# env 파일 복사 - dearie의 env 어떻게 할지
COPY .env.dearie.production .env.production

# 전체 프로젝트 복사
COPY . .

# 빌드 실행
RUN npm run build -- --no-lint

# 2. 런타임
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app ./

EXPOSE 3001

CMD ["npm", "start"]