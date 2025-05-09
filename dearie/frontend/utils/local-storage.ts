/**
 * 로컬 스토리지에 데이터를 저장하는 함수
 * @param key - 저장할 키
 * @param value - 저장할 값
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error("로컬 스토리지에 저장 중 오류 발생:", error)
  }
}

/**
 * 로컬 스토리지에서 데이터를 가져오는 함수
 * @param key - 가져올 키
 * @param defaultValue - 기본값
 * @returns 저장된 값 또는 기본값
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const serializedValue = localStorage.getItem(key)
    if (serializedValue === null) return defaultValue
    return JSON.parse(serializedValue) as T
  } catch (error) {
    console.error("로컬 스토리지에서 가져오는 중 오류 발생:", error)
    return defaultValue
  }
}

/**
 * 로컬 스토리지에서 데이터를 삭제하는 함수
 * @param key - 삭제할 키
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error("로컬 스토리지에서 삭제 중 오류 발생:", error)
  }
}
