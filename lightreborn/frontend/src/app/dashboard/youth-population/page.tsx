"use client"

import { Card } from "@/components/common/Card"
import YangsanMap from "@/components/map/YangsanMap"
import { colors } from "@/constants/colors"
import { useDongInfo } from "@/hooks/useDongInfo"
import BarChart from "@/components/common/rechart/BarChart"
import { useState, useEffect } from 'react'
import DoughnutChart, { DoughnutChartItem } from "@/components/common/rechart/DoughnutChart"
import { useYouthPopulationStore } from "@/stores/useYouthPopulationStore"

export default function YouthPopulationPage() {
  const { selectedDongName, isSelected, selectedDongCode } = useDongInfo()
  const [youthData, setYouthData] = useState<DoughnutChartItem[] | null>(null)
  const [singleHouseholdData, setSingleHouseholdData] = useState<DoughnutChartItem[] | null>(null)
  const [genderRatioData, setGenderRatioData] = useState<DoughnutChartItem[] | null>(null)

  const { 
    youthPopulation, 
    getYouthPopulation, 
    youthRatio, 
    getYouthRatio,
    youthGenderRatio,
    getYouthGenderRatio,
    youthAloneHouseholdRatio,
    getYouthAloneHouseholdRatio,
    isLoading,
    error
  } = useYouthPopulationStore();

  // 초기 데이터 로드
  useEffect(() => {
    getYouthPopulation();
  }, [getYouthPopulation]);

  // selectedDongCode가 변경될 때마다 해당 지역의 데이터 로드
  useEffect(() => {
    // 행정동이 선택된 경우에만 데이터 요청
    if (isSelected && selectedDongCode) {
      getYouthRatio(selectedDongCode);
      getYouthGenderRatio(selectedDongCode);
      getYouthAloneHouseholdRatio(selectedDongCode);
    }
  }, [isSelected, selectedDongCode, getYouthRatio, getYouthGenderRatio, getYouthAloneHouseholdRatio]);

  // youthRatio가 업데이트될 때마다 차트 데이터도 업데이트
  useEffect(() => {
    if (isSelected) {
      // 청년 인구 비율 데이터
      setYouthData([
        { name: '청년 인구', value: youthRatio, color: colors.chart.blue },
        { name: '청년 외 인구', value: 100.0 - youthRatio, color: colors.chart.lightGray }
      ])
      
      // 1인 가구 비율 데이터
      setSingleHouseholdData([
        { name: '1인 가구', value: youthAloneHouseholdRatio, color: colors.secondary.main },
        { name: '다인 가구', value: 100.0 - youthAloneHouseholdRatio, color: colors.chart.lightGray }
      ])
      
      // 성비 데이터
      setGenderRatioData([
        { name: '남성', value: youthGenderRatio.male, color: colors.chart.blue },
        { name: '여성', value: youthGenderRatio.female, color: colors.status.error }
      ])
    } else {
      setYouthData(null)
      setSingleHouseholdData(null)
      setGenderRatioData(null)
    }
  }, [isSelected, youthRatio, youthGenderRatio, youthAloneHouseholdRatio]);
  
  // 배열 변경 시 불변성 유지
  const sortedBarChartData = [...youthPopulation].sort((a, b) => b.perPopulation - a.perPopulation);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        청년 인구 분포 비율
      </h1>

      {/* 에러 메시지가 있을 경우 표시 */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          오류: {error}
        </div>
      )}

      {/* 첫 번째 행: 지도와 3개의 도넛 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽 열: 지도 */}
        <Card title="행정동 선택">
          <div className="h-125 w-full">
            <YangsanMap />
          </div>
        </Card>

        {/* 오른쪽 열: 3개의 도넛 차트 (세로로 배치) */}
        <div className="grid grid-cols-1 gap-4">
          {/* 첫 번째 도넛 차트 */}
          <Card title="행정동 내 청년 인구 분포 비율" 
                subTitle="행정동 내 전체 인구 중 행정동별 청년의 인구 분포 비율을 나타낸 그래프입니다.">
            {isLoading ? (
              <DoughnutChart 
                data={[]}
                titleText=""
                valueText=""
                size={150}
              />
              // <div className="flex justify-center items-center h-36">데이터를 불러오는 중...</div>
            ) : (
              <DoughnutChart 
                data={youthData} 
                titleText={selectedDongName || '지역 선택'} 
                valueText={isSelected ? `${youthRatio.toFixed(1)}%` : '-'}
                size={150}
              />
            )}
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 두 번째 도넛 차트 */}
            <Card title={`${selectedDongName || '행정동'} 청년 중 1인가구 비율`} 
                  subTitle="행정동 내 전체 청년인구 중 1인가구 비율을 나타낸 그래프입니다.">
              {isLoading ? (
                <DoughnutChart 
                  data={[]}
                  titleText=""
                  valueText=""
                  size={150}
                />
              ) : (
                <DoughnutChart 
                  data={singleHouseholdData} 
                  titleText={selectedDongName || '지역 선택'} 
                  valueText={isSelected ? `${youthAloneHouseholdRatio.toFixed(1)}%` : '-'}
                  size={150}
                />
              )}
            </Card>
            
            {/* 세 번째 도넛 차트 */}
            <Card title={`${selectedDongName || '행정동'} 내 청년 1인가구 성비`} 
                  subTitle="행정동 내 전체 청년 1인가구의 성비를 나타낸 그래프입니다.">
              {isLoading ? (
                <DoughnutChart 
                  data={[]}
                  titleText=""
                  valueText=""
                  size={150}
                />
              ) : (
                <DoughnutChart 
                  data={genderRatioData} 
                  titleText="남성 : 여성" 
                  valueText={isSelected ? `${youthGenderRatio.male} : ${youthGenderRatio.female}` : '-'}
                  size={150}
                />
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* 두 번째 행: 바 차트 */}
      <Card title="양산시 전체 청년 중 행정동별 비율" 
            subTitle="양산시 전체 청년 중 행정동별 비율을 나타낸 그래프입니다.">
        {isLoading && !youthPopulation.length ? (
          <div className="flex justify-center items-center h-48">데이터를 불러오는 중...</div>
        ) : (
          <BarChart
            data={sortedBarChartData.map(entry => ({
              name: entry.region,
              value: entry.perPopulation,
              color: entry.region === selectedDongName ? colors.chart.blue : colors.chart.lightGray
            }))}
            height={250}
            valueUnit="%"
            valueName="비율"
            tooltipFormatter={(value) => [`${value}%`, '비율']}
            marginBottom={40}
          />
        )}
      </Card>
    </div>
  );
}