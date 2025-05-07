"use client"

// import { useEffect } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { colors } from "@/constants/colors"
// import { PromotionMap } from "@/components/promotionNetwork/PromotionMap"
// import { usePromotionNetworkStore } from "@/stores/usePromotionNetworkStore"

export default function PromotionNetworkPage() {
  // const { fetchPromotionData, promotionData, isLoading } = usePromotionNetworkStore()

  // useEffect(() => {
  //   fetchPromotionData()
  // }, [fetchPromotionData])

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        최적화 홍보 네트워크망
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="홍보물 위치 현황">
          <div className="h-80">
            {/* <PromotionMap /> */}
          </div>
        </Card>

        <div>
          <Card title="해당 행정동 내 청년 인구 분포 비율">
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
                  <p className="text-3xl font-bold">7.3%</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <Card title="홍보 유형 분류">
              <div className="flex justify-between items-end h-32 mt-4">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-12 bg-[#E8F1FF] rounded-t-md"></div>
                  <p className="text-xs mt-1">편의점</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-32 w-12 bg-[#FFD166] rounded-t-md"></div>
                  <p className="text-xs mt-1">마트</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-8 w-12 bg-[#E8F1FF] rounded-t-md"></div>
                  <p className="text-xs mt-1">카페</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-10 w-12 bg-[#E8F1FF] rounded-t-md"></div>
                  <p className="text-xs mt-1">PC방</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-24 w-12 bg-[#E8F1FF] rounded-t-md"></div>
                  <p className="text-xs mt-1">학교</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-28 w-12 bg-[#E8F1FF] rounded-t-md"></div>
                  <p className="text-xs mt-1">현수막</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Card title="행정동별 청년인구 대비 홍보 현황">
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
        title="홍보물 설치 현황"
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
                  장소 분류
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
                <td className="px-6 py-4 whitespace-nowrap">학교</td>
                <td className="px-6 py-4 whitespace-nowrap">홍보물 A</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">PC방</td>
                <td className="px-6 py-4 whitespace-nowrap">홍보물 B</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">카페</td>
                <td className="px-6 py-4 whitespace-nowrap">홍보물 C</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">카페</td>
                <td className="px-6 py-4 whitespace-nowrap">홍보물 B</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">현수막</td>
                <td className="px-6 py-4 whitespace-nowrap">홍보물 B</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">편의점</td>
                <td className="px-6 py-4 whitespace-nowrap">홍보물 C</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">편의점</td>
                <td className="px-6 py-4 whitespace-nowrap">홍보물 A</td>
                <td className="px-6 py-4 whitespace-nowrap">경상남도 양산시 양주동 반송로 892번길 5, 770-234</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
