"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Share2, Smartphone } from "lucide-react";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/common/loading-screen";
import { SurveyAnswerDetailInfo } from "@/types/response.survey";
import { getSurveyAnswerDetailInfo } from "@/apis/survey-api";

export default function SurveyResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("resultId");
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<SurveyAnswerDetailInfo | null>(null);

  useEffect(() => {
    if (!resultId) return;
    getSurveyAnswerDetailInfo(Number(resultId))
      .then((res) => setResult(res))
      .finally(() => setIsLoading(false));
  }, [resultId]);

  if (isLoading || !result) {
    return (
      <LoadingScreen
        title="고립/은둔 척도를"
        subtitle="분석하고 있어요"
        loadingMessage="잠시만 기다려주세요."
        showBackButton
        onBackClick={() => router.back()}
      />
    );
  }

  return <ResultsView result={result} />;
}

function ResultsView({ result }: { result: SurveyAnswerDetailInfo }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("resultId");
  const resultRef = useRef<HTMLDivElement>(null);
  const { totalScore, resultScore, label, analysis, recommend, missions } =
    result;
  const gaugeAngle = (resultScore / totalScore) * 180;

  const baseUrl = "https://k12s309.p.ssafy.io";
  const resultUrl = `${baseUrl}/dearie/survey/results?resultId=${resultId}`;

  const handleDownloadClick = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, { useCORS: true });
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "survey_result.png";
    link.click();
  };

  const handleDiscordShare = async () => {
    const summary = `
[Dearie 고립/은둔 척도 결과]
상태: ${label === "정상" ? "✔️ 위험 없음" : "⚠️ 주의 필요"}
점수: ${resultScore} / ${totalScore}점 (${Math.round(
      (resultScore / totalScore) * 100
    )}%)
해석: ${analysis}
추천: ${recommend}

👉 결과 보기:
${resultUrl}
`.trim();

    try {
      await navigator.clipboard.writeText(summary);
      alert("결과 요약이 복사되었습니다. 디스코드에 붙여넣어 공유하세요!");
    } catch {
      alert("복사 실패! 아래 내용을 수동으로 복사하세요:\n\n" + summary);
    }
  };

  const handleMobileShare = () => {
    if (!result) return;

    const resultId = new URLSearchParams(window.location.search).get(
      "resultId"
    );
    const baseUrl = "https://k12s309.p.ssafy.io";
    const resultUrl = `${baseUrl}/dearie/survey/results?resultId=${resultId}`;

    const summary = `
  [Dearie 고립/은둔 척도 결과]
  상태: ${label === "정상" ? "✔️ 위험 없음" : "⚠️ 주의 필요"}
  점수: ${result.resultScore} / ${result.totalScore}점 (${Math.round(
      (result.resultScore / result.totalScore) * 100
    )}%)
  해석: ${result.analysis}
  추천: ${result.recommend}
  
  👉 결과 자세히 보기:
  ${resultUrl}
  `.trim();

    if (typeof navigator !== "undefined" && "share" in navigator) {
      navigator
        .share({
          title: "Dearie 고립/은둔 척도 결과",
          text: summary, // 전체 텍스트를 하나의 text로만 넣음
          // url: resultUrl ❌ 빼야 카카오톡/디스코드가 덮어쓰지 않음
        })
        .catch((err) => console.warn("공유 실패:", err));
    } else {
      alert("이 브라우저는 공유 기능을 지원하지 않아요.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md min-h-screen flex flex-col">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1"
      >
        <div ref={resultRef}>
          <h1 className="text-2xl font-bold mb-2">고립/은둔 척도</h1>
          <p className="text-sm text-gray-600 mb-4">
            설문 응답을 바탕으로 고립 및 은둔 정도를 분석한 결과입니다.
          </p>

          <div className="relative w-full h-48 flex items-center justify-center mb-2">
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
            <div
              className="absolute w-40 h-40 transition-transform"
              style={{ transform: `rotate(${gaugeAngle - 90}deg)` }}
            >
              <div className="absolute top-0 left-1/2 w-1 h-20 bg-blue-500 rounded-full origin-bottom transform -translate-x-1/2"></div>
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div className="text-center mt-16">
              <h2 className="text-3xl font-bold">{label}</h2>
              <p className="mt-2">
                {label === "정상" ? (
                  <span className="text-green-500">✔️ 위험 없음</span>
                ) : (
                  <span className="text-red-500">⚠️ 주의 필요</span>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-1">점수 비율</p>
              <p className="font-bold">
                {Math.round((resultScore / totalScore) * 100)}%
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-1">총점</p>
              <p className="font-bold">
                {resultScore} / {totalScore}점
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-medium mb-2">결과 해석</h3>
            <p className="text-sm text-gray-600 mb-4">{analysis}</p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
              <p className="text-sm">{recommend}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-medium mb-2">추천 활동</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
              {missions.map((m) => (
                <li key={m.missionId}>{m.content}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownloadClick}
            >
              <Download className="h-4 w-4 mr-2" />
              결과 저장
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDiscordShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              디스코드 공유
            </Button>
            {typeof window !== "undefined" && "share" in navigator && (
              <Button
                variant="default"
                className="flex-1"
                onClick={handleMobileShare}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                모바일 공유
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
