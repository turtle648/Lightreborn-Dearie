"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { colors } from "@/constants/colors"
import YangsanMap, { MarkerPoint } from "@/components/map/YangsanMap"
import { useDongInfo } from "@/hooks/useDongInfo"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
// import { WelfareMap } from "@/components/welfareCenter/WelfareMap"
// import { useWelfareCenterStore } from "@/stores/useWelfareCenterStore"

interface WelfareCenter {
  id: number
  name: string
  type: string
  address: string
  latitude: number
  longitude: number
  dongName: string
}

interface WelfareCenterRatio {
  region: string
  ratio: number
  youthPopulation: number
  centerCount: number
}

export default function WelfareCenterPage() {
  // const { fetchWelfareCenters, welfareCenters, isLoading } = useWelfareCenterStore()
  const [isLoading, setIsLoading] = useState(true)
  const [welfareCenters, setWelfareCenters] = useState<WelfareCenter[]>([])
  const [centerRatioData, setCenterRatioData] = useState<WelfareCenterRatio[]>([])
  const { selectedDongName, isSelected } = useDongInfo()

  useEffect(() => {
    // 가상 데이터 로드 (실제로는 API 호출)
    const fetchWelfareCenters = async () => {
      setIsLoading(true)
      
      try {
        // 실제 구현 시 fetch 호출로 대체
        // const response = await fetch('/api/welfare-centers')
        // const result = await response.json()
        
        // 목업 데이터
        const mockWelfareCenters: WelfareCenter[] = [
          { 
            id: 1, 
            name: "양산시 청년센터", 
            type: "청년복지시설", 
            address: "경상남도 양산시 양주동 반송로 892번길 5, 770-234",
            latitude: 35.342,
            longitude: 129.037,
            dongName: "양주동"
          },
          { 
            id: 2, 
            name: "물금읍 행정복지센터", 
            type: "종합복지시설", 
            address: "경상남도 양산시 물금읍 증산역로 58, 770-876",
            latitude: 35.391,
            longitude: 129.055,
            dongName: "물금읍"
          },
          { 
            id: 3, 
            name: "양산시 청소년 문화의집", 
            type: "청소년복지시설", 
            address: "경상남도 양산시 중앙동 문화로 345, 770-321",
            latitude: 35.338,
            longitude: 129.028,
            dongName: "중앙동"
          },
          { 
            id: 4, 
            name: "양산시 일자리센터", 
            type: "고용지원센터", 
            address: "경상남도 양산시 양주동 강변로 256, 770-123",
            latitude: 35.344,
            longitude: 129.032,
            dongName: "양주동"
          },
          { 
            id: 5, 
            name: "양산시 종합복지관", 
            type: "종합복지시설", 
            address: "경상남도 양산시 삼성동 대운로 567, 770-545",
            latitude: 35.36,
            longitude: 129.09,
            dongName: "삼성동"
          },
          { 
            id: 6, 
            name: "양산시 노인복지관", 
            type: "노인복지시설", 
            address: "경상남도 양산시 물금읍 대학로 78, 770-654",
            latitude: 35.386,
            longitude: 129.05,
            dongName: "물금읍"
          },
          { 
            id: 7, 
            name: "청년 이룸센터", 
            type: "청년복지시설", 
            address: "경상남도 양산시 양주동 중앙로 123, 770-654",
            latitude: 35.345,
            longitude: 129.03,
            dongName: "양주동"
          },
          { 
            id: 8, 
            name: "학교밖청소년지원센터", 
            type: "청소년복지시설", 
            address: "경상남도 양산시 덕계동 강변로 45, 770-421",
            latitude: 35.333,
            longitude: 129.045,
            dongName: "덕계동"
          },
          { 
            id: 9, 
            name: "평산동 주민센터", 
            type: "행정복지센터", 
            address: "경상남도 양산시 평산동 평산로 100, 770-512",
            latitude: 35.355,
            longitude: 129.06,
            dongName: "평산동"
          }
        ]
        
        setWelfareCenters(mockWelfareCenters)
        
        // 행정동별 청년 인구 대비 협력기관 비율 데이터 (1000명당)
        const mockCenterRatioData: WelfareCenterRatio[] = [
          { region: "양주동", ratio: 5.4, youthPopulation: 5530, centerCount: 30 },
          { region: "물금읍", ratio: 4.8, youthPopulation: 4960, centerCount: 24 },
          { region: "삼성동", ratio: 3.2, youthPopulation: 3760, centerCount: 12 },
          { region: "중앙동", ratio: 2.9, youthPopulation: 3450, centerCount: 10 },
          { region: "덕계동", ratio: 2.5, youthPopulation: 3980, centerCount: 10 },
          { region: "동면", ratio: 2.2, youthPopulation: 2270, centerCount: 5 },
          { region: "하북면", ratio: 2.0, youthPopulation: 1480, centerCount: 3 },
          { region: "상북면", ratio: 1.8, youthPopulation: 1670, centerCount: 3 },
          { region: "원동면", ratio: 1.5, youthPopulation: 1330, centerCount: 2 },
          { region: "강서동", ratio: 1.3, youthPopulation: 2320, centerCount: 3 },
          { region: "소주동", ratio: 1.1, youthPopulation: 2730, centerCount: 3 },
          { region: "서창동", ratio: 0.8, youthPopulation: 2520, centerCount: 2 },
          { region: "평산동", ratio: 0.5, youthPopulation: 2000, centerCount: 1 }
        ].sort((a, b) => b.ratio - a.ratio)
        
        setCenterRatioData(mockCenterRatioData)
      } catch (error) {
        console.error("협력기관 데이터 로드 실패:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchWelfareCenters()
  }, [])

  // 선택된 동에 따라 협력기관 필터링 (테이블 표시용)
  const filteredWelfareCenters = isSelected
    ? welfareCenters.filter(center => center.dongName === selectedDongName)
    : welfareCenters

  // 협력기관 마커 포인트 생성 (모든 기관을 지도에 표시)
  const markerPoints: MarkerPoint[] = welfareCenters.map(center => ({
    name: center.name,
    latitude: center.latitude,
    longitude: center.longitude,
    type: center.type
  }))

  // 선택된 동의 청년 1000명당 협력기관 비율
  const selectedDongRatio = isSelected
    ? centerRatioData.find(item => item.region === selectedDongName)?.ratio || 0
    : null
    
  // 선택된 동의 협력기관 정보 가져오기
  const selectedDongInfo = isSelected
    ? centerRatioData.find(item => item.region === selectedDongName)
    : null

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        협력기관 위치 최적화
      </h1>

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
          <Card title="행정동 내 청년 인구 대비 협력기관 현황" subTitle="청년 1000명당 배치된 협력기관 수를 나타냅니다.">
            {!isSelected ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-500">지역을 선택하면 상세 정보가 표시됩니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="flex flex-col justify-between text-center p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500">청년 인구</p>
                  <p className="text-xl font-bold">{selectedDongInfo?.youthPopulation.toLocaleString()}명</p>
                </div>
                <div className="flex flex-col justify-between text-center p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500">협력기관 수</p>
                  <p className="text-xl font-bold">{selectedDongInfo?.centerCount}개</p>
                </div>
                <div className="flex flex-col justify-between text-center p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-gray-500">청년 1000명당</p>
                  <p className="text-sm text-gray-500">협력기관 수</p>
                  <p className="text-xl font-bold">{selectedDongInfo?.ratio.toFixed(1)}개</p>
                </div>
              </div>
            )}
          </Card>

          <Card title="양산시 평균대비 행정동 내 협력기관 현황" subTitle="양산시 평균과 선택된 행정동의 협력기관 수를 비교합니다.">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: '양산시 평균', value: 3.2, color: colors.chart.lightGray },
                    { name: selectedDongName || '지역 선택', value: isSelected ? selectedDongRatio : 0, color: colors.chart.blue }
                  ]}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 'dataMax + 1']} />
                  <YAxis 
                    dataKey="name"
                    type="category"
                    width={60}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => [`${value}개`, '협력기관 수']} />
                  <Bar dataKey="value" name="협력기관 수">
                    {(isSelected 
                      ? [
                        { name: '양산시 평균', value: 3.2, color: colors.chart.orange },
                        { name: selectedDongName, value: selectedDongRatio, color: colors.chart.blue }
                      ] 
                      : [
                        { name: '양산시 평균', value: 3.2, color: colors.chart.orange },
                        { name: '지역 선택', value: 0, color: colors.chart.lightGray }
                      ]
                    ).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <Card title="행정동별 청년인구 대비 협력기관 현황" subTitle="청년 1000명당 협력기관 수를 행정동별로 나타냅니다.">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={centerRatioData}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 40
              }}
            >
              <XAxis 
                dataKey="region" 
                tick={{ fontSize: 12 }}
                height={40}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                tickFormatter={(value) => `${value}개`}
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip 
                formatter={(value) => [`${value}개`, '협력기관 수']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="ratio" name="협력기관 수">
                {centerRatioData.map((entry) => (
                  <Cell 
                    key={`cell-${entry.region}`} 
                    fill={entry.region === selectedDongName ? colors.chart.blue : colors.chart.lightGray} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
        title={isSelected ? `${selectedDongName} 협력기관 현황` : "전체 협력기관 현황"}
        headerRight={
          <Button variant="primary" size="sm">
            다운로드
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기관 분류
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기관명
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  행정동
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주소
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : filteredWelfareCenters.length > 0 ? (
                filteredWelfareCenters.map((center) => (
                  <tr key={center.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{center.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{center.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{center.dongName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{center.address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    {isSelected ? `${selectedDongName}에 등록된 협력기관이 없습니다.` : '협력기관 데이터가 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
