"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSurveyQuestions,
  postSurveyAnswer,
  postAgreement,
  postSurveyResultToDashboard,
  postSurveyAnswerByGuest,
} from "@/apis/survey-api";
import {
  PostSurveyAnswerResponse,
  YouthSurveyQuestionDTO,
  AgreementDTO,
} from "@/types/response.survey";
import {
  PostSurveyRequestDTO,
  PostSurveyAnswer,
  PostSurveyWithOutSignUp,
} from "@/types/request.survey";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IntroductionScreen } from "@/components/introduction-screen";
import { ConsentModal, type ConsentItem } from "@/components/consent-modal";

interface UIQuestion {
  id: number;
  code: string;
  question: string;
  type: "boolean" | "likert" | "single" | "text";
  options: { value: string; label: string }[];
}

// 개인정보 인터페이스
interface PersonalInfo {
  name: string;
  gender: string;
  birthDate: string;
  age: string;
  phoneNumber: string;
  emergencyContact: string;
}

// 페이지 상태 타입
type PageState = "intro" | "survey" | "results" | "consent";

// 질문 유형 판별 함수
const mapQuestionType = (
  options: any[]
): "boolean" | "likert" | "single" | "text" => {
  if (!options || options.length === 0) return "text";
  if (options.length === 2) return "boolean";
  if (options.length === 5) return "likert";
  return "single";
};

// 날짜 질문인지 확인하는 함수
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

// 생년월일로부터 나이 계산 함수
const calculateAge = (birthDate: string): string => {
  if (!birthDate) return "";

  const today = new Date();
  const birthDateObj = new Date(birthDate);

  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }

  return String(age);
};

export default function SurveyPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("intro");
  const [surveyQuestions, setSurveyQuestions] = useState<UIQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1은 개인정보 페이지를 의미
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    gender: "",
    birthDate: "",
    age: "",
    phoneNumber: "",
    emergencyContact: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const { agreements, hasHydrated, setAgreements, setSurveyId } =
    useAgreementStore();

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

  // 인트로 화면 시작 버튼 핸들러
  const handleStartSurvey = () => {
    setPageState("survey");
  };

  const handleAnswer = (value: string) => {
    if (currentQuestionIndex === -1) return;

    const currentId = surveyQuestions[currentQuestionIndex]?.id;
    setAnswers((prev) => ({ ...prev, [currentId]: value }));
  };

  // 개인정보 필드 업데이트 함수
  const handlePersonalInfoChange = (
    field: keyof PersonalInfo,
    value: string
  ) => {
    setPersonalInfo((prev) => {
      const updated = { ...prev, [field]: value };

      // 생년월일이 변경되면 나이 자동 계산
      if (field === "birthDate") {
        updated.age = calculateAge(value);
      }

      return updated;
    });
  };

  // 개인정보 필드 유효성 검사
  const validatePersonalInfo = () => {
    return (
      personalInfo.name.trim() !== "" &&
      personalInfo.gender !== "" &&
      personalInfo.birthDate !== "" &&
      personalInfo.phoneNumber.trim() !== "" &&
      personalInfo.emergencyContact.trim() !== ""
    );
  };

  // 설문 응답 데이터 포매팅
  const formattedAnswers = (
    answers: Record<number, string>
  ): PostSurveyWithOutSignUp => {
    return {
      personalInfo: {
        name: personalInfo.name,
        gender: personalInfo.gender,
        birthDate: personalInfo.birthDate,
        age: parseInt(personalInfo.age) || 0,
        phoneNumber: personalInfo.phoneNumber,
        emergencyContact: personalInfo.emergencyContact,
      },
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

  // 다음 버튼 핸들러
  const handleNext = () => {
    if (currentQuestionIndex === -1) {
      // 개인정보 페이지에서 다음으로
      if (validatePersonalInfo()) {
        setCurrentQuestionIndex(0);
      } else {
        // 유효성 검사 실패 시 처리 (예: 알림 표시)
        alert("모든 필수 정보를 입력해주세요.");
      }
    } else if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 마지막 질문 이후 동의 화면으로 이동
      setPageState("results");
    }
  };

  // 뒤로 가기 버튼 핸들러
  const handleBack = () => {
    if (pageState === "survey") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else if (currentQuestionIndex === 0) {
        // 첫 번째 설문 질문에서 개인정보 페이지로 돌아가기
        setCurrentQuestionIndex(-1);
      } else {
        setPageState("intro");
      }
    } else if (pageState === "results") {
      setPageState("survey");
      setCurrentQuestionIndex(surveyQuestions.length - 1);
    } else {
      router.push("/mypage");
    }
  };

  // 설문 제출 핸들러 - 이제 사용되지 않음
  const handleSubmit = async () => {
    // 이 함수는 더 이상 사용되지 않음 - 동의 후 제출 방식으로 변경됨
    // 모든 제출 로직은 handleConsentSubmit으로 이동됨
  };

  // 동의 모달 열기
  const handleOpenConsentModal = () => {
    setShowConsentModal(true);
  };

  // 동의 모달 닫기
  const handleCloseConsentModal = () => {
    setShowConsentModal(false);
  };

  // 동의 제출 핸들러
  const handleConsentSubmit = async (consents: Record<string, boolean>) => {
    try {
      // 모든 동의 항목이 true인지 확인
      const allAgreed = agreements.every(
        (agreement) => consents[`agreement-${agreement.agreementId}`] === true
      );

      if (!allAgreed) {
        alert("모든 항목에 동의해야 제출이 가능합니다.");
        return;
      }

      setIsSubmitting(true);

      // 설문 제출
      const requestDto: PostSurveyWithOutSignUp = formattedAnswers(answers);
      const responseDTO: boolean = await postSurveyAnswerByGuest(requestDto);

      if (!responseDTO) {
        alert("설문 제출에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      router.push("/survey-no-auth/consultation-complete");
    } catch (error) {
      console.error("동의 또는 결과 제출 중 오류 발생:", error);
      alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
      setShowConsentModal(false);
    }
  };

  if (isLoading) {
    return <p className="text-center py-10">설문을 불러오는 중입니다...</p>;
  }

  if (surveyQuestions.length === 0) {
    return <p className="text-center py-10">설문 데이터가 없습니다.</p>;
  }

  // 콘센트 아이템 생성
  const consentItems: ConsentItem[] = agreements.map(
    (agreement: AgreementDTO) => ({
      id: `agreement-${agreement.agreementId}`,
      label: agreement.title,
      required: true, // 모든 항목을 필수로 설정
    })
  );

  // 인트로 화면 렌더링
  if (pageState === "intro") {
    return (
      <IntroductionScreen
        title="청년 온라인 자가점검 설문"
        subtitle="웅상 사회 복지관"
        description={
          <>
            자신의 상태를 점검하고 <br />
            맞춤형 도움을 받아보세요
          </>
        }
        imageSrc="/dearie/images/survey.png"
        imageAlt="설문 이미지"
        buttonText="시작하기"
        showBackButton={true}
        showShareButton={false}
        onButtonClick={handleStartSurvey}
      />
    );
  }

  // 결과 화면 렌더링
  if (pageState === "results") {
    return (
      <>
        <IntroductionScreen
          title="설문이 완료되었습니다"
          subtitle="웅상 사회 복지관"
          description={
            <>
              전문 상담사에게 전달하기 위해 <br />
              개인정보 동의가 필요합니다.
            </>
          }
          imageSrc="/dearie/images/message.png"
          imageAlt="설문 완료"
          buttonText="동의하고 제출하기"
          showBackButton={true}
          showShareButton={false}
          onButtonClick={handleOpenConsentModal}
        />

        <ConsentModal
          isOpen={showConsentModal}
          onClose={handleCloseConsentModal}
          onSubmit={handleConsentSubmit}
          title="설문 제출을 위해 동의가 필요해요"
          submitButtonText="모두 동의하고 제출하기"
          consentItems={consentItems}
          agreements={agreements}
          isSubmitting={isSubmitting}
        />
      </>
    );
  }

  // 설문 진행 화면 렌더링
  const currentQuestion = surveyQuestions[currentQuestionIndex];
  // 프로그레스 계산 (개인정보 페이지 포함)
  const totalSteps = surveyQuestions.length + 1;
  const currentStep =
    currentQuestionIndex === -1 ? 1 : currentQuestionIndex + 2;
  const progress = (currentStep / totalSteps) * 100;

  // 개인정보 입력 페이지 렌더링
  const renderPersonalInfoPage = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">개인정보 입력</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
            placeholder="이름을 입력하세요"
            className="border-primary/30 focus:border-primary focus:ring-primary/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">성별</Label>
          <Select
            value={personalInfo.gender}
            onValueChange={(value) => handlePersonalInfoChange("gender", value)}
          >
            <SelectTrigger
              id="gender"
              className="border-primary/30 focus:border-primary focus:ring-primary/30"
            >
              <SelectValue placeholder="성별을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">남성</SelectItem>
              <SelectItem value="FEMALE">여성</SelectItem>
              <SelectItem value="OTHER">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">생년월일</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="birthDate"
                variant="outline"
                className="w-full justify-start text-left font-normal border-primary/30 hover:border-primary/70 hover:bg-primary/10"
              >
                {personalInfo.birthDate ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-primary mr-2" />
                    <span>
                      {new Date(personalInfo.birthDate).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border border-primary/40 mr-2" />
                    <span>생년월일을 선택하세요</span>
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-primary/30">
              <Calendar
                mode="single"
                selected={
                  personalInfo.birthDate
                    ? adjustDateForTimezone(personalInfo.birthDate)
                    : undefined
                }
                onSelect={(date: Date | undefined) => {
                  if (date) {
                    const formattedDate = formatDateToISO(date);
                    handlePersonalInfoChange("birthDate", formattedDate);
                  }
                }}
                initialFocus
                defaultMonth={new Date(2000, 0)}
                captionLayout="dropdown"
                fromYear={1950}
                toYear={2020}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">나이</Label>
          <Input
            id="age"
            value={personalInfo.age}
            readOnly
            placeholder="생년월일 선택 시 자동으로 계산됩니다"
            className="bg-slate-50 border-primary/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">연락처</Label>
          <Input
            id="phoneNumber"
            value={personalInfo.phoneNumber}
            onChange={(e) =>
              handlePersonalInfoChange("phoneNumber", e.target.value)
            }
            placeholder="연락처를 입력하세요 (예: 010-1234-5678)"
            className="border-primary/30 focus:border-primary focus:ring-primary/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContact">비상연락처</Label>
          <Input
            id="emergencyContact"
            value={personalInfo.emergencyContact}
            onChange={(e) =>
              handlePersonalInfoChange("emergencyContact", e.target.value)
            }
            placeholder="비상연락처를 입력하세요"
            className="border-primary/30 focus:border-primary focus:ring-primary/30"
          />
        </div>
      </CardContent>
    </Card>
  );

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
          {currentStep} / {totalSteps}
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
          {currentQuestionIndex === -1 ? (
            renderPersonalInfoPage()
          ) : (
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
          )}

          <Button
            onClick={handleNext}
            disabled={
              (currentQuestionIndex !== -1 &&
                currentQuestion.type !== "text" &&
                !answers[currentQuestion.id]) ||
              (currentQuestionIndex === -1 && !validatePersonalInfo()) ||
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
