"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSurveyQuestions, postSurveyAnswer } from "@/apis/survey-api";
import {
  PostSurveyAnswerResponse,
  YouthSurveyQuestionDTO,
} from "@/types/response.survey";
import { PostSurveyRequestDTO, PostSurveyAnswer } from "@/types/request.survey";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAgreementStore } from "@/stores/agreement-store";

interface UIQuestion {
  id: number;
  code: string;
  question: string;
  type: "boolean" | "likert" | "single" | "text";
  options: { value: string; label: string }[];
}

const mapQuestionType = (
  options: any[]
): "boolean" | "likert" | "single" | "text" => {
  if (!options || options.length === 0) return "text";
  if (options.length === 2) return "boolean";
  if (options.length === 5) return "likert";
  return "single";
};

const isDateQuestion = (q: UIQuestion) =>
  q.type === "text" && q.question.includes("날짜");

// 날짜 타임존 수정 함수
const adjustDateForTimezone = (date: Date | string | undefined) => {
  if (!date) return undefined;

  const d = typeof date === "string" ? new Date(date) : new Date(date);

  // UTC 날짜 얻기
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();

  // 로컬 시간으로 새 날짜 생성 (시간 정보 없이)
  return new Date(year, month, day, 12, 0, 0);
};

// ISO 문자열로 변환 시 타임존 문제 해결
const formatDateToISO = (date: Date | undefined) => {
  if (!date) return "";

  // 날짜를 YYYY-MM-DD 형식으로 변환 (시간 정보 제외)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function SurveyPage() {
  const router = useRouter();
  const [surveyQuestions, setSurveyQuestions] = useState<UIQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { agreements, hasHydrated, setAgreements } = useAgreementStore();

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchSurvey = async () => {
      try {
        const surveyInfo = await getSurveyQuestions();

        console.log("받은 agreements:", surveyInfo.agreements);
        setAgreements(surveyInfo.agreements); // 조건 없이 저장

        const mapped = surveyInfo.questions.map((q) => ({
          id: q.questionId,
          code: q.code,
          question: q.description,
          type: mapQuestionType(q.options),
          options: q.options.map((opt) => ({
            value: String(opt.optionId),
            label: opt.optionText,
          })),
        }));
        setSurveyQuestions(mapped);
      } catch (e) {
        console.error("설문 불러오기 실패:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, [hasHydrated]);

  const handleAnswer = (value: string) => {
    const currentId = surveyQuestions[currentQuestionIndex]?.id;
    setAnswers((prev) => ({ ...prev, [currentId]: value }));
  };

  const formattedAnswers = (
    answers: Record<number, string>
  ): PostSurveyRequestDTO => {
    return {
      answers: surveyQuestions.map<PostSurveyAnswer>((q) => {
        const rawValue = answers[q.id];
        return {
          questionId: q.id,
          optionId:
            q.type === "text" || isDateQuestion(q)
              ? null
              : rawValue !== undefined
              ? parseInt(rawValue)
              : null,
          answerText:
            q.type === "text" || isDateQuestion(q) ? rawValue ?? "" : "",
        };
      }),
    };
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
      router.push("/mypage");
    }
  };

  const { setSurveyId } = useAgreementStore(); // ✅ Zustand setter 포함

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const requestDto: PostSurveyRequestDTO = formattedAnswers(answers);
      const responseDTO: PostSurveyAnswerResponse = await postSurveyAnswer(
        requestDto
      );

      if (responseDTO.id) {
        setSurveyId(responseDTO.id);
      }

      router.push(`/survey/results?resultId=${responseDTO.id}`);
    } catch (e) {
      console.error("설문 제출 실패:", e);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-center py-10">설문을 불러오는 중입니다...</p>;
  }

  if (surveyQuestions.length === 0) {
    return <p className="text-center py-10">설문 데이터가 없습니다.</p>;
  }

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / surveyQuestions.length) * 100;

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
              {isDateQuestion(currentQuestion) ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-primary/30 hover:border-primary/70 hover:bg-primary/10 transition-all focus:ring-primary/30 focus:border-primary"
                    >
                      {answers[currentQuestion.id] ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-primary mr-2" />
                          <span>
                            {new Date(
                              answers[currentQuestion.id]
                            ).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-muted-foreground">
                          <div className="w-4 h-4 rounded-full border border-primary/40 mr-2" />
                          <span>날짜를 선택하세요</span>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-primary/30">
                    <Calendar
                      mode="single"
                      selected={
                        answers[currentQuestion.id]
                          ? adjustDateForTimezone(answers[currentQuestion.id])
                          : undefined
                      }
                      onSelect={(date: Date | undefined) => {
                        if (date) {
                          // 타임존 문제 수정: 날짜 부분만 사용
                          const formattedDate = formatDateToISO(date);
                          handleAnswer(formattedDate);
                        }
                      }}
                      initialFocus
                      defaultMonth={new Date()}
                    />
                    {answers[currentQuestion.id] && (
                      <div className="p-3 border-t border-primary/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-primary hover:bg-primary/10 hover:text-primary-dark w-full focus:ring-primary/30"
                          onClick={() => handleAnswer("")}
                        >
                          날짜 선택 취소
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              ) : currentQuestion.type === "text" ? (
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  placeholder="답변을 입력하세요"
                />
              ) : (
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 rounded-md border p-3 hover:bg-primary/5 transition-colors border-primary/20"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`option-${option.value}`}
                        className="text-primary border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
              )}
            </CardContent>
          </Card>

          <Button
            onClick={handleNext}
            disabled={
              (currentQuestion.type !== "text" &&
                !answers[currentQuestion.id]) ||
              isSubmitting
            }
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
