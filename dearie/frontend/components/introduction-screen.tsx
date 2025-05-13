"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
// ConsentModal import 제거

interface IntroductionScreenProps {
  title: string;
  subtitle?: string;
  description: string | ReactNode;
  imageSrc: string;
  imageAlt: string;
  buttonText: string;
  onButtonClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  showShareButton?: boolean;
  shareButtonText?: string;
  onShareClick?: () => void;
  // 동의 모달 관련 props 제거
  redirectPath?: string;
  className?: string;
  imageSize?: number;
}

export function IntroductionScreen({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  buttonText,
  onButtonClick,
  onBackClick,
  showBackButton = true,
  showShareButton = false,
  shareButtonText = "공유하기",
  onShareClick,
  redirectPath,
  className = "",
  imageSize = 192,
}: IntroductionScreenProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (redirectPath) {
      router.push(redirectPath);
    }
  };

  const handleShare = () => {
    if (onShareClick) {
      onShareClick();
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-white ${className}`}>
      {/* 헤더 */}
      {(showBackButton || showShareButton) && (
        <header className="flex items-center justify-between p-4 border-b">
          {showBackButton && (
            <button onClick={handleBack} aria-label="뒤로 가기">
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          {!showBackButton && <div />}

          {showShareButton && (
            <button onClick={handleShare} className="text-sm">
              {shareButtonText}
            </button>
          )}
          {!showShareButton && <div />}
        </header>
      )}

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center px-6 pt-10 pb-6">
        {/* 이미지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-${imageSize / 4} h-${imageSize / 4} mb-10`}
        >
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={imageAlt}
            width={imageSize}
            height={imageSize}
            className="object-contain"
          />
        </motion.div>

        {/* 텍스트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-auto"
        >
          {subtitle && <p className="text-gray-500 text-sm mb-2">{subtitle}</p>}
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          {typeof description === "string" ? (
            <p className="text-gray-600 text-sm">{description}</p>
          ) : (
            <div className="text-gray-600 text-sm">{description}</div>
          )}
        </motion.div>

        {/* 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full mt-6"
        >
          <Button
            onClick={handleButtonClick}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-md text-base"
          >
            {buttonText}
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
