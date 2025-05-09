"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const emotions = [
  "행복", "기쁨", "설렘", "평온", "감사",
  "슬픔", "우울", "불안", "화남", "짜증",
  "피곤", "지침", "걱정", "걱정", "걱정"
]

interface EmotionSelectorProps {
  onSelect: (emotion: string) => void
  onClose: () => void
}

export function EmotionSelector({ onSelect, onClose }: EmotionSelectorProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 id="emotion-selector-title" className="text-lg font-semibold">오늘의 감정</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="닫기">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {emotions.map((emotion) => (
          <Button
            key={emotion}
            variant="outline"
            className="h-10"
            onClick={() => onSelect(emotion)}
          >
            {emotion}
          </Button>
        ))}
      </div>
    </div>
  )
} 