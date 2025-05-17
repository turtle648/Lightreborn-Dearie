"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function MultipleChoiceSurveyPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = [
    { id: "option1", label: "타임특가" },
    { id: "option2", label: "팀구매 여부" },
    { id: "option3", label: "고려했던 것 없음" },
    { id: "option4", label: "할인쿠폰 적용" },
    { id: "option5", label: "무료 배송" },
    { id: "option6", label: "상품 품질" },
    { id: "option7", label: "포인트 적용" },
    { id: "option8", label: "기타" },
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;

    setIsSubmitting(true);

    try {
      // 여기서 실제로는 API 호출을 통해 설문 결과를 제출합니다
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/survey/thank-you");
    } catch (error) {
      console.error("설문 제출 중 오류 발생:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            '올웨이즈'에서 상품 구매 시, 주로 고려했던 것을 모두 골라주세요.
            (중복 선택 가능)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {options.map((option) => (
              <motion.div
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionSelect(option.id)}
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                  selectedOption === option.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                    selectedOption === option.id
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOption === option.id && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>
                <span>{option.label}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "제출 중..." : "다음"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
