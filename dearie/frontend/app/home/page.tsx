"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Bell } from "@/components/ui/bell";
import { ROUTES } from "@/constants/routes";
import { DailyMission } from "@/components/daily-mission";
import { DiaryCard } from "@/components/diary-card";
import axios from "axios";

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
  const [diaries, setDiaries] = useState<Diary[]>([]);

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
  ];

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
            <Link href={ROUTES.MISSION.LIST}>
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
          <div className="space-y-3">
            {missions.map((mission) => (
              <DailyMission key={mission.id} mission={mission} />
            ))}
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
