"use client"

import { Card } from "@/components/common/Card"
import YangsanMap from "@/components/map/YangsanMap"
import { colors } from "@/constants/colors"
import { useDongInfo } from "@/hooks/useDongInfo"
import BarChart from "@/components/common/rechart/BarChart"
import { useState, useEffect } from 'react'
import DoughnutChart, { DoughnutChartItem } from "@/components/common/rechart/DoughnutChart" // 외부 컴포넌트 import

export default function YouthPopulationPage() {
  const { selectedDongName, isSelected } = useDongInfo()
  const [youthData, setYouthData] = useState<DoughnutChartItem[] | null>(null)
  const [singleHouseholdData, setSingleHouseholdData] = useState<DoughnutChartItem[] | null>(null)
  const [genderRatioData, setGenderRatioData] = useState<DoughnutChartItem[] | null>(null)
  
  // 선택된 동이 변경될 때마다 데이터 업데이트
  useEffect(() => {
    if (isSelected) {
      // 청년 인구 비율 데이터
      setYouthData([
        { name: '청년 인구', value: 11.4, color: colors.chart.blue },
        { name: '기타 인구', value: 88.6, color: colors.chart.lightGray }
      ])
      
      // 1인 가구 비율 데이터
      setSingleHouseholdData([
        { name: '1인 가구', value: 48.6, color: colors.secondary.main },
        { name: '다인 가구', value: 51.4, color: colors.chart.lightGray }
      ])
      
      // 성비 데이터
      setGenderRatioData([
        { name: '남성', value: 40.3, color: colors.chart.blue },
        { name: '여성', value: 59.7, color: colors.status.error }
      ])
    } else {
      setYouthData(null)
      setSingleHouseholdData(null)
      setGenderRatioData(null)
    }
  }, [isSelected, selectedDongName])
  
  // 인라인 DonutChart 컴포넌트 제거 (외부 컴포넌트로 대체)
  
  // 막대 차트 데이터
  const barChartData = [
    { name: '물금읍', value: 12.3 },
    { name: '동면', value: 9.2 },
    { name: '원동면', value: 8.5 },
    { name: '상북면', value: 7.8 },
    { name: '하북면', value: 6.9 },
    { name: '양주동', value: 11.4 },
    { name: '삼성동', value: 10.2 },
    { name: '강서동', value: 8.7 },
    { name: '소주동', value: 7.5 },
    { name: '평산동', value: 3.2 },
    { name: '중앙동', value: 9.1 },
    { name: '덕계동', value: 8.9 },
    { name: '서창동', value: 8.3 },
  ].sort((a, b) => b.value - a.value); // 내림차순 정렬 (큰 값부터 작은 값 순)

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        청년 인구 분포 비율
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="행정동 선택">
          <div className="h-125 w-full">
            <YangsanMap />
          </div>
        </Card>

        <div>
          <Card title="행정동 내 청년 인구 분포 비율" subTitle="행정동 내 전체 인구 중 행정동별 청년의 인구 분포 비율을 나타낸 그래프입니다.">
            <DoughnutChart 
              data={youthData} 
              titleText={selectedDongName || '지역 선택'} 
              valueText={isSelected ? '11.4%' : '-'}
              size={192}
            />
          </Card>

          <div className="mt-6">
            <Card title="요약 정보">
              <div className="flex justify-between items-end h-32 mt-4">
                {/* 요약 정보 내용 */}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Card title="양산시 전체 청년 중 행정동별 비율" subTitle="양산시 전체 청년 중 행정동별 비율을 나타낸 그래프입니다.">
        <BarChart
          data={barChartData.map(entry => ({
            name: entry.name,
            value: entry.value,
            color: entry.name === selectedDongName ? colors.chart.blue : colors.chart.lightGray
          }))}
          height={250}
          valueUnit="%"
          valueName="비율"
          tooltipFormatter={(value) => [`${value}%`, '비율']}
          marginBottom={40}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={`${selectedDongName || '행정동'} 청년 중 1인가구 비율`} subTitle="행정동 내 전체 청년인구 중 1인가구 비율을 나타낸 그래프입니다.">
          <DoughnutChart 
            data={singleHouseholdData} 
            titleText={selectedDongName || '지역 선택'} 
            valueText={isSelected ? '48.6%' : '-'}
            size={192}
          />
        </Card>

        <Card title={`${selectedDongName || '행정동'} 내 청년 1인가구 성비`} subTitle="행정동 내 전체 청년 1인가구의 성비를 나타낸 그래프입니다.">
          <DoughnutChart 
            data={genderRatioData} 
            titleText="남 : 여" 
            valueText={isSelected ? '40.3 : 59.7' : '-'}
            size={192}
          />
        </Card>
      </div>
    </div>
  )
}