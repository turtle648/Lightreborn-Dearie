"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EMOTION_MAP } from "@/constants/emotions";

interface DiaryItem {
  diaryId: number;
  content: string;
  date: string;
  images: string[];
  emotionTag: string;
  isBookmarked: boolean;
}

interface DiaryListProps {
  searchQuery: string;
  sortOrder: "latest" | "oldest";
  bookmarkedOnly: boolean;
}

export function DiaryList({
  searchQuery,
  sortOrder,
  bookmarkedOnly,
}: DiaryListProps) {
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diaries`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          if (
            data.result &&
            data.result.result &&
            Array.isArray(data.result.result)
          ) {
            setDiaries(data.result.result);
          } else {
            setDiaries([]);
          }
        } else {
          alert(data.message || "일기 목록 불러오기 실패");
          setDiaries([]);
        }
      } catch (e) {
        alert("에러 발생: " + e);
        setDiaries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const filteredDiaries = Array.isArray(diaries)
    ? diaries
        .filter((diary) => {
          const contentMatch = diary.content
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const bookmarkMatch = bookmarkedOnly ? diary.isBookmarked : true;
          return contentMatch && bookmarkMatch;
        })
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
        })
    : [];

  if (loading) {
    return (
      <div className="space-y-6 no-scrollbar">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-effect rounded-2xl p-4 shadow-md animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredDiaries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">일기가 없습니다</h3>
        <p className="text-gray-500 mb-6">
          {searchQuery
            ? "검색 조건에 맞는 일기가 없습니다."
            : bookmarkedOnly
            ? "북마크한 일기가 없습니다."
            : "첫 번째 일기를 작성해보세요."}
        </p>
        <Link href="/diary/new">
          <Button>일기 작성하기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 no-scrollbar">
      <AnimatePresence>
        {filteredDiaries.map((diary) => {
          const emotion = EMOTION_MAP[diary.emotionTag];
          const thumbnail = diary.images?.[0];

          return (
            <motion.div
              key={diary.diaryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/diary/${diary.diaryId}`} className="block">
                <Card>
                  <CardContent className="p-4">
                    {/* 날짜 표시 */}
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {new Date(diary.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        weekday: "short",
                      })}
                    </div>

                    {/* 본문 + 이미지 */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <p className="text-gray-700 line-clamp-3">
                          {diary.content}
                        </p>
                      </div>
                      {thumbnail && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={thumbnail}
                            alt="일기 이미지"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {/* ✅ 하단 감정 + 북마크 */}
                  <CardFooter className="px-4 py-2 flex justify-between items-center">
                    {emotion && (
                      <div className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        <span className="mr-1">{emotion.emoji}</span>
                        <span>{emotion.name}</span>
                      </div>
                    )}
                    {diary.isBookmarked && (
                      <div className="h-6 w-6 rounded-full text-primary bg-primary/10 flex items-center justify-center">
                        <Bookmark className="h-3 w-3 fill-primary" />
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
