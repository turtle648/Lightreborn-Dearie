"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function InstallPWA() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if the device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Handle beforeinstallprompt event for non-iOS devices
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install button
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallPrompt(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)

    // Hide the install button
    setShowInstallPrompt(false)

    // Log the outcome
    console.log(`User ${outcome} the A2HS prompt`)
  }

  const dismissPrompt = () => {
    setShowInstallPrompt(false)
    // Store in localStorage to prevent showing again for some time
    localStorage.setItem("pwaPromptDismissed", Date.now().toString())
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 mx-auto max-w-md px-4">
      <div className="glass-effect rounded-2xl p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium mb-1">Dearie 앱 설치하기</h3>
            {isIOS ? (
              <p className="text-sm text-gray-600">
                홈 화면에 추가하려면 <span className="inline-block">Safari 공유 버튼</span>을 누른 다음{" "}
                <span className="inline-block">"홈 화면에 추가"</span>를 선택하세요.
              </p>
            ) : (
              <p className="text-sm text-gray-600">Dearie를 앱처럼 설치하고 오프라인에서도 사용해보세요.</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isIOS && (
              <Button
                onClick={handleInstallClick}
                className="rounded-full bg-gradient-soft text-white"
                aria-label="앱 설치하기"
              >
                설치하기
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={dismissPrompt} className="rounded-full" aria-label="닫기">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
