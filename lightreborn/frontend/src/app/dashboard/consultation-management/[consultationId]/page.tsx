"use client"

import { useState } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { colors } from "@/constants/colors"
import { Calendar as CalendarIcon, Edit, Trash2, ArrowLeft } from "lucide-react"
import { UserInfo } from "@/components/common/UserInfo"
import { ColorBox } from "@/components/common/ColorBox"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export default function ConsultationPage() {
  
  const params = useParams()
  const consultationId = params.consultationId as string

  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"summary" | "keywords">("summary")
  
  // 상담 데이터 (실제로는 API 호출로 가져올 데이터)
  const consultationData = {
    type: "정기상담",
    date: "2025-06-27",
    time: "13:00",
    duration: "60",
    client: {
      name: "이OO",
      id: consultationId || "0137",
      gender: "남",
      age: 27,
      score: 58,
      riskLevel: "고립 위험군"
    },
    summary: [
      "대화 진행 시에 온든 생활이 어느 정도 정착됨.",
      "자신의 마음에 온든 생활이 어려고 사람을 대하는 것이 어색하고 괜찮은 이유로 추가적인 경제활동을 검토함.",
      "부모와 함께 거주하나, 부모 측에서도 걱이이 없어 사생활 고려 상황에 맞게 지지해줌.",
      "경제활동에 대한 의지는 있으나 시도 측에서 일상생활 고민 상황에도 꾸준히 보임."
    ],
    keywords: [
      "사람이 많은 곳에 가면 너무 불편해요",
      "혼자 있을 때 그냥 여유롭고 편해요. 하루가 어떻게 지나가는지도 모르겠고요",
      "일은 하고 싶긴 한데... 무섭기도 해요. 나 같은 사람이 할 수 있을지 모르겠어요"
    ],
    interventions: [
      "정서적 지지 및 공감 제공 (비난 없는 환경 조성)",
      "경제활동을 준비를 위한 단계적 접근 방법 안내",
      "지역 내 경제활동을 연계 프로그램 안내 및 참여 권유",
      "자기 효능감 회복을 위한 긍정 경험 회상 유도"
    ],
    specialNote: "면접에 실패를 원인적으로 분석하여, 이번 상담에서는 비교적 적극적으로 표현한 모습이 있음. 상담자와의 관계 형성에 걸쳐 회복되다는 개인 자원의 관점에서 접근 필요.\n향후 비대면 형태의 직업 재활/상담 프로그램 우선 연결",
    nextPlan: {
      date: "2025-05-01",
      time: "10:00",
      tasks: [
        "과제 수행 확인 및 피드백",
        "경제활동 연계 기관 소개 및 정보 전달",
        "자립 여정 시간화(이정표 만들기) 워크시트 적용 시도"
      ]
    },
    recordingFile: "20250527_이OO_정기상담.mp3"
  }
  
  // 편집 페이지로 이동
  const handleEdit = () => {
    router.push(`/dashboard/consultation-management/${consultationId}/edit`)
  }
  
  // 삭제 기능
  const handleDelete = () => {
    if (confirm("정말로 이 상담 일지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // 실제 애플리케이션에서는 여기서 API 호출로 데이터 삭제
      alert("상담 일지가 삭제되었습니다.")
      router.push('/dashboard/consultation-management')
    }
  }
  
  // 목록으로 돌아가기
  const handleBack = () => {
    router.push('/dashboard/consultation-management')
  }
  
  // 날짜 포맷팅 함수
  const formatDisplayDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      return format(date, 'yyyy. MM. dd (E)', { locale: ko })
    } catch (error) {
      console.error(error)
      return dateStr
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="text" 
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft size={18} className="mr-2" />
            목록으로
          </Button>
          <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
            상담일지
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleEdit}
          >
            <Edit size={18} className="mr-2" />
            수정
          </Button>
          <Button 
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 size={18} className="mr-2" />
            삭제
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽 카드: 상담 기본 정보 */}
        <Card title="상담 기본 정보">
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 w-full rounded-lg">
                <h3 className="text-sm text-gray-500 mb-1">상담유형</h3>
                <p className="text-xl font-medium text-[#6B9AFF]">{consultationData.type}</p>
              </div>
              <div className="bg-gray-50 p-4 w-full col-span-2 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-1">상담일시</h3>
                <p className="text-xl font-medium text-[#6B9AFF]">
                  {formatDisplayDate(consultationData.date)} {consultationData.time} ({consultationData.duration}분)
                </p>
              </div>
            </div>
            
            {consultationData.recordingFile && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">녹음 파일</h3>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-600">{consultationData.recordingFile}</span>
                  <Button variant="outline" size="sm">
                    다운로드
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="상담대상자 정보">
          <div className="p-6 flex flex-row gap-4 justify-between">
            <UserInfo 
              name={consultationData.client.name}
              id={consultationData.client.id}
              gender={consultationData.client.gender}
              age={consultationData.client.age}
            />
            <ColorBox 
              scoreText={`${consultationData.client.score}점`}
              color="#FFCACA"
              title={consultationData.client.riskLevel}
            />
          </div>
        </Card>
      </div>
      
      <div className="grid-span-2">
        <Card title="상담 요약 AI 기반 상담일지">
          <div className="p-6">
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 ${activeTab === "summary" ? "border-b-2 border-[#6B9AFF] text-[#6B9AFF] font-medium" : "text-gray-500"}`}
                onClick={() => setActiveTab("summary")}
              >
                상담 주요 내용 요약
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "keywords" ? "border-b-2 border-[#6B9AFF] text-[#6B9AFF] font-medium" : "text-gray-500"}`}
                onClick={() => setActiveTab("keywords")}
              >
                대화자 발언 주요 키워드
              </button>
            </div>

            {activeTab === "summary" ? (
              <div>
                <h3 className="text-lg font-medium mb-4">상담 주요 내용 요약</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {consultationData.summary.map((item, index) => (
                    <p key={`summary-${index}`} className="text-sm mb-2 last:mb-0">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-4">대화자 발언 주요 키워드</h3>
                <div className="bg-[#FFF8E6] p-4 rounded-lg">
                  {consultationData.keywords.map((item, index) => (
                    <p key={`keyword-${index}`} className="text-sm mb-3 last:mb-0">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">상담자의 주요 개입 내용</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {consultationData.interventions.map((item, index) => (
                  <p key={`intervention-${index}`} className="text-sm mb-2 last:mb-0">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">특이사항 / 메모</h3>
              <div className="bg-[#FFF8E6] p-4 rounded-lg">
                {consultationData.specialNote.split('\n').map((paragraph, index) => (
                  <p key={`note-${index}`} className="text-sm mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">다음 상담 계획</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <CalendarIcon size={16} className="text-gray-400 mr-2" />
                  <p className="text-sm font-medium">
                    {formatDisplayDate(consultationData.nextPlan.date)} {consultationData.nextPlan.time}
                  </p>
                </div>
                
                {consultationData.nextPlan.tasks.map((task, index) => (
                  <p key={`task-${index}`} className="text-sm pl-6 mb-2 last:mb-0">
                    • {task}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}