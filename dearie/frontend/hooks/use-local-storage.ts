"use client"

import { useState, useEffect } from "react"

interface UseLocalStorageReturn<T> {
  value: T
  setValue: (value: T) => void
  removeValue: () => void
}

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  // 상태 초기화
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // localStorage에서 값 가져오기
  useEffect(() => {
    try {
      if (typeof window === "undefined") return

      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`localStorage에서 ${key} 값을 가져오는 중 오류 발생:`, error)
    }
  }, [key])

  // 값 설정 함수
  const setValue = (value: T) => {
    try {
      if (typeof window === "undefined") return

      // 상태 업데이트
      setStoredValue(value)

      // localStorage 업데이트
      window.localStorage.setItem(key, JSON.stringify(value))

      // 이벤트 발생 (다른 탭/창에서 동기화를 위해)
      window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(value) }))
    } catch (error) {
      console.error(`localStorage에 ${key} 값을 저장하는 중 오류 발생:`, error)
    }
  }

  // 값 삭제 함수
  const removeValue = () => {
    try {
      if (typeof window === "undefined") return

      // localStorage에서 항목 삭제
      window.localStorage.removeItem(key)

      // 상태 초기화
      setStoredValue(initialValue)

      // 이벤트 발생
      window.dispatchEvent(new StorageEvent("storage", { key, newValue: null }))
    } catch (error) {
      console.error(`localStorage에서 ${key} 값을 삭제하는 중 오류 발생:`, error)
    }
  }

  return { value: storedValue, setValue, removeValue }
}
