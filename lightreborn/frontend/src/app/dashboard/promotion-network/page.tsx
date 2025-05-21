"use client"

import { Card } from "@/components/common/Card"
import YangsanMap, { MarkerPoint } from "@/components/map/YangsanMap"
import { colors } from "@/constants/colors"
import { useDongInfo } from "@/hooks/useDongInfo"
import { useState, useEffect, useCallback } from "react"
import BarChart from "@/components/common/rechart/BarChart"
import Sheet from "@/components/common/Sheet"
import { usePromotionNetworkStore } from "@/stores/usePromotionNetworkStore"
import { dongCodeMap, getDongInfoByCode, getDongNameByCode } from "@/utils/dongCodeMap"

// 장소 유형 -> 유형 코드 매핑
const placeTypeToCodeMap: Record<string, number> = {
  "편의점": 1,
  "마트": 2,
  "카페": 3,
  "PC방": 4,
  "학교": 5,
  "복지관": 6,
  "약국": 7,
  "식당": 8,
  "병원": 9,
  "보건소": 10
};

// 홍보 유형 코드 -> 이름 매핑
const promotionTypeNames: Record<number, string> = {
  1: "편의점",
  2: "마트",
  3: "카페",
  4: "PC방",
  5: "학교",
  6: "복지관",
  7: "약국",
  8: "식당",
  9: "병원",
  10: "보건소"
};

// 홍보 유형 코드 -> 색상 매핑
const promotionTypeColors: Record<number, string> = {
  1: colors.chart.blue,
  2: colors.secondary.main,
  3: colors.chart.purple,
  4: colors.chart.orange,
  5: colors.chart.green,
  6: colors.primary.light,
  7: "#FF5252",
  8: colors.chart.yellow || "#FFD700",
  9: "#008080",
  10: "#FF69B4"
};

// 지역별 홍보물 통계 타입
interface RegionPromotionData {
  regionCode: number;
  name: string;
  value: number;
}

// 유형별 분포 데이터 타입
interface TypeDistributionData {
  type_code: number;
  count: number;
}

// 홍보물 설치 현황 타입
interface InstallationData {
  id: string;
  name: string;
  type: string;
  materialType: string;
  address: string;
}

// 홍보 거점 요약 정보 타입
interface PromotionSummary {
  region: string;
  regionCode: number;
  promotionCount: number;
  youthPopulation: number;
  promotionPerYouth1000: number;
  youthRatio: string;
}

export default function PromotionNetworkPage() {
  const { selectedDongName, selectedDongCode, isSelected } = useDongInfo()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMarker, setSelectedMarker] = useState<MarkerPoint | null>(null)
  const { 
    // promotionNetworkByType, promotionNetworkByDistrict, 
    getPromotionNetworkDashboardDataByDistrict, getPromotionNetworkLatestData, 
    promotionNetworkLatestData, getPromotionNetworkDashboardDataByType 
  } = usePromotionNetworkStore()
  
  // 데이터 상태 정의
  const [markers, setMarkers] = useState<MarkerPoint[]>([])
  const [regionPromotionData, setRegionPromotionData] = useState<RegionPromotionData[]>([])
  const [typeDistributionData, setTypeDistributionData] = useState<TypeDistributionData[]>([])
  const [installationsData, setInstallationsData] = useState<InstallationData[]>([])
  const [summaryData, setSummaryData] = useState<PromotionSummary | null>(null)

  // 화면 처음부터 렌더링돼야 할 것 
  useEffect(() => {
    getPromotionNetworkLatestData()
  }, [getPromotionNetworkLatestData])

  // 홍보 네트워크망 생성되면 해당 데이터에서 정보 뽑아 마커 생성하기 
  useEffect(() => {
    if (promotionNetworkLatestData) {
      const markers = promotionNetworkLatestData.map(item => ({
        name: item.placeName,
        latitude: item.latitude,
        longitude: item.longitude,
        type: item.locationType || item.promotionType,
      }))
      setMarkers(markers)
      setIsLoading(false)
    }
  }, [promotionNetworkLatestData])  
  
  // 어떤 지역이 선택되면 관련 메서드 실행 (API 호출 포함)
  useEffect(() => {
    if (isSelected && selectedDongCode) {
      getPromotionNetworkDashboardDataByType(Number(selectedDongCode))
      getPromotionNetworkDashboardDataByDistrict(Number(selectedDongCode))
    }
  }, [isSelected, selectedDongCode, getPromotionNetworkDashboardDataByType, getPromotionNetworkDashboardDataByDistrict])

  // 행정동별 홍보 거점 수 계산 함수 - dongCodeMap 활용
  const calculateRegionPromotionData = useCallback((): RegionPromotionData[] => {
    if (!promotionNetworkLatestData) return [];
    
    // 모든 행정동 코드에 대한 카운트 객체 초기화
    const dongCounts = Object.keys(dongCodeMap).reduce((acc, code) => {
      acc[code] = 0;
      return acc;
    }, {} as Record<string, number>);
    
    // 데이터에서 정규화된 dongCode 사용하여 카운트
    promotionNetworkLatestData.forEach(item => {
      // API 데이터에 dongCode가 있는 경우 직접 사용
      if (item.dongCode && dongCounts[item.dongCode] !== undefined) {
        dongCounts[item.dongCode]++;
      } 
      // dongName을 통해 dongCode 조회
      else if (item.dongName) {
        const dongInfo = Object.values(dongCodeMap).find(info => info.name === item.dongName);
        if (dongInfo) {
          dongCounts[dongInfo.code]++;
        }
      }
    });
    
    // 차트 데이터 형식으로 변환
    return Object.entries(dongCounts).map(([code, count]) => {
      const dongInfo = dongCodeMap[code];
      return {
        regionCode: Number(code),
        name: dongInfo ? dongInfo.name : getDongNameByCode(code) || `코드 ${code}`,
        value: count
      };
    });
  }, [promotionNetworkLatestData]);

  // 선택된 동의 홍보 유형별 분포 계산 함수
  const calculateTypeDistribution = () => {
    if (!promotionNetworkLatestData || !selectedDongCode) return [];
    
    // 선택된 동의 홍보물만 필터링
    const filteredItems = promotionNetworkLatestData.filter(item => 
      // dongCode로 직접 비교
      item.dongCode === selectedDongCode ||
      // dongName으로 비교 (selectedDongName이 있는 경우)
      (selectedDongName && item.dongName === selectedDongName)
    );
    
    // 유형별 집계
    const typeCounts: Record<number, number> = {};
    
    // 모든 유형 코드를 0으로 초기화
    Object.keys(promotionTypeNames).forEach(code => {
      typeCounts[Number(code)] = 0;
    });
    
    // 각 홍보물 데이터에서 유형별 개수 집계
    filteredItems.forEach(item => {
      if (item.locationType) {
        const typeCode = placeTypeToCodeMap[item.locationType] || 0;
        if (typeCode > 0) {
          typeCounts[typeCode]++;
        }
      }
    });
    
    // 차트 데이터 형식으로 변환 (0인 항목 제외)
    return Object.entries(typeCounts)
      .filter(([, count]) => count > 0)
      .map(([typeCode, count]) => ({
        type_code: Number(typeCode),
        count
      }));
  };

  // 홍보물 설치 현황 테이블 데이터 가공 함수
  const processPromotionInstallations = () => {
    if (!promotionNetworkLatestData || !selectedDongCode) return [];
    
    // 선택된 동의 행정 코드 정보
    const dongInfo = getDongInfoByCode(selectedDongCode);
    
    // 선택된 동의 홍보물만 필터링
    return promotionNetworkLatestData
      .filter(item => 
        item.dongCode === selectedDongCode || 
        (dongInfo && item.dongName === dongInfo.name)
      )
      .map(item => ({
        id: item.id,
        name: item.placeName,
        type: item.locationType || "기타", // 장소 유형
        materialType: item.promotionType || "기타", // 홍보물 유형
        address: item.address
      }));
  };

  // 선택된 동의 홍보 거점 정보 요약 계산 함수
  const calculatePromotionSummary = () => {
    if (!promotionNetworkLatestData || !selectedDongCode) return null;
    
    // 선택된 동의 행정 코드 정보
    const dongInfo = getDongInfoByCode(selectedDongCode);
    
    // 선택된 동의 홍보물 개수 계산
    const promotionCount = promotionNetworkLatestData.filter(item => 
      item.dongCode === selectedDongCode || 
      (dongInfo && item.dongName === dongInfo.name)
    ).length;
    
    // 청년 인구 정보는 별도 API가 필요하지만, 임시로 고정값 사용
    const youthPopulation = 2830; // 실제로는 API에서 가져와야 함
    
    // 청년 1000명당 홍보 거점 수 계산
    const promotionPerYouth1000 = (promotionCount / youthPopulation) * 1000;
    
    return {
      region: selectedDongName || (dongInfo ? dongInfo.name : ""),
      regionCode: Number(selectedDongCode),
      promotionCount,
      youthPopulation,
      promotionPerYouth1000,
      youthRatio: "11.4" // 실제로는 API에서 가져와야 함
    };
  };

  // API 데이터가 업데이트되거나 선택된 동이 변경될 때 처리
  useEffect(() => {
    if (promotionNetworkLatestData) {
      // 1. 행정동별 홍보 거점 수 계산
      const regionData = calculateRegionPromotionData();
      setRegionPromotionData(regionData);
      
      // 선택된 동이 있는 경우에만 상세 데이터 계산
      if (isSelected && selectedDongCode) {
        // 2. 홍보 유형별 분포 계산
        const typeData = calculateTypeDistribution();
        setTypeDistributionData(typeData);
        
        // 3. 홍보물 설치 현황 데이터 가공
        const installationData = processPromotionInstallations();
        setInstallationsData(installationData);
        
        // 4. 홍보 거점 정보 요약 계산
        const summary = calculatePromotionSummary();
        setSummaryData(summary);
      } else {
        // 선택된 동이 없는 경우 상세 데이터 초기화
        setTypeDistributionData([]);
        setInstallationsData([]);
        setSummaryData(null);
      }
    }
  }, [promotionNetworkLatestData, selectedDongCode, isSelected, selectedDongName]);

  // 마커 클릭 핸들러
  const handleMarkerClick = (point: MarkerPoint) => {
    setSelectedMarker(point);
    console.log("선택된 마커:", selectedMarker);
  };

  // 홍보 유형별 분포 차트 렌더링
  const renderPromotionTypeChart = () => {
    if (!typeDistributionData || typeDistributionData.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">데이터가 없거나 지역을 선택하세요.</p>
        </div>
      );
    }
    
    const chartData = typeDistributionData.map(item => ({
      name: promotionTypeNames[item.type_code] || `유형 ${item.type_code}`,
      value: item.count,
      color: promotionTypeColors[item.type_code] || colors.chart.gray
    }));
    
    return (
      <BarChart
        data={chartData}
        height={250}
        valueName="개수"
        tooltipFormatter={(value, name) => [`${value}개`, name]}
        marginBottom={40}
        hideAxis={false}
      />
    );
  };

  // 홍보 거점 요약 정보 렌더링
  const renderPromotionSummary = () => {
    if (!summaryData) {
      return (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">지역을 선택하면 상세 정보가 표시됩니다.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex flex-col justify-between text-center p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">홍보 거점 수</p>
          <p className="text-xl font-bold">{summaryData.promotionCount}개</p>
        </div>
        <div className="flex flex-col justify-between text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-500">청년 1000명당</p>
          <p className="text-sm text-gray-500">홍보 거점 수</p>
          <p className="text-xl font-bold">{summaryData.promotionPerYouth1000.toFixed(1)}개</p>
        </div>
      </div>
    );
  };

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
                  <YangsanMap 
                    points={markers}
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
                subTitle={selectedDongName ? `${selectedDongName}의 홍보 거점 정보입니다.` : '지역을 선택하면 상세 정보가 표시됩니다.'}
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
              data={regionPromotionData
                .map(entry => ({
                  name: entry.name,
                  value: entry.value,
                  color: entry.name === selectedDongName ? colors.chart.blue : colors.chart.lightGray
                }))
                .sort((a, b) => b.value - a.value)}
              height={250}
              valueUnit="개"
              valueName="홍보물 수"
              tooltipFormatter={(value) => [`${value}개`, '홍보물 수']}
              marginBottom={40}
            />
          </Card>
          
          <Sheet
            title={`${selectedDongName || '행정동'} 홍보물 설치 현황`} 
            subTitle="양산시 행정동별 홍보물 설치 현황을 보여줍니다."
            data={installationsData}
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
  );
}