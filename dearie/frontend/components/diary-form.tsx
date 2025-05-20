"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ImageIcon, Smile, Send, X } from "lucide-react";
import { EmotionSelector } from "./emotion-selector";
import { motion } from "framer-motion";
import { EMOTION_MAP } from "@/constants/emotions";
import Image from "next/image";
import { analyzeReport } from "@/apis/report-api";
import { startOfWeek, format } from "date-fns";

export function DiaryForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [showEmotionSelector, setShowEmotionSelector] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<
    Array<{ id: string; file: File; url: string }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 갤러리에서 이미지 선택 함수 수정
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newImages = Array.from(event.target.files).map((file) => ({
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        url: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // 카메라로 사진 촬영 함수
  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newImages = Array.from(event.target.files).map((file) => ({
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        url: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // 갤러리 열기 함수
  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 카메라 열기 함수
  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // 이미지 제거 함수
  const handleRemoveImage = (id: string) => {
    // 삭제할 이미지 찾기
    const imageToRemove = images.find((img) => img.id === id);

    // URL 해제
    if (imageToRemove && imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // 이미지 배열에서 제거
    setImages(images.filter((img) => img.id !== id));
  };

  // 컴포넌트 언마운트 시 URL.createObjectURL로 생성된 객체 URL 해제
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);

  // 제출하기
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

    images.forEach((img) => {
      formData.append("images", img.file);
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

      // === 일기 저장 성공 후 주간 리포트 생성 ===
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId && !isNaN(Number(storedUserId))) {
        const userId = Number(storedUserId);
        const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekStartDate = format(monday, "yyyy-MM-dd");
        await analyzeReport(userId, weekStartDate);
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
    <div className="pt-6 px-6 pb-1 h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2"
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
          <div className="flex items-center mb-1">
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary/20 bg-primary/5 rounded-full"
              onClick={() => setShowEmotionSelector(true)}
            >
              {EMOTION_MAP[selectedEmotion]?.emoji}{" "}
              {EMOTION_MAP[selectedEmotion]?.name}
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 glass-effect rounded-2xl p-4 shadow-md flex flex-col"
      >
        <Textarea
          placeholder="오늘의 이야기를 자유롭게 적어보세요..."
          className="w-full flex-1 resize-none border-none focus-visible:ring-0 text-base bg-transparent p-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </motion.div>

      {/* 이미지 미리보기 영역을 일기 입력칸과 버튼들 사이로 이동 */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 mb-4 p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm"
        >
          <div className="relative">
            <div className="flex overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative min-w-[90px] h-[90px] mr-2 rounded-lg overflow-hidden flex-shrink-0 snap-start"
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt="첨부 이미지"
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 rounded-full p-1"
                    onClick={() => handleRemoveImage(image.id)}
                    aria-label="이미지 삭제"
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              ))}
            </div>

            {/* 이미지 개수 표시 */}
            {images.length > 1 && (
              <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-tl-md rounded-br-md">
                {images.length}장
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 파일 입력 요소 - 카메라와 갤러리 입력을 분리 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
        multiple
      />
      <input
        type="file"
        ref={cameraInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleCameraCapture}
        capture="environment"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4 mb-1"
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={openCamera}
              aria-label="카메라로 사진 촬영"
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={openGallery}
              aria-label="갤러리에서 이미지 선택"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEmotionSelector(true)}
              className="rounded-full"
              aria-label="감정 선택하기"
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
