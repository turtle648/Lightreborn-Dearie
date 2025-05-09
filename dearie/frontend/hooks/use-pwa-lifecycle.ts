"use client"

import { useState, useEffect } from "react"

interface UsePWALifecycleReturn {
  isUpdateAvailable: boolean
  updateServiceWorker: () => void
  isStandalone: boolean
}

export function usePWALifecycle(): UsePWALifecycleReturn {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false)
  const [isStandalone, setIsStandalone] = useState<boolean>(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // 앱이 독립 실행 모드인지 확인
    if (typeof window !== "undefined") {
      setIsStandalone(
        window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true,
      )
    }

    // Service Worker 업데이트 확인
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)

        // 업데이트 확인
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setIsUpdateAvailable(true)
              }
            })
          }
        })
      })

      // 다른 탭에서 업데이트된 경우 처리
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (registration && !isUpdateAvailable) {
          setIsUpdateAvailable(true)
        }
      })
    }
  }, [isUpdateAvailable, registration])

  const updateServiceWorker = () => {
    if (registration) {
      registration.update().then(() => {
        // 페이지 새로고침
        window.location.reload()
      })
    }
  }

  return { isUpdateAvailable, updateServiceWorker, isStandalone }
}
