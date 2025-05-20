"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/splash-screen";
import { IntroAnimation } from "@/components/intro-animation";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // 이미 로그인한 사용자인지 확인
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // Show splash screen for 2 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);

      if (isLoggedIn) {
        // 로그인된 사용자는 홈으로 이동
        router.push(ROUTES.HOME);
      } else {
        // 로그인되지 않은 사용자
        // Check if user has seen intro before
        const hasSeenIntro = localStorage.getItem("hasSeenIntro");
        if (hasSeenIntro) {
          // Skip intro and go directly to onboarding
          router.push("/onboarding");
        } else {
          // Show intro animation
          setShowIntro(true);
        }
      }
    }, 1800);

    return () => clearTimeout(splashTimer);
  }, [router]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem("hasSeenIntro", "true");
    router.push("/onboarding");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {showSplash && <SplashScreen />}
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
    </main>
  );
}
