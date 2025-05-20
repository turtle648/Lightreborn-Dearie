"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/common/Card"
import { colors } from "@/constants/colors"
import YangsanMap from "@/components/map/YangsanMap"
import { useDongInfo } from "@/hooks/useDongInfo"
import BarChart from "@/components/common/rechart/BarChart"
import Sheet from "@/components/common/Sheet"
import { useWelfareCenterStore } from "@/stores/useWelfareCenterStore"

// interface WelfareCenter {
//   id: number
//   name: string
//   type: string
//   address: string
//   latitude: number
//   longitude: number
//   dongName: string
// }

// interface WelfareCenterRatio {
//   region: string
//   ratio: number
//   youthPopulation: number
//   centerCount: number
// }

export default function WelfareCenterPage() {
  const { selectedDongName, isSelected, selectedDongCode } = useDongInfo()
  const { 
    welfareCenterData, 
    welfareCenterLocationData, 
    welfareCenterExportDetailData, 
    isLoading, 
    // error, 
    getWelfareCenterData, 
    welfareCenterPer10000Data, 
    // downloadFile, 
    downloadWelfareCenterExcel, 
  } = useWelfareCenterStore()
  
  // 확장된 협력기관 데이터를 저장할 상태
  const [enhancedExportData, setEnhancedExportData] = useState([])
  
  // 마운트되자마자 불러와야 하는 정보들 
  useEffect(() => {
    getWelfareCenterData()
  }, [getWelfareCenterData])

  // 선택된 동의 코드가 변경되면 불러와야 하는 메서드들 
  useEffect(() => {
    if (selectedDongCode) {

      // 추가 데이터 로드 로직 (필요한 경우)
    }
  }, [selectedDongCode])

  // 주소에서 동/면/읍 이름을 추출하는 더 정확한 함수
  const extractDongName = (address: string) => {
    if (!address) return "";
    
    // 다양한 주소 형식 처리
    // 1. "경상남도 양산시 물금읍" 형식
    // 2. "양산시 물금읍" 형식
    // 3. "양산시 중부동" 형식 등
    
    const dongPattern = /(양산시\s+)([^\s]+[읍|면|동|가])/;
    const match = address.match(dongPattern);
    
    if (match && match[2]) {
      return match[2];
    }
    
    // 양산시 다음에 나오는 단어 (기존 방식의 폴백)
    const simpleMatch = address.match(/양산시\s+([^\s]+)/);
    return simpleMatch && simpleMatch[1] ? simpleMatch[1] : "";
  }

  // 메서드에 의해 데이터가 변경되었을 때 다뤄야 하는 로직들 
  useEffect(() => {
    if (!welfareCenterExportDetailData || welfareCenterExportDetailData.length === 0) {
      return;
    }
    
    // 주소에서 동 이름 추출하여 welfareCenterExportDetailData를 확장
    const enhanced = welfareCenterExportDetailData.map(center => {
      const dongName = extractDongName(center.address);
      
      return {
        ...center,
        extractedDongName: dongName
      };
    });
    
    // 상태 업데이트
    setEnhancedExportData(enhanced as never[]);
    
    console.log("welfareCenterData:", welfareCenterData);
    console.log("welfareCenterLocationData:", welfareCenterLocationData);
    console.log("welfareCenterExportDetailData:", welfareCenterExportDetailData);
    console.log("welfareCenterPer10000Data:", welfareCenterPer10000Data);
    console.log("enhancedExportData:", enhanced);
    
  }, [welfareCenterData, welfareCenterLocationData, welfareCenterExportDetailData, welfareCenterPer10000Data])

  // 협력기관 마커 포인트 생성 (모든 기관을 지도에 표시)
  const markerPoints = welfareCenterLocationData.map(center => ({
    name: center.organizationName,
    latitude: center.latitude,
    longitude: center.longitude,
    dongName: center.dongName || extractDongName(center.address),
    // type: center.type // API에 없음
  }))

  // // 선택된 동의 청년 10000명당 협력기관 비율
  // const selectedDongRatio = isSelected
  //   ? welfareCenterPer10000Data.find(item => item.regionName === selectedDongName)?.regionValue || 0
  //   : 0

  // // 선택된 동의 청년 인구 정보
  // const selectedDongYouthPopulation = isSelected && welfareCenterPer10000Data.length > 0
  //   ? welfareCenterPer10000Data.find(item => item.regionName === selectedDongName)?.youthPopulation || 0
  //   : 0

  // 동 이름으로 필터링된 협력기관 목록 (enhancedExportData 사용)
  const filteredWelfareCenters = isSelected && enhancedExportData.length > 0
    ? enhancedExportData.filter((center: { extractedDongName: string }) => center.extractedDongName === selectedDongName)
    : enhancedExportData;
  
  // console.log("filteredWelfareCenters:", filteredWelfareCenters);
  
  // 선택된 동의 협력기관 수
  const selectedDongCenterCount = filteredWelfareCenters.length;
  
  // 청년 10000명당 협력기관 수 계산 (실제 계산)
  const centersPerThousand = welfareCenterPer10000Data.length > 0 
    ? welfareCenterPer10000Data.find(item => item.regionName === selectedDongName)?.regionValue || 0
    : 0;

  // console.log("welfareCenterData : ", welfareCenterData)
  // console.log("welfareCenterPer10000Data : ", welfareCenterPer10000Data)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        협력기관 위치 최적화
      </h1>

      {/* 나머지 렌더링 코드는 그대로 유지 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="협력기관 위치 현황" subTitle={isSelected ? `현재 선택됨: ${selectedDongName}` : "지도에서 행정동을 선택해주세요"}>
          <div className="h-125 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
              </div>
            ) : (
              <YangsanMap
                points={markerPoints}
                showMarkers={true}
                markerColor={colors.secondary.main}
              />
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="행정동 내 청년 인구 대비 협력기관 현황" subTitle="청년 10,000명당 배치된 협력기관 수를 나타냅니다.">
            {!isSelected ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-500">지역을 선택하면 상세 정보가 표시됩니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4">
                {/* <div className="flex flex-col justify-between text-center p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500">청년 인구</p>
                  <p className="text-xl font-bold">{selectedDongYouthPopulation}명</p>
                </div> */}
                <div className="flex flex-col justify-between text-center p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500">협력기관 수</p>
                  <p className="text-xl font-bold">{selectedDongCenterCount}개</p>
                </div>
                <div className="flex flex-col justify-between text-center p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-gray-500">청년 10,000명당</p>
                  <p className="text-sm text-gray-500">협력기관 수</p>  
                  <p className="text-xl font-bold">{centersPerThousand}개</p>
                </div>
              </div>
            )}
          </Card>

          <Card title="양산시 평균대비 행정동 내 협력기관 현황" subTitle="양산시 평균과 선택된 행정동의 협력기관 수를 비교합니다.">
            <BarChart
              data={[
                { name: '양산시 평균', value: 9.8, color: colors.chart.orange },
                { name: selectedDongName || '지역 선택', value: isSelected ? centersPerThousand : 0, color: colors.chart.blue }
              ]}
              layout="vertical"
              height={250}
              valueUnit="개"
              valueName="협력기관 수"
              tooltipFormatter={(value) => [`${value}개`, '협력기관 수']}
              barSize={50}
            />
          </Card>
        </div>
      </div>

      <Card title="행정동별 청년인구 대비 협력기관 현황" subTitle="청년 10,000명당 협력기관 수를 행정동별로 나타냅니다.">
        <BarChart
          data={welfareCenterPer10000Data.sort((a, b) => b.regionValue - a.regionValue).map(entry => ({
            name: entry.regionName,
            value: entry.regionValue,
            color: entry.regionName === selectedDongName ? colors.chart.blue : colors.chart.lightGray
          }))}
          height={250}
          valueUnit="개"
          valueName="협력기관 수"
          tooltipFormatter={(value) => [`${value}개`, '협력기관 수']}
          marginBottom={40}
        />
      </Card>

      <Sheet
        title={isSelected ? `${selectedDongName} 협력기관 현황` : "전체 협력기관 현황"}
        data={filteredWelfareCenters}  // 확장된 데이터 사용
        columns={[
          { key: 'type', title: '기관 분류' },
          { key: 'organizationName', title: '기관명' },
          { key: 'address', title: '주소' },
          { key: 'phoneNumber', title: '전화번호' },
          { key: 'extractedDongName', title: '행정동' } // 추출된 동 이름 표시
        ]}
        onDownload={() => downloadWelfareCenterExcel()}
        isLoading={isLoading}
        rowKey="id"
        onRowClick={(record) => console.log('선택된 기관:', record)}
        emptyMessage={isSelected ? `${selectedDongName}에 등록된 협력기관이 없습니다.` : '협력기관 데이터가 없습니다.'}
      />
    </div>
  )
}