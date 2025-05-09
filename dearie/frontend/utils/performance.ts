/**
 * 성능 측정 유틸리티 함수
 */

/**
 * 성능 측정 시작 함수
 * @param markName 마크 이름
 */
export function startPerformanceMeasure(markName: string): void {
  if (typeof performance === "undefined") return

  try {
    performance.mark(`${markName}_start`)
  } catch (error) {
    console.error(`성능 측정 시작 중 오류 발생 (${markName}):`, error)
  }
}

/**
 * 성능 측정 종료 함수
 * @param markName 마크 이름
 * @param logToConsole 콘솔에 로그 출력 여부
 * @returns 측정 시간 (밀리초)
 */
export function endPerformanceMeasure(markName: string, logToConsole = false): number | undefined {
  if (typeof performance === "undefined") return

  try {
    performance.mark(`${markName}_end`)

    // 측정 생성
    performance.measure(markName, `${markName}_start`, `${markName}_end`)

    // 측정 결과 가져오기
    const entries = performance.getEntriesByName(markName)
    const duration = entries.length > 0 ? entries[0].duration : undefined

    // 콘솔에 로그 출력
    if (logToConsole && duration !== undefined) {
      console.log(`[Performance] ${markName}: ${duration.toFixed(2)}ms`)
    }

    // 마크 정리
    performance.clearMarks(`${markName}_start`)
    performance.clearMarks(`${markName}_end`)
    performance.clearMeasures(markName)

    return duration
  } catch (error) {
    console.error(`성능 측정 종료 중 오류 발생 (${markName}):`, error)
    return undefined
  }
}

/**
 * Web Vitals 측정 함수
 * 실제 구현에서는 web-vitals 라이브러리 사용
 */
export function measureWebVitals(): void {
  if (typeof window === "undefined") return

  try {
    // 예시: 실제 구현에서는 web-vitals 라이브러리 사용
    // import { getCLS, getFID, getLCP } from 'web-vitals'
    //
    // getCLS(metric => {
    //   console.log('CLS:', metric.value)
    //   // 서버에 보고
    // })
    //
    // getFID(metric => {
    //   console.log('FID:', metric.value)
    //   // 서버에 보고
    // })
    //
    // getLCP(metric => {
    //   console.log('LCP:', metric.value)
    //   // 서버에 보고
    // })
  } catch (error) {
    console.error("Web Vitals 측정 중 오류 발생:", error)
  }
}
