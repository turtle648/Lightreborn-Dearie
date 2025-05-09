/**
 * 날짜를 포맷팅하는 유틸리티 함수
 * @param date - 날짜 객체 또는 날짜 문자열
 * @param format - 포맷 옵션 ('full', 'short', 'time')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(date: Date | string, format: "full" | "short" | "time" = "full"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  if (format === "full") {
    return dateObj.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    })
  }

  if (format === "short") {
    return dateObj.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    })
  }

  if (format === "time") {
    return dateObj.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return dateObj.toLocaleDateString("ko-KR")
}
