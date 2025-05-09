"use client"

import { useState, useEffect } from "react"

interface UsePWAInstallReturn {
  canInstall: boolean
  isIOS: boolean
  deferredPrompt: any
  handleInstall: () => Promise<void>
}

export function usePWAInstall(): UsePWAInstallReturn {
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
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)

    // Log the outcome
    console.log(`User ${outcome} the A2HS prompt`)
  }

  return {
    canInstall: !!deferredPrompt,
    isIOS,
    deferredPrompt,
    handleInstall,
  }
}
