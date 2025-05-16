// 서버 컴포넌트
import SurveyResultsPage from "./SurveyResultsPage";

export default function Page({
  searchParams,
}: {
  searchParams: { resultId?: string };
}) {
  return <SurveyResultsPage resultId={searchParams.resultId} />;
}
