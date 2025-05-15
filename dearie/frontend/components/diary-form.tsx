"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ImageIcon, Smile, Send } from "lucide-react";
import { EmotionSelector } from "./emotion-selector";
import { motion } from "framer-motion";

// export const emotionOptions = [
//   { label: "😊 기쁨", value: "JOY" },
//   { label: "😢 슬픔", value: "SADNESS" },
//   { label: "😠 화남", value: "ANGER" },
//   { label: "😰 불안", value: "ANXIETY" },
//   { label: "😌 평온", value: "NEUTRAL" },
//   { label: "😑 지루함", value: "BOREDOM" },
//   { label: "😍 설렘", value: "EXCITEMENT" },
//   { label: "🙏 감사", value: "GRATITUDE" },
//   { label: "😲 놀람", value: "SURPRISE" },
//   { label: "😵 혼란", value: "CONFUSION" },
//   { label: "🌈 희망", value: "HOPE" },
//   { label: "😴 피곤", value: "FATIGUE" },
// ];

export function DiaryForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [showEmotionSelector, setShowEmotionSelector] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(Array.from(files));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !selectedEmotion) {
      alert("내용과 감정을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    const diaryData = {
      content,
      emotionTag: selectedEmotion,
    };

    formData.append(
      "diary",
      new Blob([JSON.stringify(diaryData)], { type: "application/json" })
    );

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/diaries`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "일기 작성 실패");
      }

      router.push("/diary");
    } catch (err: any) {
      alert("에러 발생: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShowEmotionSelector(false);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <div className="text-sm text-gray-500 mb-2">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "short",
          })}
        </div>

        {selectedEmotion && (
          <div className="flex items-center mb-2">
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary/20 bg-primary/5 rounded-full"
              onClick={() => setShowEmotionSelector(true)}
            >
              <Smile className="h-4 w-4 mr-1" />
              {selectedEmotion}
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 glass-effect rounded-2xl p-4 shadow-md"
      >
        <Textarea
          placeholder="오늘의 이야기를 자유롭게 적어보세요..."
          className="w-full h-full min-h-[200px] resize-none border-none focus-visible:ring-0 text-base bg-transparent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt={`image-${i}`}
                className="w-20 h-20 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleImageClick}
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEmotionSelector(true)}
              className="rounded-full"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="gap-1 rounded-full bg-gradient-soft shadow-md shadow-primary/20"
          >
            <Send className="h-4 w-4" />
            저장하기
          </Button>
        </div>
      </motion.div>

      {/* 이미지 업로드용 숨겨진 input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        multiple
        hidden
      />

      {showEmotionSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-5">
                <EmotionSelector
                  onSelect={handleEmotionSelect}
                  onClose={() => setShowEmotionSelector(false)}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
