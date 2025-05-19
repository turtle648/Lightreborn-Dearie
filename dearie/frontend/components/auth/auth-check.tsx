"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface AuthCheckProps {
  children: React.ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 인증이 필요하지 않은 경로 목록
    const publicPaths = [
      "/",
      "/onboarding",
      ROUTES.AUTH.LOGIN,
      ROUTES.AUTH.REGISTER,
      ROUTES.AUTH.FORGOT_PASSWORD,
    ];

    // 현재 경로가 인증이 필요한지 확인
    const requiresAuth = !publicPaths.some(
      (path) => pathname === path || pathname.startsWith("/api/")
    );

    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (requiresAuth && !isLoggedIn) {
      // 인증이 필요한 페이지인데 로그인되지 않은 경우
      router.push(ROUTES.AUTH.LOGIN);
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  if (isChecking) {
    // 인증 확인 중에는 아무것도 렌더링하지 않음
    return null;
  }

  return <>{children}</>;
}
