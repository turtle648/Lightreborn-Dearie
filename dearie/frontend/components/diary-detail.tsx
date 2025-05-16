"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { EMOTION_MAP } from "@/constants/emotions";

interface DiaryDetailProps {
  id: string;
}

interface DiaryDetailData {
  content: string;
  createTime: string;
  images: string[];
  emotionTag: string;
  aiComment: string;
  isBookmarked: boolean;
}

export function DiaryDetail({ id }: DiaryDetailProps) {
  const [diary, setDiary] = useState<DiaryDetailData | null>(null);
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchDiaryDetail = async () => {
      try {
        console.log("일기 데이터 가져오기 시작");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/diaries/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("일기 데이터 전체 응답:", data);
        console.log("일기 데이터 result:", data.result);
        console.log("북마크 필드 이름과 값 체크:");

        // data.result의 모든 필드 출력
        if (data.result) {
          Object.keys(data.result).forEach((key) => {
            console.log(`${key}: ${data.result[key]}`);
          });
        }

        if (res.ok) {
          setDiary(data.result);
          // isBookmarked가 있는지 확인하고 타입 체크
          if ("isBookmarked" in data.result) {
            console.log("isBookmarked 타입:", typeof data.result.isBookmarked);
            console.log("isBookmarked 값:", data.result.isBookmarked);
            // Boolean으로 명시적 변환
            setSaved(Boolean(data.result.isBookmarked));
          } else {
            console.log(
              "isBookmarked 필드가 없습니다. 대체 필드를 찾아봅니다."
            );
            // bookmarked나 다른 비슷한 필드 찾기
            const bookmarkField = Object.keys(data.result).find((key) =>
              key.toLowerCase().includes("bookmark")
            );
            if (bookmarkField) {
              console.log(
                `대체 필드 발견: ${bookmarkField}:`,
                data.result[bookmarkField]
              );
              setSaved(Boolean(data.result[bookmarkField]));
            } else {
              console.log("북마크 관련 필드를 찾을 수 없습니다.");
            }
          }
        } else {
          alert(data.message || "일기 불러오기 실패");
        }
      } catch (e) {
        console.error("일기 데이터 가져오기 오류:", e);
        alert("에러 발생: " + e);
      }
    };

    fetchDiaryDetail();
  }, [id]);

  if (!diary) return null;

  const { emoji, name } = EMOTION_MAP[diary.emotionTag] || {
    emoji: "❓",
    name: "알 수 없음",
  };

  const toggleBookmark = async () => {
    const method = saved ? "DELETE" : "POST";
    console.log("북마크 토글 시작, 현재 상태:", saved);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/diaries/${id}/bookmark`,
        {
          method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      console.log("북마크 API 응답:", data);

      if (res.ok) {
        // 북마크 상태 변경 후 최신 데이터 다시 불러오기
        const diaryRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/diaries/${id}`,
          {
            credentials: "include",
          }
        );
        const diaryData = await diaryRes.json();
        console.log("다시 가져온 일기 데이터:", diaryData);

        if (diaryRes.ok) {
          setDiary(diaryData.result);
          setSaved(diaryData.result.isBookmarked);
          console.log("업데이트된 북마크 상태:", diaryData.result.isBookmarked);
        }

        alert(data.message || "북마크 변경됨");
      } else {
        alert(data.message || "북마크 처리 실패");
      }
    } catch (e) {
      console.error("북마크 토글 오류:", e);
      alert("에러 발생: " + e);
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-2xl p-6 shadow-xl mb-6"
      >
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold">
              {new Date(diary.createTime).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                weekday: "short",
              })}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBookmark}
              className="rounded-full"
            >
              <Bookmark
                className={`h-5 w-5 ${
                  saved ? "fill-primary text-primary" : ""
                }`}
              />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 rounded-full"
            >
              {emoji} {name}
            </Badge>
          </div>
        </div>

        <div className="whitespace-pre-line text-gray-800 leading-relaxed mb-6">
          {diary.content}
        </div>

        {diary.images.length > 0 && (
          <div className="my-6">
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
              <Image
                src={diary.images[currentImageIndex] || "/placeholder.svg"}
                alt={`일기 이미지 ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
              {diary.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setCurrentImageIndex((i) =>
                        i === 0 ? diary.images.length - 1 : i - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full h-8 w-8"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setCurrentImageIndex((i) =>
                        i === diary.images.length - 1 ? 0 : i + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full h-8 w-8"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
            {diary.images.length > 1 && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                {currentImageIndex + 1} / {diary.images.length}
              </div>
            )}
          </div>
        )}

        <hr className="my-6 border-gray-200" />

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2 text-primary">
            따뜻한 한마디
          </h3>
          <p className="text-gray-700 leading-relaxed">{diary.aiComment}</p>
        </div>
      </motion.div>
    </div>
  );
}
