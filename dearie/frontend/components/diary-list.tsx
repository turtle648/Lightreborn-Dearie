"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { EMOTION_MAP } from "@/constants/emotions";

interface DiaryItem {
  diaryId: number;
  date: string;
  content: string;
  images: string[];
  bookmarked?: boolean;
  emotionTag: string;
}

export function DiaryList() {
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/diaries`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setDiaries(data.result.result); // `result.result`에 실제 리스트 있음
        } else {
          alert("일기 불러오기 실패: " + data.message);
        }
      } catch (err) {
        alert("에러 발생: " + err);
      }
    };

    fetchDiaries();
  }, []);

  return (
    <div className="space-y-5">
      {diaries.map((diary, index) => (
        <motion.div
          key={diary.diaryId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -5 }}
        >
          <Link href={`/diary/${diary.diaryId}`}>
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-0">
                <div className="flex relative">
                  <div className="flex-1 p-4">
                    <h3 className="font-medium mb-1">
                      {new Date(diary.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        weekday: "short",
                      })}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {diary.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <span className="mr-1">
                          {EMOTION_MAP[diary.emotionTag]?.emoji}
                        </span>
                        <span>{EMOTION_MAP[diary.emotionTag]?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    {diary.images?.[0] && (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={diary.images[0]}
                          alt="일기 이미지"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {diary.bookmarked && (
                      <div className="flex items-center justify-end text-xs text-primary px-2 py-1 mr-2">
                        <Bookmark className="h-3 w-3 mr-1 fill-primary" />
                        <span>저장됨</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
