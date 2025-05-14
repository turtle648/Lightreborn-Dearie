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

/**
 * 초 단위 시간을 시:분:초 형식으로 포맷팅
 * @param seconds - 초 단위 시간
 * @returns 포맷팅된 시간 문자열
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${remainingSeconds}초`
  } else if (minutes > 0) {
    return `${minutes}분 ${remainingSeconds}초`
  } else {
    return `${remainingSeconds}초`
  }
}
