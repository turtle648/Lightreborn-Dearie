"use client"

import DoughnutChart from "@/components/common/rechart/DoughnutChart"
import ComboChart, { ComboChartItem } from "@/components/common/rechart/ComboChart"
import BarChart from "@/components/common/rechart/BarChart"
import { Card } from "@/components/common/Card"
import { colors } from "@/constants/colors"
import { useEffect, useState } from "react"
import { useYouthConsultationStore } from "@/stores/useYouthConsultaionStore"

export default function Dashboard() {

  const { monthlyConsultationStatusFor2Years, getMonthlyConsultationStatusFor2Years, recentConsultationData, getRecentConsultationData, cumulativeConsultationStatus, getCumulativeConsultationStatus } = useYouthConsultationStore();

  const [monthlyData, setMonthlyData] = useState<ComboChartItem[]>([]);
  const [recentData, setRecentData] = useState([
    {name: "2월", value: 7, color: colors.chart.gray}, 
    {name: "3월", value: 10, color: colors.chart.gray}, 
    {name: "4월", value: 12, color: colors.chart.blue}
  ]);

  useEffect(() => {
    getMonthlyConsultationStatusFor2Years();
    getRecentConsultationData();
    getCumulativeConsultationStatus();
  }, []);

  useEffect(() => {
    console.log("monthlyConsultationStatusFor2Years 의존성배열 실행");
    // 월별 상담 데이터
    console.log("유즈이펙트 안 monthlyConsultationStatusFor2Years : ", monthlyConsultationStatusFor2Years);
    if (monthlyConsultationStatusFor2Years && monthlyConsultationStatusFor2Years.currentMonthlyCount) {
      const newMonthlyData = Array.from({ length: 12 }, (_, index) => {
      // 월 이름 (1월부터 12월까지)
      const monthName = `${index + 1}월`;
      
      // 현재 연도와 이전 연도의 해당 월 데이터
      const barValue = monthlyConsultationStatusFor2Years.currentMonthlyCount[index];
      const lineValue = monthlyConsultationStatusFor2Years.previousMonthlyCount[index];
      
      return {
        name: monthName,
        barValue: barValue,
        lineValue: lineValue
        };
      });
      setMonthlyData(newMonthlyData);
    }
  }, [monthlyConsultationStatusFor2Years]);

  useEffect(() => {
    console.log("recentConsultationData 의존성배열 실행");
    // 최근 3개월 등록 상담자 데이터
    if (recentConsultationData && Array.isArray(recentConsultationData) && recentConsultationData.length > 0) {
      console.log("recentConsultationData : ", recentConsultationData);
      const newRecentData = recentConsultationData.map((item, index) => {
        const color = index === recentConsultationData.length - 1 ? colors.chart.blue : colors.chart.gray;
        return {
          name: `${item.month}월`,
          value: item.count || 0,
          color: color
        }
      });
      setRecentData(newRecentData);
    }
  }, [recentConsultationData]);

  

  useEffect(() => {
    console.log("cumulativeConsultationStatus 의존성배열 실행");
    console.log("cumulativeConsultationStatus : ", cumulativeConsultationStatus);
    if (cumulativeConsultationStatus && Array.isArray(cumulativeConsultationStatus) && cumulativeConsultationStatus.length > 0) {
      // setCumulativeData(cumulativeConsultationStatus);
    }
  }, [cumulativeConsultationStatus]);

  // 누적 상담 현황 데이터
  const consultationTypeData = [
    { name: "비위험군", value: 79, color: colors.chart.gray },
    { name: "고립 위험군", value: 21, color: colors.chart.yellow },
    { name: "고립 청년", value: 12, color: colors.chart.orange },
    { name: "은둔 청년", value: 8, color: colors.chart.purple }
  ]

  // 최근 3개월 등록 상담자 데이터 - 현재 API 에 없음 
  const recentRiskGroupData = [
    { name: "고립 위험군", value: 5, color: colors.chart.yellow },
    { name: "비위험군", value: 7, color: colors.chart.gray }, 
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">웅상종합사회복지관</h1>
        
        {/* 첫 번째 줄 */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Card title="누적 상담 현황">
            <div className="flex flex-row">
              {/* 왼쪽: 상담 유형별 BarChart */}
              <div className="flex-1 p-4">
                <BarChart 
                  data={consultationTypeData}
                  yAxisLabel="명"
                  showLegend={false}
                />
              </div>
              
              {/* 오른쪽: 상담인원 DoughnutChart */}
              <div className="flex-1 p-4 flex justify-center items-center">
                <DoughnutChart
                  data={consultationTypeData}
                  titleText="상담인원"
                  valueText="120명"
                  size={160}
                  borderWidth={16}
                  centerText={true}
                />
              </div>
            </div>
          </Card>
        </div>
        
        {/* 두 번째 줄 */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* 월별 상담 건수 - ComboChart 컴포넌트 사용 */}
          <Card title="월별 상담 건수">
            <div className="h-64 w-full">
            {monthlyData.length > 0 ? (
              <ComboChart
                data={monthlyData as ComboChartItem[]}
                barName="월별 건수"
                lineName="전년 동월 건수"
                barColor={colors.chart.blue}
                lineColor={colors.chart.orange}
                showTooltip={true}
                showLegend={true}
                height={250} // 고정 높이 지정
                width="100%"
              />
            ) : (
              <ComboChart 
                data={[]}
              /> 
            )}
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* 최근 3개월 신규 등록 상담자 수 */}
          <Card title="최근 3개월 신규 등록 상담자 현황">
            <div className="bg-white p-4 grid grid-cols-3 gap-4 rounded-md shadow-sm">
            {/* <h3 className="text-lg font-medium mb-4">최근 3개월 신규 등록 상담자 수</h3> */}
            
            {/* <div className="flex flex-col h-64"> */}
              <div className="flex-1 flex items-center justify-center h-64">
                <div className="h-full text-center">
                  <Card title={`${recentData[recentData.length - 1].name} 신규 등록 상담자 수`}>
                    <p className="text-6xl font-bold mb-2">{recentData[recentData.length - 1].value}명</p>
                    <p className="text-sm text-gray-500">{recentData[recentData.length - 1].name} 기준</p>
                    {/* 동적 색상이 적용된 상승/하락 표시 */}
                    {recentData.length >= 2 && (
                      <p className={`text-sm mt-2 ${
                        recentData[recentData.length - 1].value - recentData[recentData.length - 2].value < 0 
                          ? "text-red-500" 
                          : "text-blue-500"
                      }`}>
                        {recentData[recentData.length - 1].value - recentData[recentData.length - 2].value < 0 
                          ? "▼" 
                          : "▲"} 
                        {Math.abs(recentData[recentData.length - 1].value - recentData[recentData.length - 2].value)}%
                      </p>
                    )}
                  </Card>
                </div>
              </div>
              
              <div className="flex h-64 w-full">
                <BarChart
                  data={recentData}
                  height={250}
                  width={300}
                  valueName="명"
                  tooltipFormatter={(value, name) => [`${value}명`, name]}
                  marginBottom={40}
                  hideAxis={false}
                  defaultColor={colors.chart.blue}
                />
              </div> 

              {/* 최근 사람 데이터로 고립 위험군을 뽑을 수 없어서 일단 삭제 */}
              <div className="ml-8 flex items-center justify-center h-64">
                <DoughnutChart
                  data={recentRiskGroupData}
                  titleText="고립 위험군"
                  valueText="5명"
                  size={150}
                  borderWidth={20}
                  centerText={true}
                  showTooltip={false}
                />
              </div>
              </div>
            {/* </div> */}
          </Card>
        </div>
      </div>
    </div>
  )
}