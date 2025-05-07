"use client"

// import { useEffect } from "react"
import { Card } from "@/components/common/Card"
import { colors } from "@/constants/colors"
// import { PopulationMap } from "@/components/youthPopluation/PopulationMap"
// import { useYouthPopulationStore } from "@/stores/useYouthPopulationStore"

export default function YouthPopulationPage() {
  // const { fetchPopulationStats, populationStats, isLoading } = useYouthPopulationStore()

  // useEffect(() => {
  //   fetchPopulationStats()
  // }, [fetchPopulationStats])

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        청년 인구 분포 비율
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="행정동 선택">
          <div className="h-80">
            {/* <PopulationMap /> */}
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
                  <p className="text-3xl font-bold">11.4%</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <Card title="오락 정보">
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

      <Card title="행정동 내 청년 인구 분포 비율">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="행정동 청년 중 1인가구 비율">
          <div className="flex items-center justify-center py-4">
            <div
              className="w-48 h-48 rounded-full border-16 flex items-center justify-center relative"
              style={{ borderColor: colors.chart.lightGray }}
            >
              <div
                className="absolute inset-0 rounded-full border-t-16 border-r-16 border-l-16 border-transparent"
                style={{ borderBottomColor: colors.secondary.main, transform: "rotate(45deg)" }}
              ></div>
              <div className="text-center">
                <p className="font-bold">양주동</p>
                <p className="text-3xl font-bold">48.6%</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="행정동 내 청년 1인가구 성비">
          <div className="flex items-center justify-center py-4">
            <div
              className="w-48 h-48 rounded-full border-16 flex items-center justify-center relative"
              style={{ borderColor: colors.chart.lightGray }}
            >
              <div
                className="absolute inset-0 rounded-full border-t-16 border-r-16 border-transparent"
                style={{
                  borderLeftColor: colors.chart.blue,
                  borderBottomColor: colors.status.error,
                  transform: "rotate(-45deg)",
                }}
              ></div>
              <div className="text-center">
                <p className="font-bold">남 : 여</p>
                <p className="text-xl font-bold">40.3 : 59.7</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
