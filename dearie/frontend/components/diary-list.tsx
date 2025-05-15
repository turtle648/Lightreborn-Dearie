"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export function DiaryList() {
  // 샘플 데이터
  const diaries = [
    {
      id: 1,
      date: "2025/04/23 (화)",
      content:
        "오늘은 눈을 뜨는 것조차 힘들었다. 무언가 해야 할 일이 분명히 있었던 것 같은데, 머릿속은 안개처럼 뿌옇고, 손끝 하나 움직이는 싫었다.",
      emotion: "슬픔",
      image: "/images/window-view.png",
      bookmarked: true,
    },
    {
      id: 2,
      date: "2025/04/22 (월)",
      content:
        "카페 창밖으로 노을이 지는 모습을 바라보며 오랜만에 마음의 여유를 느꼈다. 따뜻한 차 한잔과 함께하는 시간이 소중하게 느껴졌다.",
      emotion: "평온",
      image: "/images/window-view-2.png",
      bookmarked: false,
    },
    {
      id: 3,
      date: "2025/04/21 (일)",
      content:
        "오랜만에 친구들과 만나 웃고 떠들었다. 일상의 소소한 이야기들이 이렇게 즐거울 수 있다는 것을 새삼 느꼈다.",
      emotion: "기쁨",
      image: "/backyard-friendship.png",
      bookmarked: false,
    },
  ];

  return (
    <div className="space-y-5">
      {diaries.map((diary, index) => (
        <motion.div
          key={diary.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -5 }}
        >
          <Link href={`/diary/${diary.id}`}>
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-0">
                <div className="flex relative">
                  <div className="flex-1 p-4">
                    <h3 className="font-medium mb-1">{diary.date}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {diary.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <Smile className="h-3 w-3 mr-1 text-primary" />
                        <span>{diary.emotion}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    {diary.image && (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={diary.image || "/placeholder.svg"}
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
