"use client"

// import { useEffect, useState } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { colors } from "@/constants/colors"
// import { useYouthConsultationStore } from "@/stores/useYouthConsultaionStore"

export default function YouthConsultationPage() {
  // const { fetchConsultationData, consultationData, isLoading } = useYouthConsultationStore()
  // const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // useEffect(() => {
  //   fetchConsultationData()
  // }, [fetchConsultationData])

  // 현재 월의 날짜 생성
  const getDaysInMonth = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth()
  const currentDate = new Date()
  const currentDay = currentDate.getDate()

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        상담 대상자 관리
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="대상자별 상세 정보">
          <div className="flex items-start p-4">
            <div className="w-24 h-24 bg-[#F0F0FF] rounded-full flex items-center justify-center mr-6">
              <div className="w-20 h-20 bg-[#E0E0FF] rounded-full flex items-center justify-center">
                <span className="text-4xl" style={{ color: colors.primary.main }}>
                  남
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-2">이OO</span>
                    <span className="bg-[#6B9AFF] text-white px-2 py-0.5 rounded-md text-xs">#0137</span>
                  </div>
                  <p className="text-gray-600">만 27세</p>
                </div>

                <div className="bg-[#FFCACA] p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold">58점</p>
                  <p className="text-sm">고민 위험군</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="상담리스트">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상담유형
                  </th>
                  <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    담당자
                  </th>
                  <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상담대상자
                  </th>
                  <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상담일시
                  </th>
                  <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    특이사항
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">정기상담</td>
                  <td className="px-4 py-2 whitespace-nowrap">김OO</td>
                  <td className="px-4 py-2 whitespace-nowrap">이OO</td>
                  <td className="px-4 py-2 whitespace-nowrap">2025.06.17</td>
                  <td className="px-4 py-2 whitespace-nowrap">고민위험군 변경</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">정기상담</td>
                  <td className="px-4 py-2 whitespace-nowrap">김OO</td>
                  <td className="px-4 py-2 whitespace-nowrap">이OO</td>
                  <td className="px-4 py-2 whitespace-nowrap">2025.03.22</td>
                  <td className="px-4 py-2 whitespace-nowrap">온든/고민지표 개선</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">정기상담</td>
                  <td className="px-4 py-2 whitespace-nowrap">김OO</td>
                  <td className="px-4 py-2 whitespace-nowrap">이OO</td>
                  <td className="px-4 py-2 whitespace-nowrap">2024.11.21</td>
                  <td className="px-4 py-2 whitespace-nowrap">-</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">초기상담</td>
                  <td className="px-4 py-2 whitespace-nowrap">김OO</td>
                  <td className="px-4 py-2 whitespace-nowrap">이OO</td>
                  <td className="px-4 py-2 whitespace-nowrap">2024.06.11</td>
                  <td className="px-4 py-2 whitespace-nowrap">온든청년 지정</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="최근 적도셈운 응답 요약" className="lg:col-span-2">
          <div className="p-4">
            <div className="mb-6">
              <p className="text-sm mb-2">시행 일자 : 2024. 06. 11.</p>
              <Button variant="outline" size="sm">
                자세히 보기
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#E8F1FF] p-4 rounded-lg text-center">
                <p className="text-3xl font-bold">65점</p>
                <p className="text-sm">사회경제활동</p>
              </div>
              <div className="bg-[#FFCACA] p-4 rounded-lg text-center">
                <p className="text-3xl font-bold">43점</p>
                <p className="text-sm">
                  대인관계 및<br />
                  사회적 상호작용
                </p>
              </div>
              <div className="bg-[#FFF8E6] p-4 rounded-lg text-center">
                <p className="text-3xl font-bold">57점</p>
                <p className="text-sm">
                  생활패턴 및<br />
                  고립행동
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="원클릭 상담내역 작성하기">
          <div className="p-4">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">20250502_이XX_정기상담.mp3</p>
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  파일 추가하기
                </Button>
                <Button variant="outline" size="sm">
                  삭제하기
                </Button>
              </div>
            </div>

            <Button variant="primary" className="w-full">
              상담일지 작성 완료
            </Button>
          </div>
        </Card>
      </div>

      <Card title="적도셈운 시행 내역">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  일련번호
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사회경제활동
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  대인관계 및<br />
                  사회적 상호작용
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생활패턴 및<br />
                  고립행동
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  설문일자
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 whitespace-nowrap">2</td>
                <td className="px-4 py-2 whitespace-nowrap">65점</td>
                <td className="px-4 py-2 whitespace-nowrap">43점</td>
                <td className="px-4 py-2 whitespace-nowrap">57점</td>
                <td className="px-4 py-2 whitespace-nowrap">2025.06.17</td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap">1</td>
                <td className="px-4 py-2 whitespace-nowrap">65점</td>
                <td className="px-4 py-2 whitespace-nowrap">23점</td>
                <td className="px-4 py-2 whitespace-nowrap">42점</td>
                <td className="px-4 py-2 whitespace-nowrap">2024.12.15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="상담 예약 관리">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">일정 확인</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                이전
              </Button>
              <span className="px-2 py-1">June 2024</span>
              <Button variant="outline" size="sm">
                다음
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            <div className="text-center text-sm text-gray-500">SUN</div>
            <div className="text-center text-sm text-gray-500">MON</div>
            <div className="text-center text-sm text-gray-500">TUE</div>
            <div className="text-center text-sm text-gray-500">WED</div>
            <div className="text-center text-sm text-gray-500">THU</div>
            <div className="text-center text-sm text-gray-500">FRI</div>
            <div className="text-center text-sm text-gray-500">SAT</div>

            {Array.from({ length: 30 }).map((_, index) => {
              const day = index + 1
              const isToday = day === currentDay
              const hasAppointment = [10, 11, 13, 26].includes(day)

              return (
                <div
                  key={index}
                  className={`text-center p-2 rounded-md cursor-pointer ${
                    isToday
                      ? "bg-[#6B9AFF] text-white"
                      : hasAppointment
                        ? (day === 11 ? "text-red-500" : day === 13 ? "text-blue-500" : "")
                        : ""
                  }`}
                  // onClick={() => setSelectedDate(`2024-06-${day.toString().padStart(2, "0")}`)}
                >
                  {day}
                </div>
              )
            })}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">상담예정 청년</h3>
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">이OO</p>
                  <p className="text-sm text-gray-500">2025. 06. 26. 오후 3시</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">이OO</p>
                  <p className="text-sm text-gray-500">2025. 04. 28. 오전 10시</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">이OO</p>
                  <p className="text-sm text-gray-500">2025. 04. 28. 오후 1시</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                + 상담청년 리스트 추가하기
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
