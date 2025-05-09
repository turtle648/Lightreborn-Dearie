/**
 * 유효성 검사 유틸리티 함수
 */

/**
 * 이메일 유효성 검사 함수
 * @param email 이메일 주소
 * @returns 유효성 여부
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 비밀번호 유효성 검사 함수
 * @param password 비밀번호
 * @returns 유효성 여부와 오류 메시지
 */
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: "비밀번호는 8자 이상이어야 합니다." }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "비밀번호는 대문자를 포함해야 합니다." }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "비밀번호는 소문자를 포함해야 합니다." }
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "비밀번호는 숫자를 포함해야 합니다." }
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: "비밀번호는 특수문자를 포함해야 합니다." }
  }

  return { isValid: true }
}

/**
 * 일기 내용 유효성 검사 함수
 * @param content 일기 내용
 * @param minLength 최소 길이
 * @param maxLength 최대 길이
 * @returns 유효성 여부와 오류 메시지
 */
export function validateDiaryContent(
  content: string,
  minLength = 10,
  maxLength = 5000,
): { isValid: boolean; message?: string } {
  if (!content || content.trim().length === 0) {
    return { isValid: false, message: "일기 내용을 입력해주세요." }
  }

  if (content.length < minLength) {
    return { isValid: false, message: `일기 내용은 최소 ${minLength}자 이상이어야 합니다.` }
  }

  if (content.length > maxLength) {
    return { isValid: false, message: `일기 내용은 최대 ${maxLength}자까지 입력 가능합니다.` }
  }

  return { isValid: true }
}

/**
 * 감정 유효성 검사 함수
 * @param emotion 감정
 * @param validEmotions 유효한 감정 목록
 * @returns 유효성 여부
 */
export function isValidEmotion(emotion: string, validEmotions: string[]): boolean {
  return validEmotions.includes(emotion)
}
