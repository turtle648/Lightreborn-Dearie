"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface EmotionSelectorProps {
  onSelect: (emotion: string) => void;
  onClose: () => void;
}

export function EmotionSelector({ onSelect, onClose }: EmotionSelectorProps) {
  const emotions = [
    { name: "JOY", label: "기쁨", emoji: "😊" },
    { name: "SADNESS", label: "슬픔", emoji: "😢" },
    { name: "ANGER", label: "화남", emoji: "😠" },
    { name: "ANXIETY", label: "불안", emoji: "😰" },
    { name: "NEUTRAL", label: "평온", emoji: "😌" },
    { name: "BOREDOM", label: "지루함", emoji: "😑" },
    { name: "EXCITEMENT", label: "설렘", emoji: "😍" },
    { name: "GRATITUDE", label: "감사", emoji: "🙏" },
    { name: "SURPRISE", label: "놀람", emoji: "😲" },
    { name: "CONFUSION", label: "혼란", emoji: "😵" },
    { name: "HOPE", label: "희망", emoji: "🌈" },
    { name: "FATIGUE", label: "피곤", emoji: "😴" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-medium text-lg">오늘의 감정을 선택해주세요</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {emotions.map((emotion, index) => (
          <motion.div
            key={emotion.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
          >
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 hover:bg-primary/5 hover:text-primary hover:border-primary/20 rounded-xl w-full"
              onClick={() => onSelect(emotion.name)} // ✅ Enum value 전송
            >
              <span className="text-2xl mb-1">{emotion.emoji}</span>
              <span className="text-xs">{emotion.label}</span>{" "}
              {/* ✅ 한글 UI */}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
