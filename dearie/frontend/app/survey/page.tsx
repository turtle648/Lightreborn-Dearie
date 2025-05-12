"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// 설문 문항 데이터
const surveyQuestions = [
  {
    id: 1,
    question:
      "나는 지난 1주일 간 경제(소비/생산)활동이 전혀 없었고, 1개월 이내에 구직활동 및 학업활동을 하지 않았다.",
    type: "boolean",
    options: [
      { value: "true", label: "O" },
      { value: "false", label: "X" },
    ],
  },
  {
    id: 2,
    question: "나의 생활패턴에 가장 가까운 생활을 선택해주세요.",
    type: "single",
    options: [
      {
        value: "hobby",
        label: "보통 집에 있으며, 나의 취미생활을 위하여 외출함",
      },
      { value: "medical", label: "보통 집에 있으며, 의료적 이유로 밖에 나감" },
      {
        value: "isolated",
        label: "나의 방에서 나오지 않으며, 가족과도 접촉하지 않음",
      },
      { value: "mostly_isolated", label: "나의 방에서 거의 나오지 않음" },
    ],
  },
  {
    id: 3,
    question: "나는 사람과 거리를 둔다.",
    type: "likert",
    options: [
      { value: "1", label: "해당되지 않는다" },
      { value: "2", label: "별로 해당되지 않는다" },
      { value: "3", label: "어느 정도 아니다" },
      { value: "4", label: "조금 해당된다" },
      { value: "5", label: "매우 해당된다" },
    ],
  },
  {
    id: 4,
    question: "하루종일 집에서 보낸다.",
    type: "likert",
    options: [
      { value: "1", label: "해당되지 않는다" },
      { value: "2", label: "별로 해당되지 않는다" },
      { value: "3", label: "어느 정도 아니다" },
      { value: "4", label: "조금 해당된다" },
      { value: "5", label: "매우 해당된다" },
    ],
  },
  {
    id: 5,
    question: "모르는 사람과 만나는 것을 아주 좋아한다.",
    type: "likert",
    options: [
      { value: "1", label: "해당되지 않는다" },
      { value: "2", label: "별로 해당되지 않는다" },
      { value: "3", label: "어느 정도 아니다" },
      { value: "4", label: "조금 해당된다" },
      { value: "5", label: "매우 해당된다" },
    ],
  },
];

export default function SurveyPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / surveyQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      router.push("/monthly-report");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 여기서 실제로는 API 호출을 통해 설문 결과를 제출합니다
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 로딩 페이지가 아닌 결과 페이지로 직접 리다이렉트
      router.push("/survey/results");
    } catch (error) {
      console.error("설문 제출 중 오류 발생:", error);
      setIsSubmitting(false);
    }
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

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {currentQuestionIndex + 1} / {surveyQuestions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`option-${option.value}`}
                    />
                    <Label
                      htmlFor={`option-${option.value}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] || isSubmitting}
            className="w-full"
          >
            {isSubmitting
              ? "제출 중..."
              : currentQuestionIndex === surveyQuestions.length - 1
              ? "제출하기"
              : "다음"}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
