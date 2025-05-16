"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DiaryProps {
  id: number;
  date: string;
  image: string;
  content: string;
  bookmarked?: boolean;
}

interface DiaryCardProps {
  diary: DiaryProps;
}

export function DiaryCard({ diary }: DiaryCardProps) {
  const [saved, setSaved] = useState(diary.bookmarked || false);

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden border-none shadow-lg relative">
        <Link
          href={`/diary/${diary.id}`}
          aria-label={`${diary.date}에 작성한 일기 보기`}
        >
          <div className="relative aspect-[3/2]">
            <Image
              src={diary.image || "/placeholder.svg"}
              alt="일기 이미지"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage
                    src="/mystical-forest-spirit.png"
                    alt="사용자 아바타"
                  />
                  <AvatarFallback>나</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    나의 일기
                  </span>
                  <span className="text-xs text-white/80">{diary.date}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full shadow-sm"
          >
            <Bookmark
              className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        </div> */}

        <CardContent className="p-4">
          <p className="text-sm line-clamp-2">{diary.content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
