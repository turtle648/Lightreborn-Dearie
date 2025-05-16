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
import { getDailyMissions } from "@/apis/mission-api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { MissionItem } from "@/components/feature/mission/mission-item"
import { useMissionStore } from "@/stores/mission-store"
import axios from "axios";

// 동적 임포트로 코드 스플리팅 적용
const DailyMission = dynamic(() => import("@/components/feature/mission/daily-mission"), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: true,
})

const DiaryCard = dynamic(() => import("@/components/feature/diary/diary-card"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: true,
})

// Diary 타입
interface Diary {
  diaryId: number;
  content: string;
  createTime: string;
  images: string[];
  bookmarked: boolean;
}

// 날짜 변환 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(
      date.getDate()
  ).padStart(2, "0")}`;
};

export default function HomePage() {
  const router = useRouter()
  const { preview, loading, error, fetchDaily } = useMissionStore()
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    fetchDaily(2)
  }, [fetchDaily])

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/diaries`,
            {
              params: {
                sort: "latest",
                keyword: "",
                bookmark: false,
                page: 0,
                size: 2,
              },
              withCredentials: true,
            }
        );

        console.log("✅ 다이어리 API 응답", res.data);

        // 구조 확인 후 반영
        const fetched = res.data.result.result ?? [];
        setDiaries(fetched);
      } catch (err) {
        console.error("❌ 일기 불러오기 실패:", err);
      }
    };

    fetchDiaries();
  }, []);

  return (
    <AppLayout hideHeader>
      <div className="pb-6">
        {/* 배경 이미지 */}
        <div className="relative w-full h-[380px]">
          <Image
            src="./images/night-window.gif"
            alt="밤 창문 풍경"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Dearie
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
              aria-label="알림"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          {/* 인사말 */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
            <div className="relative px-6 pb-6 pt-20">
              <h2 className="text-3xl font-bold text-gray-800">안녕하세요,</h2>
              <p className="text-2xl font-medium text-gray-600 mt-1">
                오늘 하루는 어떠셨나요?
              </p>
            </div>
          </div>
        </div>

        {/* 오늘의 미션 */}
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
              {loading && <LoadingSpinner />}
              {error && <div className="text-red-500">{error}</div>}
              {!loading && !error &&
                preview.map(mission => (
                  <MissionItem key={mission.id} mission={mission} />
                ))
              }
            </Suspense>
          </div>
        </div>

        {/* 최근 일기 */}
        <div className="px-6 mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">최근 일기</h2>
            <Link href={ROUTES.DIARY.LIST}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 gap-1 p-0"
              >
                더보기
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-6">
            {diaries.map((diary) => (
              <DiaryCard
                key={diary.diaryId}
                diary={{
                  id: diary.diaryId,
                  date: formatDate(diary.createTime),
                  image: diary.images[0] || "./placeholder.svg",
                  content: diary.content,
                  bookmarked: diary.bookmarked,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
