"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSurveyAnswerDetailInfo } from "@/apis/survey-api";
import { SurveyAnswerDetailInfo } from "@/types/response.survey";
import { LoadingScreen } from "@/components/common/loading-screen";
import ResultsView from "./ResultsView";

export default function SurveyResultsPage({ resultId }: { resultId?: string }) {
  const router = useRouter();
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
