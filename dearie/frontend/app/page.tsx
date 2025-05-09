"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SplashScreen } from "@/components/splash-screen"
import { IntroAnimation } from "@/components/intro-animation"

export default function Home() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    // Show splash screen for 2 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false)

      // Check if user has seen intro before
      const hasSeenIntro = localStorage.getItem("hasSeenIntro")
      if (hasSeenIntro) {
        // Skip intro and go directly to home
        router.push("/home")
      } else {
        // Show intro animation
        setShowIntro(true)
      }
    }, 2000)

    return () => clearTimeout(splashTimer)
  }, [router])

  const handleIntroComplete = () => {
    setShowIntro(false)
    localStorage.setItem("hasSeenIntro", "true")
    router.push("/home")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {showSplash && <SplashScreen />}
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
    </main>
  )
}
