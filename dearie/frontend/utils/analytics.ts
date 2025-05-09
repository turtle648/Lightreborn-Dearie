/**
 * 분석 유틸리티 함수
 */

// 이벤트 타입 정의
type EventType =
  | "page_view"
  | "diary_create"
  | "diary_view"
  | "mission_start"
  | "mission_complete"
  | "app_install"
  | "app_update"
  | "error"

// 이벤트 데이터 인터페이스
interface EventData {
  [key: string]: any
}

/**
 * 이벤트 추적 함수
 * @param eventType 이벤트 타입
 * @param eventData 이벤트 데이터
 */
export function trackEvent(eventType: EventType, eventData: EventData = {}): void {
  // 개발 환경에서는 콘솔에 로그만 출력
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${eventType}:`, eventData)
    return
  }

  // 실제 구현에서는 분석 서비스 호출
  // 예: Google Analytics, Amplitude, Mixpanel 등
  try {
    // 예시: window.gtag('event', eventType, eventData)
    // 예시: window.amplitude.track(eventType, eventData)
    // 현재는 구현되지 않음
  } catch (error) {
    console.error("이벤트 추적 중 오류 발생:", error)
  }
}

/**
 * 페이지 조회 추적 함수
 * @param pageName 페이지 이름
 */
export function trackPageView(pageName: string): void {
  trackEvent("page_view", { page: pageName })
}

/**
 * 오류 추적 함수
 * @param errorMessage 오류 메시지
 * @param errorData 오류 데이터
 */
export function trackError(errorMessage: string, errorData: EventData = {}): void {
  trackEvent("error", {
    message: errorMessage,
    ...errorData,
  })
}

/**
 * 사용자 속성 설정 함수
 * @param properties 사용자 속성
 */
export function setUserProperties(properties: EventData): void {
  // 실제 구현에서는 분석 서비스 호출
  // 예: window.gtag('set', 'user_properties', properties)

  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics] Set user properties:", properties)
  }
}
