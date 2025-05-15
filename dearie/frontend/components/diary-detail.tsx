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
}

export function DiaryDetail({ id }: DiaryDetailProps) {
  const [diary, setDiary] = useState<DiaryDetailData | null>(null);
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchDiaryDetail = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/diaries/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setDiary(data.result);
        } else {
          alert(data.message || "일기 불러오기 실패");
        }
      } catch (e) {
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
              onClick={() => setSaved(!saved)}
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
