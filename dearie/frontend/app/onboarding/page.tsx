"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "일상의 감정을 기록하세요",
      description: "하루의 감정과 생각을 Dearie와 함께 기록해보세요.",
      image: "/dearie/images/onboarding-1.png",
    },
    {
      title: "감정 패턴을 발견하세요",
      description:
        "시간이 지남에 따라 당신의 감정 패턴을 분석하고 이해할 수 있어요.",
      image: "/dearie/images/onboarding-2.png",
    },
    {
      title: "마음 챙김 미션으로 성장하세요",
      description: "일상 속 작은 미션으로 마음의 평화를 찾아보세요.",
      image: "/dearie/images/onboarding-3.png",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push(ROUTES.AUTH.LOGIN);
    }
  };

  const handleSkip = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSkip}
          className="text-gray-500 font-medium px-4 py-2"
        >
          건너뛰기
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md flex flex-col items-center"
        >
          <div className="relative w-64 h-64 mb-8">
            <Image
              src={slides[currentSlide].image || "/placeholder.svg"}
              alt={slides[currentSlide].title}
              fill
              className="object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-center mb-3 text-gray-800">
            {slides[currentSlide].title}
          </h1>

          <p className="text-center text-gray-600 mb-8">
            {slides[currentSlide].description}
          </p>
        </motion.div>
      </div>

      <div className="mb-12 flex flex-col items-center px-6">
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-full max-w-md bg-primary hover:bg-primary/90"
        >
          {currentSlide === slides.length - 1 ? "시작하기" : "다음"}
        </Button>
      </div>
    </div>
  );
}
