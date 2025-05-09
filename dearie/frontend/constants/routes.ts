/**
 * 앱 라우트 상수
 */

export const ROUTES = {
  HOME: "/home",
  DIARY: {
    LIST: "/diary",
    NEW: "/diary/new",
    DETAIL: (id: string | number) => `/diary/${id}`,
  },
  MISSION: {
    LIST: "/mission",
    DETAIL: (id: string | number) => `/mission/${id}`,
  },
  MYPAGE: "/mypage",
  SETTINGS: "/settings",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
}
