"use client";

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { LoadingSpinner } from "@/components/common/loading-spinner"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Bell } from "@/components/ui/bell"
import Link from "next/link"
import Image from "next/image"
import { ROUTES } from "@/constants/routes"

// 동적 임포트로 코드 스플리팅 적용
const DailyMission = dynamic(() => import("@/components/feature/mission/daily-mission"), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: true,
})

const DiaryCard = dynamic(() => import("@/components/feature/diary/diary-card"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: true,
})

export default function HomePage() {
  // 샘플 데이터
  const missions = [
    {
      id: 1,
      title: "오늘의 추천 미션",
      description: "창문 밖 풍경을 5분간 바라보며 깊게 호흡하기",
      difficulty: "쉬움",
      category: "마음챙김",
    },
    {
      id: 2,
      title: "감정 표현하기",
      description: "오늘 느낀 감정을 3가지 단어로 표현해보기",
      difficulty: "보통",
      category: "감정인식",
    },
  ]

  const diaries = [
    {
      id: 1,
      date: "04.25",
      image: "/images/window-view.png",
      content:
        "오늘은 눈을 뜨는 것조차 힘들었다. 무언가 해야 할 일이 분명히 있었던 것 같은데, 머릿속은 안개처럼 뿌옇고, 손끝 하나 움직이는 싫었다.",
      likes: 5,
      comments: 2,
    },
    {
      id: 2,
      date: "04.24",
      image: "/images/window-view-2.png",
      content:
        "카페 창밖으로 노을이 지는 모습을 바라보며 오랜만에 마음의 여유를 느꼈다. 따뜻한 차 한잔과 함께하는 시간이 소중하게 느껴졌다.",
      likes: 12,
      comments: 4,
    },
  ]

  return (
    <AppLayout hideHeader>
      <div className="pb-6">
        {/* 창문 이미지 섹션 */}
        <div className="relative">
          {/* 창문 이미지 */}
          <div className="relative w-full h-[380px]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250425_1733_Dreamy%20Nightscape%20Window_simple_compose_01jsp18g00exzbpq55scs9jzxp.gif-DAdACtaeA0aD7pHJe1Esv8AM3KrYQU.jpeg"
              alt="밤 창문 풍경"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />

            {/* 헤더 영역 */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Dearie</h1>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                aria-label="알림"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            {/* 인사말 텍스트 */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="relative">
                {/* 그라데이션 오버레이 */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

                {/* 텍스트 */}
                <div className="relative px-6 pb-6 pt-20">
                  <h2 className="text-3xl font-bold text-gray-800">안녕하세요,</h2>
                  <p className="text-2xl font-medium text-gray-600 mt-1">오늘 하루는 어떠셨나요?</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">오늘의 미션</h2>
            <Link href={ROUTES.MISSION.LIST} aria-label="미션 더보기">
              <Button variant="ghost" size="sm" className="text-gray-500 gap-1 p-0">
                더보기
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            <Suspense fallback={<LoadingSpinner />}>
              {missions.map((mission) => (
                <DailyMission key={mission.id} mission={mission} />
              ))}
            </Suspense>
          </div>
        </div>

        <div className="px-6 mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">최근 일기</h2>
            <Link href={ROUTES.DIARY.LIST} aria-label="일기 더보기">
              <Button variant="ghost" size="sm" className="text-gray-500 gap-1 p-0">
                더보기
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
          <div className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              {diaries.map((diary) => (
                <DiaryCard key={diary.id} diary={diary} />
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
