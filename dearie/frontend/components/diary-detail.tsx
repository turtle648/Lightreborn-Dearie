"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface DiaryDetailProps {
  id: string;
}

export function DiaryDetail({ id }: DiaryDetailProps) {
  // 여러 개의 샘플 데이터를 정의하고 ID에 따라 다른 데이터를 표시
  const diaries = [
    {
      id: 1,
      date: "2025 / 04 / 23 (화)",
      content: `오늘은 눈을 뜨는 것조차 힘들었다. 무언가 해야 할 일이 분명히 있었던 것 같은데, 머릿속은 안개처럼 뿌옇고, 손끝 하나 움직이는 싫었다. 

하지만 창문 밖으로 들어오는 햇살이 내 얼굴을 비추자 조금씩 마음이 움직이기 시작했다. 오랜만에 창가에 앉아 따뜻한 차 한 잔을 마시며 바깥 풍경을 바라보았다. 

시간은 느리게 흘러갔지만, 그 느림이 오히려 나에게 위안이 되었다. 아무것도 하지 않아도 괜찮다는 생각이 들었다. 오늘 하루는 그저 나를 위한 시간으로 채워도 충분하다.`,
      images: [
        "/images/window-view.png",
        "/images/window-view-2.png",
        "/backyard-friendship.png",
      ],
      emotion: "슬픔",
      analysis: {
        comment:
          "힘든 하루였지만 작은 빛을 발견하셨네요. 자신을 위한 시간을 가지는 것은 매우 중요합니다. 창밖의 햇살처럼, 작은 위안이 당신의 마음에 따뜻함을 가져다 주길 바랍니다.",
      },
    },
    {
      id: 2,
      date: "2025 / 04 / 22 (월)",
      content: `카페 창밖으로 노을이 지는 모습을 바라보며 오랜만에 마음의 여유를 느꼈다. 따뜻한 차 한잔과 함께하는 시간이 소중하게 느껴졌다.

사람들의 발걸음, 창밖으로 지나가는 차들, 멀리서 들려오는 음악 소리. 모든 것이 한 폭의 그림처럼 느껴졌다. 

일상의 작은 순간들이 이렇게 특별하게 느껴질 수 있다는 것이 신기했다. 오늘은 그저 이 순간을 온전히 즐기기로 했다.`,
      images: ["/images/window-view-2.png", "/warm-cafe-corner.png"],
      emotion: "평온",
      analysis: {
        comment:
          "일상 속에서 여유를 찾는 모습이 보기 좋네요. 바쁜 일상 속에서도 이렇게 자신만의 시간을 가지는 것은 정신 건강에 매우 중요합니다. 앞으로도 이런 순간들을 자주 만들어보세요.",
      },
    },
    {
      id: 3,
      date: "2025 / 04 / 21 (일)",
      content: `오랜만에 친구들과 만나 웃고 떠들었다. 일상의 소소한 이야기들이 이렇게 즐거울 수 있다는 것을 새삼 느꼈다.

함께 공원을 산책하고, 맛있는 음식을 나누어 먹으며 시간 가는 줄 몰랐다. 친구들의 웃음소리가 마음을 따뜻하게 해주었다.

사람들과의 연결이 주는 기쁨을 오랜만에 느꼈다. 이런 시간이 더 많았으면 좋겠다.`,
      images: [
        "/backyard-friendship.png",
        "/diverse-professional-profiles.png",
      ],
      emotion: "기쁨",
      analysis: {
        comment:
          "사회적 연결은 우리의 행복에 큰 영향을 미칩니다. 친구들과 함께한 시간이 당신에게 긍정적인 에너지를 준 것 같네요. 이런 만남을 정기적으로 가지면 정서적 건강에 도움이 될 거예요.",
      },
    },
  ];

  // ID에 따라 해당하는 일기 데이터 찾기
  const diary = diaries.find((d) => d.id === Number.parseInt(id)) || diaries[0];

  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSave = () => {
    setSaved(!saved);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === diary.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? diary.images.length - 1 : prevIndex - 1
    );
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
            <h1 className="text-xl font-bold">{diary.date}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
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
              {diary.emotion}
            </Badge>
          </div>
        </div>

        <div className="whitespace-pre-line">
          <p className="text-gray-800 leading-relaxed mb-6">{diary.content}</p>

          {diary.images && diary.images.length > 0 && (
            <div className="my-6">
              <div className="relative rounded-lg overflow-hidden">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={diary.images[currentImageIndex] || "/placeholder.svg"}
                    alt={`일기 이미지 ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {diary.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full h-8 w-8"
                      aria-label="이전 이미지"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full h-8 w-8"
                      aria-label="다음 이미지"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>

                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                      {diary.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 rounded-full ${
                            index === currentImageIndex
                              ? "w-4 bg-primary"
                              : "w-2 bg-white/70"
                          }`}
                          aria-label={`이미지 ${index + 1}로 이동`}
                        />
                      ))}
                    </div>
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
            <p className="text-gray-700 leading-relaxed">
              {diary.analysis.comment}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
