"use client"

import { useState, useEffect } from "react"

interface UseOfflineModeReturn {
  isOffline: boolean
  wasOffline: boolean
  setWasOffline: (value: boolean) => void
}

export function useOfflineMode(): UseOfflineModeReturn {
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [wasOffline, setWasOffline] = useState<boolean>(false)

  useEffect(() => {
    // 초기 오프라인 상태 확인
    if (typeof navigator !== "undefined" && "onLine" in navigator) {
      setIsOffline(!navigator.onLine)
    }

    // 온라인/오프라인 이벤트 리스너
    const handleOnline = () => {
      setIsOffline(false)
      // 오프라인 상태였다가 온라인이 되면 wasOffline을 true로 설정
      if (isOffline) {
        setWasOffline(true)
      }
    }

    const handleOffline = () => {
      setIsOffline(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isOffline])

  return { isOffline, wasOffline, setWasOffline }
}
