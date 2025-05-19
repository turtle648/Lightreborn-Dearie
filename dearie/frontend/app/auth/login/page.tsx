"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = () => {
    setIsLoading(true);
    // 게스트 로그인 처리 (실제로는 API 호출 등이 필요)
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", "guest");
      router.push(ROUTES.HOME);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
            <p className="text-gray-600">Dearie에 오신 것을 환영합니다</p>
          </div>

          <LoginForm />

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isLoading ? "처리 중..." : "게스트로 시작하기"}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <Link
                href={ROUTES.AUTH.REGISTER}
                className="font-medium text-primary hover:text-primary/80"
              >
                회원가입
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
