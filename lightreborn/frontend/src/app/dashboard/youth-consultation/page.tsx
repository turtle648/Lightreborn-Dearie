"use client"

// import { useEffect } from "react"
import { Card } from "@/components/common/Card"
import { colors } from "@/constants/colors"
// import { ConsultationChart } from "@/components/youthConsultation/ConsultationChart"
// import { useYouthConsultationStore } from "@/stores/useYouthConsultaionStore"

export default function Dashboard() {
  // const { fetchConsultationStats, consultationStats, isLoading } = useYouthConsultationStore()

  // useEffect(() => {
  //   fetchConsultationStats()
  // }, [fetchConsultationStats])

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        은둔 고립 청년 상담 관리
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium mb-2">누적 상담 현황</h3>
          <p className="text-4xl font-bold" style={{ color: colors.primary.main }}>
            120명
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium mb-2">비위험군</h3>
          <p className="text-4xl font-bold" style={{ color: colors.text.primary }}>
            79명
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium mb-2">고민 위험군</h3>
          <p className="text-4xl font-bold" style={{ color: colors.secondary.main }}>
            21명
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium mb-2">고립 청년</h3>
          <p className="text-4xl font-bold" style={{ color: colors.status.error }}>
            12명
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium mb-2">은둔 청년</h3>
          <p className="text-4xl font-bold" style={{ color: colors.status.error }}>
            12명
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="2025년 월별 상담 건수"
          headerRight={
            <select className="border rounded p-1 text-sm" style={{ borderColor: colors.table.border }}>
              <option>2025년</option>
              <option>2024년</option>
            </select>
          }
        >
          <div className="h-80">
            {/* <ConsultationChart /> */}
          </div>
        </Card>

        <Card title="최근 3개월 신규 등록 상담자 수">
          <div className="flex flex-col h-80">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold mb-2">12명</p>
                <p className="text-sm text-gray-500">2025. 04월 기준</p>
                <p className="text-sm text-red-500 mt-2">▲ 13.5%</p>
              </div>
            </div>

            <div className="flex justify-between items-end h-32">
              <div className="flex flex-col items-center">
                <div className="h-20 w-16 bg-[#E8F1FF] rounded-t-md"></div>
                <p className="text-sm mt-1">1월</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-24 w-16 bg-[#E8F1FF] rounded-t-md"></div>
                <p className="text-sm mt-1">2월</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-32 w-16 bg-[#6B9AFF] rounded-t-md"></div>
                <p className="text-sm mt-1">3월</p>
              </div>

              <div className="ml-8 text-center">
                <div
                  className="w-32 h-32 rounded-full border-8 flex items-center justify-center relative"
                  style={{ borderColor: colors.chart.lightGray }}
                >
                  <div
                    className="absolute inset-0 rounded-full border-t-8 border-r-8 border-b-8 border-transparent"
                    style={{ borderLeftColor: colors.chart.blue, transform: "rotate(-45deg)" }}
                  ></div>
                  <div className="text-center">
                    <p className="font-bold">고민 위험군</p>
                    <p className="text-2xl font-bold">5명</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
