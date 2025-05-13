"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, HelpCircle, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/common/loading-screen";

export default function SurveyResultsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen
        title="고립/은둔 척도를"
        subtitle="분석하고 있어요"
        loadingMessage="잠시만 기다려주세요."
        showBackButton={true}
        onBackClick={() => router.back()}
      />
    );
  }

  return <ResultsView />;
}

function ResultsView() {
  const router = useRouter();

  // 고립 및 은둔 점수 (예시 데이터)
  const isolationScore = 78;
  const seclusionScore = 42;

  // 위험군 카테고리 결정 (예시 로직)
  const getRiskCategory = (isolation: number, seclusion: number) => {
    const totalScore = isolation + seclusion;

    if (totalScore < 50) return "비위험군";
    if (totalScore < 100) return "고립 위험군";
    if (totalScore < 150) return "고립";
    return "은둔";
  };

  const riskCategory = getRiskCategory(isolationScore, seclusionScore);

  // 게이지 각도 계산 (0-180도)
  const calculateGaugeAngle = (isolation: number, seclusion: number) => {
    const totalScore = isolation + seclusion;
    // 최대 점수를 200으로 가정
    return Math.min(180, (totalScore / 200) * 180);
  };

  const gaugeAngle = calculateGaugeAngle(isolationScore, seclusionScore);

  // 백분위 계산 (예시)
  const percentile = 85;

  const handleConsultationRequest = () => {
    router.push("/survey/consultation-intro");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md min-h-screen flex flex-col">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">고립/은둔 척도</h1>
            <HelpCircle className="h-5 w-5 text-gray-400 cursor-pointer" />
          </div>
          <p className="text-gray-600 text-sm mb-6">
            설문 응답을 바탕으로 고립 및 은둔 정도를 분석한 결과입니다.
          </p>

          {/* 게이지 시각화 */}
          <div className="relative w-full h-48 flex items-center justify-center mb-8">
            {/* 게이지 배경 */}
            <div className="absolute w-40 h-40">
              <svg viewBox="0 0 100 50" className="w-full">
                <defs>
                  <linearGradient
                    id="gaugeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#FF0080" />
                    <stop offset="50%" stopColor="#7928CA" />
                    <stop offset="100%" stopColor="#0070F3" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10,50 A 40,40 0 1,1 90,50"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 게이지 포인터 */}
            <div
              className="absolute w-40 h-40 transition-transform duration-1000"
              style={{ transform: `rotate(${gaugeAngle - 90}deg)` }}
            >
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-1/2 w-1 h-20 bg-blue-500 rounded-full origin-bottom transform -translate-x-1/2"></div>
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* 중앙 텍스트 */}
            <div className="text-center mt-16">
              <h2 className="text-3xl font-bold">{riskCategory}</h2>
            </div>
          </div>

          {/* 점수 정보 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-1">백분위</p>
              <p className="font-bold">상위 {100 - percentile}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-1">총점</p>
              <p className="font-bold">{isolationScore + seclusionScore}점</p>
            </div>
          </div>

          {/* 세부 점수 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-medium mb-4">세부 점수</h3>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">고립 점수</span>
                <span className="text-sm font-medium">{isolationScore}점</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(isolationScore / 100) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">은둔 점수</span>
                <span className="text-sm font-medium">{seclusionScore}점</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(seclusionScore / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 결과 설명 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-medium mb-2">결과 해석</h3>
            <p className="text-sm text-gray-600 mb-4">
              고립/은둔 척도는 사회적 관계와 활동 참여 정도를 측정합니다. 귀하의
              결과는 '{riskCategory}' 단계로 분류됩니다.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
              <p className="text-sm">
                {riskCategory === "비위험군" &&
                  "현재 사회적 관계와 활동이 건강하게 유지되고 있습니다. 지속적인 관계 형성과 활동 참여를 권장합니다."}
                {riskCategory === "고립 위험군" &&
                  "사회적 관계가 다소 제한적일 수 있습니다. 주변 사람들과의 소통을 늘리고 취미 활동에 참여해보세요."}
                {riskCategory === "고립" &&
                  "사회적 관계가 상당히 제한되어 있습니다. 전문가의 상담을 받아보시고, 점진적으로 사회 활동을 늘려보세요."}
                {riskCategory === "은둔" &&
                  "심각한 사회적 고립 상태입니다. 전문적인 도움을 받아 단계적으로 사회 복귀를 준비하는 것이 필요합니다."}
              </p>
            </div>

            {/* 상담 유도 섹션 */}
            {riskCategory !== "비위험군" && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-800 mb-3">
                  정상 범위에서 벗어났습니다. 전문가의 도움이 필요할 수
                  있습니다.
                </p>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleConsultationRequest}
                >
                  상담 신청하기
                </Button>
              </div>
            )}
          </div>

          {/* 추천 활동 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-medium mb-2">추천 활동</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>하루 10분 이상 가벼운 산책하기</li>
              <li>주 1회 이상 친구나 가족과 연락하기</li>
              <li>관심 있는 취미 활동 찾아보기</li>
              <li>소규모 모임이나 커뮤니티 참여해보기</li>
            </ul>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              결과 저장
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Share2 className="h-4 w-4" />
              공유하기
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
