"use client"

import { Card } from "@/components/common/Card"
import YangsanMap, { MarkerPoint } from "@/components/map/YangsanMap"
import { colors } from "@/constants/colors"
import { useDongInfo } from "@/hooks/useDongInfo"
import { useState, useEffect } from "react"
import BarChart from "@/components/common/rechart/BarChart"
import Sheet from "@/components/common/Sheet"
import { usePromotionNetworkStore } from "@/stores/usePromotionNetworkStore"
import { getPromotionNetworkDashboardDataByType } from "@/apis/promotionNetworkApi"

// 홍보 유형 코드 -> 이름 매핑
const promotionTypeNames: Record<number, string> = {
  1: "편의점",
  2: "마트",
  3: "카페",
  4: "PC방",
  5: "학교",
  6: "현수막",
}

// 홍보 유형 코드 -> 색상 매핑
const promotionTypeColors: Record<number, string> = {
  1: colors.chart.blue,
  2: colors.secondary.main,
  3: colors.chart.purple,
  4: colors.chart.orange,
  5: colors.chart.green,
  6: colors.primary.light,
}

interface PromotionNetworkData {
  promotionNetworkStatus: {
    unit: string
    regionData: {
      regionCode: number
      value: number
      name: string
    }[]
    pointData: MarkerPoint[]
  }
  promotionDetailByRegion: {
    region: string
    regionCode: number
    promotionPerYouth1000: number
    youthPopulation: number
    youthRatio: string
    promotionCount: number
    promotionTypeDistribution: {
      type_code: number
      count: number
    }[]
    promotionInstallations: {
      id: number
      name: string
      type: string
      materialType: string
      address: string
    }[]
  } | null
}

export default function PromotionNetworkPage() {
  const { selectedDongName, selectedDongCode, isSelected } = useDongInfo()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<PromotionNetworkData | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<MarkerPoint | null>(null)
  const { promotionNetworkByType, promotionNetworkByDistrict, getPromotionNetworkDashboardDataByDistrict } = usePromotionNetworkStore()

  // 메서드 실행돼서 데이터 업데이트 되면 실행
  useEffect(() => {

  }, [promotionNetworkByType, promotionNetworkByDistrict])
  
  // 어떤 지역이 선택되면 관련 메서드 실행 (API 호출 포함)
  useEffect(() => {
    if (isSelected && selectedDongCode) {
      getPromotionNetworkDashboardDataByType({dongCode: Number(selectedDongCode)})
      getPromotionNetworkDashboardDataByDistrict(Number(selectedDongCode))
    }
  }, [isSelected, selectedDongCode, getPromotionNetworkDashboardDataByType, getPromotionNetworkDashboardDataByDistrict])

  useEffect(() => {
    
  }, [promotionNetworkByType, promotionNetworkByDistrict])

  // 실제 구현에서는 API 호출로 대체
  useEffect(() => {
    // 가상 데이터 로드 (실제로는 API 호출)
    const fetchData = async () => {
      setIsLoading(true)
      
      // 실제 API 호출 (여기서는 목업 데이터)
      try {
        // 실제 구현 시 fetch 호출로 대체
        // const response = await fetch('/api/promotion-network')
        // const result = await response.json()
        
        // 목업 데이터
        const mockPointData: MarkerPoint[] = [
          { name: "양주동 편의점", latitude: 35.342, longitude: 129.037, type: "편의점" },
          { name: "물금읍 마트", latitude: 35.391, longitude: 129.055, type: "마트" },
          { name: "물금읍 카페", latitude: 35.386, longitude: 129.05, type: "카페" },
          { name: "중앙동 PC방", latitude: 35.338, longitude: 129.028, type: "PC방" },
          { name: "양주동 학교", latitude: 35.344, longitude: 129.032, type: "학교" },
          { name: "삼성동 현수막", latitude: 35.36, longitude: 129.09, type: "현수막" },
          { name: "양주동 마트", latitude: 35.347, longitude: 129.035, type: "마트" },
          { name: "상북면 편의점", latitude: 35.419, longitude: 129.025, type: "편의점" },
        ]
        
        const mockRegionData = [
          { regionCode: 48330250, name: "중앙동", value: 27 }, 
          { regionCode: 48330253, name: "양주동", value: 32 },
          { regionCode: 48330256, name: "삼성동", value: 18 },
          { regionCode: 48330110, name: "물금읍", value: 22 },
          { regionCode: 48330120, name: "동면", value: 15 },
          { regionCode: 48330130, name: "원동면", value: 10 },
          { regionCode: 48330140, name: "상북면", value: 12 },
          { regionCode: 48330150, name: "하북면", value: 8 },
          { regionCode: 48330252, name: "강서동", value: 13 },
          { regionCode: 48330255, name: "소주동", value: 9 },
          { regionCode: 48330257, name: "덕계동", value: 14 },
          { regionCode: 48330268, name: "평산동", value: 0 },
          { regionCode: 48330259, name: "서창동", value: 11 }
        ]
        
        const mockPromotionTypeDistribution = [
          { type_code: 1, count: 15 }, // 편의점
          { type_code: 2, count: 8 },  // 마트
          { type_code: 3, count: 12 }, // 카페
          { type_code: 4, count: 5 },  // PC방
          { type_code: 5, count: 3 },  // 학교
          { type_code: 6, count: 10 }, // 현수막
        ]
        
        // 홍보물 설치 현황 목업 데이터
        const mockPromotionInstallations = [
          { id: 1, name: "스타벅스 양산점", type: "카페", materialType: "포스터", address: "경상남도 양산시 양주동 반송로 892번길 5, 770-234" },
          { id: 2, name: "PC방 나비", type: "PC방", materialType: "X배너", address: "경상남도 양산시 양주동 반송로 768번길 8, 770-243" },
          { id: 3, name: "GS25 양산역점", type: "편의점", materialType: "포스터", address: "경상남도 양산시 양주동 강변로 256, 770-123" },
          { id: 4, name: "이마트 양산점", type: "마트", materialType: "배너", address: "경상남도 양산시 물금읍 증산역로 58, 770-876" },
          { id: 5, name: "커피빈 양산점", type: "카페", materialType: "리플렛", address: "경상남도 양산시 삼성동 대운로 567, 770-545" },
          { id: 6, name: "양산초등학교", type: "학교", materialType: "포스터", address: "경상남도 양산시 중앙동 문화로 345, 770-321" },
          { id: 7, name: "양산대학교", type: "학교", materialType: "X배너", address: "경상남도 양산시 물금읍 대학로 78, 770-654" },
          { id: 8, name: "메가커피 양산점", type: "카페", materialType: "스티커", address: "경상남도 양산시 삼성동 삼성로 24, 770-365" },
        ]
        
        // 선택된 지역이 있으면 해당 지역의 상세 정보 생성
        const selectedRegionDetail = isSelected ? {
          region: selectedDongName || "양주동",
          regionCode: Number(selectedDongCode) || 48330253,
          promotionPerYouth1000: 18.2,
          youthPopulation: 2830,
          youthRatio: "11.4",
          promotionCount: 53,
          promotionTypeDistribution: mockPromotionTypeDistribution,
          promotionInstallations: mockPromotionInstallations.filter(item => 
            // 선택된 지역에 따라 필터링 (실제 구현에서는 API에서 필터링된 데이터 제공)
            item.address.includes(selectedDongName || "양주동")
          )
        } : null
        
        const mockResponse: PromotionNetworkData = {
          promotionNetworkStatus: {
            unit: "홍보물 개수",
            regionData: mockRegionData,
            pointData: mockPointData
          },
          promotionDetailByRegion: selectedRegionDetail
        }
        
        setData(mockResponse)
      } catch (error) {
        console.error("홍보 거점 데이터 로드 실패:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [selectedDongCode, selectedDongName, isSelected])

  // 마커 클릭 핸들러
  const handleMarkerClick = (point: MarkerPoint) => {
    setSelectedMarker(point)
  }

  // 선택된 지역의 홍보 유형 분포 데이터
  const promotionTypeData = data?.promotionDetailByRegion?.promotionTypeDistribution.map(item => ({
    name: promotionTypeNames[item.type_code] || `유형 ${item.type_code}`,
    value: item.count,
    color: promotionTypeColors[item.type_code] || colors.chart.gray
  }))

  // 홍보 거점 요약 정보 렌더링
  const renderPromotionSummary = () => {
    if (!data?.promotionDetailByRegion) {
      return (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">지역을 선택하면 상세 정보가 표시됩니다.</p>
        </div>
      )
    }
    
    const detail = data.promotionDetailByRegion
    
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="flex flex-col justify-between text-center p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">청년 인구</p>
          <p className="text-xl font-bold">{detail.youthPopulation.toLocaleString()}명</p>
        </div>
        {/* <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">청년 비율</p>
          <p className="text-xl font-bold">{detail.youthRatio}%</p>
        </div> */}
        <div className="flex flex-col justify-between text-center p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">홍보 거점 수</p>
          <p className="text-xl font-bold">{detail.promotionCount}개</p>
        </div>
        <div className="flex flex-col justify-between text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-500">청년 1000명당</p>
          <p className="text-sm text-gray-500">홍보 거점 수</p>
          <p className="text-xl font-bold">{detail.promotionPerYouth1000.toFixed(1)}개</p>
        </div>
      </div>
    )
  }

  // 홍보 유형별 분포 차트
  const renderPromotionTypeChart = () => {
    if (!promotionTypeData) return null;
    
    return (
      <BarChart
        data={promotionTypeData}
        height={250}
        valueName="개수"
        tooltipFormatter={(value, name) => [`${value}개`, name]}
        marginBottom={40}
        hideAxis={false}
      />
    );
  };

  // 행정동별 홍보 거점 수 데이터 (내림차순 정렬)
  const regionPromotionData = data?.promotionNetworkStatus.regionData
    ? [...data.promotionNetworkStatus.regionData].sort((a, b) => b.value - a.value)
    : []

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        홍보 거점 네트워크
      </h1>

      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">데이터를 불러오는 중입니다...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card title="행정동별 홍보 거점 현황" subTitle="지도에서 행정동을 선택하면 상세 정보가 표시됩니다.">
                <div className="h-125 w-full">
                  {/* 마커 표시 기능이 있는 양산 지도 */}
                  <YangsanMap 
                    points={data?.promotionNetworkStatus.pointData || []}
                    showMarkers={true}
                    markerColor={colors.primary.main}
                    onMarkerClick={handleMarkerClick}
                  />
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card 
                title={`${selectedDongName || '행정동'} 홍보 거점 정보`} 
                subTitle={selectedMarker ? `선택된 거점: ${selectedMarker.name}` : '지역을 선택하면 상세 정보가 표시됩니다.'}
              >
                {renderPromotionSummary()}
              </Card>

              <Card 
                title={`${selectedDongName || '행정동'} 홍보 유형별 분포`}
                subTitle="유형별 홍보 거점 분포를 보여줍니다."
              >
                {renderPromotionTypeChart()}
              </Card>
            </div>
          </div>

          <Card title="전체 행정동별 홍보 거점 수" subTitle="양산시 행정동별 홍보 거점 개수를 보여줍니다.">
            <BarChart
              data={regionPromotionData.map(entry => ({
                name: entry.name,
                value: entry.value,
                color: entry.name === selectedDongName ? colors.chart.blue : colors.chart.lightGray
              }))}
              height={250}
              valueUnit="개"
              valueName="홍보물 수"
              tooltipFormatter={(value) => [`${value}개`, '홍보물 수']}
              marginBottom={40}
            />
          </Card>
          
          <Sheet
            title="홍보물 설치 현황" 
            subTitle="홍보물 설치 현황을 보여줍니다."
            data={data?.promotionDetailByRegion?.promotionInstallations || []}
            columns={[
              { key: 'name', title: '장소명' },
              { key: 'type', title: '장소 유형' },
              { key: 'materialType', title: '홍보물 유형' },
              { key: 'address', title: '주소' },
            ]}
            onDownload={() => console.log('홍보 거점 데이터 다운로드')}
            isLoading={isLoading} 
            rowKey="id"
            onRowClick={(record) => console.log("선택한 홍보물 정보:", record)}
            emptyMessage={isSelected ? `${selectedDongName} 행정동에 홍보물이 없습니다.` : "지역을 선택하면 홍보물 설치 현황이 표시됩니다."}
          />

        </>
      )}
    </div>
  )
}
