/**
 * 앱 전역 설정 상수
 */

export const APP_CONFIG = {
  name: "Dearie",
  description: "일기기반 정신건강 자가진단 앱",
  version: "1.0.0",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  imageBaseUrl: process.env.NEXT_PUBLIC_IMAGE_URL || "",
  defaultLanguage: "ko",
  supportedLanguages: ["ko", "en"],
  theme: {
    primary: "#f1b29f",
    primaryLight: "#f8d5cb",
    primaryDark: "#e89a84",
  },
  pwa: {
    enabled: true,
    installPromptDelay: 3000, // 3초 후 설치 프롬프트 표시
    installPromptCooldown: 7 * 24 * 60 * 60 * 1000, // 7일 동안 다시 표시��지 않음
  },
  diary: {
    maxLength: 5000, // 일기 최대 길이
    minLength: 10, // 일기 최소 길이
    autosaveInterval: 30000, // 30초마다 자동 저장
  },
  mission: {
    dailyLimit: 3, // 하루에 표시할 미션 수
    refreshTime: "00:00", // 미션 갱신 시간 (자정)
  },
};
