"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"  
import { colors } from "@/constants/colors"

interface Consultation {
  id: string
  type: string
  counselor: string
  client: string
  date: string
  status: "진행전" | "완료" | "미적성"
  notes: string
}

interface ScheduledClient {
  id: string
  name: string
  date: string
  time: string
  profileImage?: string
}

export default function ConsultationManagementPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [scheduledClients, setScheduledClients] = useState<ScheduledClient[]>([])

  // 현재 월의 날짜 생성
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []
    // 이전 달의 날짜로 채우기
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // 현재 달의 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
  }

  const formatMonthEn = (date: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const formatMonthShort = (date: Date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const isHighlighted = (day: number) => {
    return [10, 11, 13, 26].includes(day)
  }

  const isSelected = (day: number) => {
    return selectedDate === day
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행전":
        return "bg-green-500"
      case "완료":
        return "bg-blue-500"
      case "미적성":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  useEffect(() => {
    // 실제 구현에서는 API 호출을 통해 데이터를 가져와야 합니다.
    // 임시 데이터
    const mockConsultations: Consultation[] = [
      {
        id: "1",
        type: "정기상담",
        counselor: "김OO",
        client: "이OO",
        date: "2025.06.17",
        status: "진행전",
        notes: "온든/고민지표 개선",
      },
      {
        id: "2",
        type: "초기상담",
        counselor: "김OO",
        client: "이OO",
        date: "2025.06.17",
        status: "완료",
        notes: "온든/고민 척도 설문",
      },
      {
        id: "3",
        type: "정기상담",
        counselor: "김OO",
        client: "이OO",
        date: "2025.06.17",
        status: "미적성",
        notes: "온든/고민지표 개선",
      },
      {
        id: "4",
        type: "정기상담",
        counselor: "김OO",
        client: "이OO",
        date: "2025.06.17",
        status: "완료",
        notes: "온든/고민지표 개선",
      },
      {
        id: "5",
        type: "정기상담",
        counselor: "김OO",
        client: "이OO",
        date: "2025.06.17",
        status: "완료",
        notes: "온든/고민지표 개선",
      },
      {
        id: "6",
        type: "정기상담",
        counselor: "김OO",
        client: "이OO",
        date: "2025.06.17",
        status: "완료",
        notes: "온든/고민지표 개선",
      },
    ]

    const mockScheduledClients: ScheduledClient[] = [
      {
        id: "1",
        name: "이OO",
        date: "2025. 06. 26.",
        time: "오후 3시",
        profileImage: "/abstract-profile.png",
      },
      {
        id: "2",
        name: "이OO",
        date: "2025. 04. 28.",
        time: "오전 10시",
        profileImage: "/abstract-profile.png",
      },
      {
        id: "3",
        name: "이OO",
        date: "2025. 04. 28.",
        time: "오후 1시",
        profileImage: "/abstract-profile.png",
      },
    ]

    setConsultations(mockConsultations)
    setScheduledClients(mockScheduledClients)
    setSelectedDate(26) // 기본적으로 26일 선택
  }, [])

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        상담 일정 관리
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 섹션: 상담사 정보 및 일정 */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img src="/placeholder.svg?key=ob5c7" alt="상담사 프로필" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded mr-2">복지사</span>
                    <span className="font-medium text-lg">이OO</span>
                  </div>
                  <p className="text-gray-600">일정 확인</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-lg">June 2024</h3>
                <div className="flex items-center space-x-2">
                  <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100" aria-label="이전 달">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100" aria-label="다음 달">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                <div className="text-center text-sm text-gray-500 font-medium">SUN</div>
                <div className="text-center text-sm text-gray-500 font-medium">MON</div>
                <div className="text-center text-sm text-gray-500 font-medium">TUE</div>
                <div className="text-center text-sm text-gray-500 font-medium">WED</div>
                <div className="text-center text-sm text-gray-500 font-medium">THU</div>
                <div className="text-center text-sm text-gray-500 font-medium">FRI</div>
                <div className="text-center text-sm text-gray-500 font-medium">SAT</div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="h-10"></div>
                  }

                  return (
                    <button
                      key={`day-${day}`}
                      className={`h-10 rounded-md flex items-center justify-center text-sm
                        ${isSelected(day) ? "bg-blue-500 text-white" : ""}
                        ${isHighlighted(day) && !isSelected(day) ? (day === 11 ? "text-red-500" : day === 13 ? "text-blue-500" : "text-blue-500") : ""}
                        ${!isSelected(day) && !isHighlighted(day) ? "hover:bg-gray-100" : ""}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center text-blue-500 border-blue-500"
                >
                  <span>상담 일정 추가하기</span>
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium text-lg">대상자별 상세 정보 검색</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    placeholder="이름"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="코드"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button className="bg-blue-400 hover:bg-blue-500 text-white">검색하기</Button>
            </div>
          </Card>
        </div>

        {/* 오른쪽 섹션: 상담 예정 청년 목록 */}
        <div>
          <Card className="h-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium text-lg">상담예정청년</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {scheduledClients.map((client) => (
                  <div key={client.id} className="bg-gray-50 rounded-md p-4 flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                      {client.profileImage ? (
                        <img
                          src={client.profileImage || "/placeholder.svg"}
                          alt={client.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-500">
                        {client.date} {client.time}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full flex items-center justify-center text-gray-600">
                  <Plus className="w-4 h-4 mr-1" />
                  <span>상담청년 리스트 추가하기</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 온든고립청년 상담일지 테이블 */}
      <Card>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium text-lg">온든고립청년 상담일지</h3>
          <div className="flex space-x-2">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">상담일지 작성</Button>
            <Button variant="outline">다운로드</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상담유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  담당자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  진행여부
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상담일시
                  <span className="ml-2 inline-flex">
                    <ChevronLeft className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  특이사항
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{consultation.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{consultation.counselor}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(consultation.status)} mr-2`}></div>
                      <span>{consultation.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{consultation.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{consultation.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
