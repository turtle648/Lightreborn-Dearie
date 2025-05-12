'use client'

import { Card } from "@/components/common/Card";
import { ColorBox } from "@/components/common/ColorBox";
import Sheet from "@/components/common/Sheet";
import { colors } from "@/constants/colors";
import { UserInfo } from "@/components/common/UserInfo";

export default function YouthManagementPage() {
  // 대상자 정보 데이터
  const userInfo = {
    id: "#0137",
    name: "이OO",
    gender: "남",
    age: 27,
    scoreTotal: 58,
    riskLevel: "고립 위험군"
  };

  // 상담 이력 데이터
  const consultationHistoryData = [
    {type: "정기상담", counselor: "김OO", target: "이OO", date: "2025.06.17", result: "고립위험군 변경"},
    {type: "정기상담", counselor: "김OO", target: "이OO", date: "2025.03.22", result: "은둔/고립지표 개선"},
    {type: "정기상담", counselor: "김OO", target: "이OO", date: "2024.11.21", result: "-"},
    {type: "초기상담", counselor: "김OO", target: "이OO", date: "2024.06.11", result: "은둔청년 지정"}
  ];
  
  // 척도설문 시행 이력 데이터
  const surveyHistoryData = [
    {versionId: 2, surveyDate: "2025.06.17", socialEconomicScore: 65, socialInteractionScore: 43, lifestyleScore: 57},
    {versionId: 1, surveyDate: "2024.12.15", socialEconomicScore: 65, socialInteractionScore: 23, lifestyleScore: 42}
  ].sort((a, b) => new Date(b.surveyDate).getTime() - new Date(a.surveyDate).getTime());
  
  // 최근 척도설문 응답 데이터
  const latestSurveyData = surveyHistoryData[0];

  const getScoreColor = (score: number) => {
    if (score < 50) return colors.chart.orange;
    if (score < 60) return colors.chart.yellow;
    return colors.chart.blue;
  };

  const getScoreBgColor = (score: number) => {
    if (score < 50) return "orange";
    if (score < 60) return "yellow";
    return "blue";
  };

  const onclickDownloadSurveyHistory = () => {
    console.log("다운로드: 상담 진행 내역");
  };

  const onclickDownloadSurveySummary = () => {
    console.log("다운로드: 척도설문 시행 내역");
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        용상종합사회복지관
      </h1>
      
      {/* 대상자별 상세 정보 */}
      <div className="grid grid-cols-1">  
        <Card title="대상자별 상세 정보">
          <div className="grid grid-cols-2 gap-4 p-4">
            <UserInfo 
              id={userInfo.id}
              name={userInfo.name}
              gender={userInfo.gender}
              age={userInfo.age}
              // profileImage={userInfo.profileImage}
            /> 

            
            
            <div className="flex items-center justify-end">
              <ColorBox 
                color={getScoreColor(userInfo.scoreTotal)}
                bgColor={getScoreBgColor(userInfo.scoreTotal)}
                scoreText={`${userInfo.scoreTotal}점`}
                title={userInfo.riskLevel}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 상담 진행 내역 */}
      <div className="grid grid-cols-1">  
        <Sheet 
          title="상담리스트" 
          columns={[
            {key: "type", title: "상담유형"},
            {key: "counselor", title: "담당자"},
            {key: "target", title: "상담대상자"},
            {key: "date", title: "상담일시"},
            {key: "result", title: "특이사항"},
          ]}
          data={consultationHistoryData}
          onDownload={onclickDownloadSurveyHistory}
        />
      </div>

      {/* 최근 척도설문 응답 요약 */}
      <div className="grid grid-cols-1">
        <Card title="최근 척도설문 응답 요약" subTitle={`${latestSurveyData.surveyDate} 시행`}>
          <div className="grid grid-cols-3 gap-4 p-4">
                        
            <ColorBox 
              color={getScoreColor(latestSurveyData.socialEconomicScore)} 
              bgColor={getScoreBgColor(latestSurveyData.socialEconomicScore)}
              scoreText={`${latestSurveyData.socialEconomicScore}점`}
              title="사회경제활동"
            />
            <ColorBox 
              color={getScoreColor(latestSurveyData.socialInteractionScore)} 
              bgColor={getScoreBgColor(latestSurveyData.socialInteractionScore)}
              scoreText={`${latestSurveyData.socialInteractionScore}점`}
              title="대인관계 및 사회적 상호작용"
            />
            <ColorBox 
              color={getScoreColor(latestSurveyData.lifestyleScore)} 
              bgColor={getScoreBgColor(latestSurveyData.lifestyleScore)}
              scoreText={`${latestSurveyData.lifestyleScore}점`}
              title="생활패턴 및 고립행동"
            />
            
          </div>
        </Card>
      </div>

      {/* 척도설문 시행 내역 */}
      <div className="grid grid-cols-1">
        <Sheet 
          title="척도설문 시행 내역"
          columns={[
            {key: "versionId", title: "일련번호"},
            {key: "surveyDate", title: "설문일자"},
            {key: "socialEconomicScore", title: "사회경제활동"},
            {key: "socialInteractionScore", title: "대인관계 및\n사회적 상호작용"},
            {key: "lifestyleScore", title: "생활패턴 및\n고립행동"},
          ]}
          data={surveyHistoryData}
          onDownload={onclickDownloadSurveySummary}
        /> 
      </div>
    </div>
  );
}