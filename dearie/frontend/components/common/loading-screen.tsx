"use client";

import type React from "react";

import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  loadingMessage?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  customIcon?: React.ReactNode;
  className?: string;
}

export function LoadingScreen({
  title = "데이터를 불러오는 중",
  subtitle,
  loadingMessage = "잠시만 기다려주세요.",
  showBackButton = false,
  onBackClick,
  customIcon,
  className,
}: LoadingScreenProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div
      className={`container mx-auto py-8 px-4 max-w-md min-h-screen flex flex-col ${className}`}
    >
      {showBackButton && (
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로 가기
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <h1 className="text-3xl font-bold mb-6">{subtitle}</h1>}
          <p className="text-gray-500 mb-16">{loadingMessage}</p>

          {customIcon ? (
            customIcon
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="mx-auto w-24 h-24"
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10ZM60 100C37.9 100 20 82.1 20 60C20 37.9 37.9 20 60 20C82.1 20 100 37.9 100 60C100 82.1 82.1 100 60 100Z"
                  fill="#E6E6E6"
                />
                <path
                  d="M60 10C46.9 10 34.7 15.2 25.9 24.1L33.4 31.6C40.3 24.7 49.7 20.6 60 20.6C82.1 20.6 100 38.5 100 60.6C100 82.7 82.1 100.6 60 100.6C37.9 100.6 20 82.7 20 60.6C20 50.3 24.1 40.9 31 34L23.5 26.5C14.6 35.3 9.4 47.5 9.4 60.6C9.4 88.2 32.4 110.6 60 110.6C87.6 110.6 110 88.2 110 60.6C110 33 87.6 10 60 10Z"
                  fill="url(#paint0_linear)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="25.9"
                    y1="24.1"
                    x2="95"
                    y2="96"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4285F4" />
                    <stop offset="1" stopColor="#EA4335" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
