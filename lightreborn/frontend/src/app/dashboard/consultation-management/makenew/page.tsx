"use client"

import { useState } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { colors } from "@/constants/colors"

export default function MakeNewConsultationPage() {
  const [activeTab, setActiveTab] = useState("info")

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        상담정보
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-1">상담유형</h3>
                <p className="text-xl font-medium text-[#6B9AFF]">정기상담</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-1">상담일시</h3>
                <p className="text-xl font-medium text-[#6B9AFF]">2025. 06. 27. 13시 (60분)</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">상담대상자 정보</h3>
              <div className="flex items-start">
                <div className="w-20 h-20 bg-[#F0F0FF] rounded-full flex items-center justify-center mr-4">
                  <div className="w-16 h-16 bg-[#E0E0FF] rounded-full flex items-center justify-center">
                    <span className="text-2xl" style={{ color: colors.primary.main }}>
                      남
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">이OO</span>
                        <span className="bg-[#6B9AFF] text-white px-2 py-0.5 rounded-md text-xs">#0137</span>
                      </div>
                      <p className="text-gray-600">만 27세</p>
                    </div>

                    <div className="bg-[#FFCACA] p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold">58점</p>
                      <p className="text-sm">고립 위험군</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">원클릭 상담내역 작성하기</h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">📎</span>
                  <p className="text-sm text-gray-600">20250502_이XX_정기상담.mp3</p>
                </div>
                <Button variant="outline" size="sm">
                  삭제하기
                </Button>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1">
                  파일 추가하기
                </Button>
                <Button variant="primary" className="flex-1">
                  상담일지 작성 완료
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 ${activeTab === "info" ? "border-b-2 border-[#6B9AFF] text-[#6B9AFF] font-medium" : "text-gray-500"}`}
                onClick={() => setActiveTab("info")}
              >
                상담 주요 내용 요약
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "comments" ? "border-b-2 border-[#6B9AFF] text-[#6B9AFF] font-medium" : "text-gray-500"}`}
                onClick={() => setActiveTab("comments")}
              >
                대화자 발언 주요 키워드
              </button>
            </div>

            {activeTab === "info" && (
              <div className="space-y-4">
                <p className="text-sm">대화 진행 시에 온든 생활이 어느 정도 정착됨.</p>
                <p className="text-sm">
                  자신의 마음에 온든 생활이 어려고 사람을 대하는 것이 어색하고 괜찮은 이유로 추가적인 경제활동을 검토함.
                </p>
                <p className="text-sm">
                  부모와 함께 거주하나, 부모 측에서도 걱이이 없어 사생활 고려 상황에 맞게 지지해줌.
                </p>
                <p className="text-sm">경제활동에 대한 의지는 있으나 시도 측에서 일상생활 고민 상황에도 꾸준히 보임.</p>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="bg-[#FFF8E6] p-4 rounded-lg">
                <p className="text-sm mb-4">사람이 많은 곳에 가면 너무 불편해요</p>
                <p className="text-sm mb-4">혼자 있을 때 그냥 여유롭고 편해요. 하루가 어떻게 지나가는지도 모르겠고요</p>
                <p className="text-sm">일은 하고 싶긴 한데... 무섭기도 해요. 나 같은 사람이 할 수 있을지 모르겠어요</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">상담자의 주요 개입 내용</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm">정서적 지지 및 공감 제공 (비난 없는 환경 조성)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm">경제활동을 준비를 위한 단계적 접근 방법 안내</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm">지역 내 경제활동을 연계 프로그램 안내 및 참여 권유</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm">자기 효능감 회복을 위한 긍정 경험 회상 유도</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">특이사항 / 메모</h3>
              <div className="bg-[#FFF8E6] p-4 rounded-lg mb-4">
                <p className="text-sm">
                  면접에 실패를 원인적으로 분석하여, 이번 상담에서는 비교적 적극적으로 표현한 모습이 있음. 상담자와의
                  관계 형성에 걸쳐 회복되다는 개인 자원의 관점에서 접근 필요.
                </p>
                <p className="text-sm">향후 비대면 형태의 직업 재활/상담 프로그램 우선 연결</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">다음 상담 계획</h3>
              <div className="space-y-2">
                <p className="text-sm">2025. 05. 01(목) 오전 10시</p>
                <p className="text-sm">과제 수행 확인 및 피드백</p>
                <p className="text-sm">경제활동 연계 기관 소개 및 정보 전달</p>
                <p className="text-sm">자립 여정 시간화(이정표 만들기) 워크시트 적용 시도</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="lg">
          임시 저장
        </Button>
        <Button variant="primary" size="lg">
          상담일지 작성 완료
        </Button>
      </div>
    </div>
  )
}
