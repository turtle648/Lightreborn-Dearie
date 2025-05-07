"use client"

// import { useEffect } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { colors } from "@/constants/colors"
// import { WelfareMap } from "@/components/welfareCenter/WelfareMap"
// import { useWelfareCenterStore } from "@/stores/useWelfareCenterStore"

export default function WelfareCenterPage() {
  // const { fetchWelfareCenters, welfareCenters, isLoading } = useWelfareCenterStore()

  // useEffect(() => {
  //   fetchWelfareCenters()
  // }, [fetchWelfareCenters])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        협력기관 위치 최적화
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="협력기관 위치 현황">
          <div className="h-80">
            {/* <WelfareMap /> */}
          </div>
        </Card>

        <div>
          <Card title="행정동 내 청년 인구 대비 협력기관 현황">
            <div className="flex items-center justify-center py-4">
              <div
                className="w-48 h-48 rounded-full border-16 flex items-center justify-center relative"
                style={{ borderColor: colors.chart.lightGray }}
              >
                <div
                  className="absolute inset-0 rounded-full border-t-16 border-r-16 border-transparent"
                  style={{
                    borderLeftColor: colors.chart.blue,
                    borderBottomColor: colors.chart.blue,
                    transform: "rotate(-45deg)",
                  }}
                ></div>
                <div className="text-center">
                  <p className="font-bold">양주동</p>
                  <p className="text-3xl font-bold">5.4개</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <Card title="양산시 평균대비 행정동 내 협력기관 현황">
              <div className="space-y-4 mt-4">
                <div className="flex items-center">
                  <div className="w-24 text-sm">양산시 평균</div>
                  <div className="flex-1 h-8 bg-[#FFE8C8] rounded-md flex items-center px-3">3.2</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm">양주동</div>
                  <div className="flex-1 h-8 bg-[#A1C0FF] rounded-md flex items-center px-3">5.4</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Card title="행정동별 청년인구 대비 협력기관 현황">
        <div className="h-64">
          <div className="flex justify-between items-end h-full px-4 py-6">
            {/* {Object.entries(colors.regionColors).map(([region, color], index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-12 rounded-t-md"
                  style={{
                    height: `${Math.max(20, Math.random() * 150)}px`,
                    backgroundColor: region === "양주동" ? colors.chart.blue : colors.chart.lightGray,
                  }}
                ></div>
                <p className="text-xs mt-1">{region}</p>
              </div>
            ))} */}
          </div>
        </div>
      </Card>

      <Card
        title="협력기관 현황"
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
                  주소
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">종합복지시설</td>
                <td className="px-6 py-4 whitespace-nowrap">A 복지관</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">청년복지시설</td>
                <td className="px-6 py-4 whitespace-nowrap">A 복지관</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">청년복지시설</td>
                <td className="px-6 py-4 whitespace-nowrap">A 복지관</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
