"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DiaryProps {
  id: number;
  date: string;
  image?: string;
  content: string;
  bookmarked?: boolean;
}

interface DiaryCardProps {
  diary: DiaryProps;
}

export function DiaryCard({ diary }: DiaryCardProps) {
  const formatDate = (dateStr: string) => {
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split(".");
    if (parts.length === 2) return `2025.${parts[0]}.${parts[1]}`;
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(now.getDate()).padStart(2, "0")}`;
  };

  const hasImage = diary.image && diary.image !== "./placeholder.svg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <Link
          href={`/diary/${diary.id}`}
          className="absolute inset-0 z-10"
          aria-label={`${diary.date}에 작성한 일기 보기`}
        />
        <Card className="overflow-hidden border-none shadow-lg relative z-0">
          {hasImage ? (
            <div className="relative aspect-[3/2]">
              <Image
                src={diary.image as string}
                alt="일기 이미지"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <div className="flex items-center text-white">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span className="text-base font-light tracking-wide">
                    {formatDate(diary.date)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 pb-0">
              <div className="flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span className="text-base font-light tracking-wide">
                  {formatDate(diary.date)}
                </span>
              </div>
            </div>
          )}

          <CardContent className="p-4">
            <p className="text-sm leading-relaxed line-clamp-2 text-gray-700">
              {diary.content}
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
