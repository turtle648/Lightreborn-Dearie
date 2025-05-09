"use client"

import DoughnutChart from "@/components/common/rechart/DoughnutChart"
import ComboChart from "@/components/common/rechart/ComboChart"
import BarChart from "@/components/common/rechart/BarChart"
import { Card } from "@/components/common/Card"
import { colors } from "@/constants/colors"

export default function Dashboard() {
  // 누적 상담 현황 데이터
  const consultationTypeData = [
    { name: "비위험군", value: 79, color: "#DDDDDD" },
    { name: "고민 위험군", value: 21, color: "#FFD465" },
    { name: "고립 청년", value: 12, color: "#FF7A5A" },
    { name: "은둔 청년", value: 8, color: "#B548C6" }
  ]

  // 월별 상담 데이터
  const monthlyData = [
    { name: "1월", barValue: 25, lineValue: 18 },
    { name: "2월", barValue: 35, lineValue: 22 },
    { name: "3월", barValue: 45, lineValue: 30 },
    { name: "4월", barValue: 40, lineValue: 35 },
    { name: "5월", barValue: 55, lineValue: 40 },
    { name: "6월", barValue: 30, lineValue: 32 },
    { name: "7월", barValue: 25, lineValue: 38 },
    { name: "8월", barValue: 20, lineValue: 30 },
    { name: "9월", barValue: 30, lineValue: 25 },
    { name: "10월", barValue: 35, lineValue: 20 },
    { name: "11월", barValue: 40, lineValue: 15 },
    { name: "12월", barValue: 45, lineValue: 22 }
  ]

  // 최근 3개월 등록 상담자 데이터
  const recentRiskGroupData = [
    { name: "고립 위험군", value: 5, color: "#B548C6" },
    { name: "비위험군", value: 7, color: "#DDDDDD" }
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
            <ComboChart
              data={monthlyData}
              barName="월별 건수"
              lineName="전년 동월 건수"
              barColor={colors.chart.blue}
              lineColor={colors.chart.orange}
              showTooltip={true}
              showLegend={true}
              height={250} // 고정 높이 지정
              width="100%"
            />
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* 최근 3개월 신규 등록 상담자 수 */}
          <Card title="최근 3개월 신규 등록 상담자 수">
            <div className="bg-white p-4 grid grid-cols-3 gap-4 rounded-md shadow-sm">
            {/* <h3 className="text-lg font-medium mb-4">최근 3개월 신규 등록 상담자 수</h3> */}
            
            {/* <div className="flex flex-col h-64"> */}
              <div className="flex-1 flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-6xl font-bold mb-2">12명</p>
                  <p className="text-sm text-gray-500">2025. 03월 기준</p>
                  <p className="text-sm text-red-500 mt-2">▲ 13.5%</p>
                </div>
              </div>
              
              <div className="flex h-64 w-full">
                <BarChart
                  data={[{name: "2월", value: 7}, {name: "3월", value: 10}, {name: "4월", value: 12}]}
                  height={250}
                  width={250}
                  valueName="명"
                  tooltipFormatter={(value, name) => [`${value}명`, name]}
                  marginBottom={40}
                  hideAxis={false}
                  defaultColor={colors.chart.blue}
                />
              </div> 

              <div className="ml-8 flex items-center justify-center h-64">
                <DoughnutChart
                  data={recentRiskGroupData}
                  titleText="고립 위험군"
                  valueText="5명"
                  size={120}
                  borderWidth={12}
                  centerText={true}
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