"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, ImageIcon, Smile, Send, Save } from "lucide-react"
import { EmotionSelector } from "@/components/feature/diary/emotion-selector"
import { motion } from "framer-motion"
import { useDiaryStore } from "@/stores/diary-store"
import { formatDate } from "@/utils/format-date"
import { APP_CONFIG } from "@/constants/app-config"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ROUTES } from "@/constants/routes"

export function DiaryForm() {
  const router = useRouter()
  const { createDiary, isLoading, error } = useDiaryStore()
  const [content, setContent] = useState("")
  const [showEmotionSelector, setShowEmotionSelector] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draftKey] = useState(`diary_draft_${Date.now()}`)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 로컬 스토리지에서 임시 저장된 내용 불러오기
  const { value: savedDraft, setValue: setSavedDraft } = useLocalStorage<string>(draftKey, "")

  // 컴포넌트 마운트 시 임시 저장된 내용 불러오기
  useEffect(() => {
    if (savedDraft) {
      setContent(savedDraft)
    }
  }, [savedDraft])

  // 자동 저장 기능
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (content && content !== savedDraft) {
        setSavedDraft(content)
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1500)
      }
    }, APP_CONFIG.diary.autosaveInterval)

    return () => clearInterval(autosaveInterval)
  }, [content, savedDraft, setSavedDraft])

  // 텍스트 영역 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  const handleSubmit = async () => {
    if (!content.trim() || content.length < APP_CONFIG.diary.minLength) return
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      await createDiary({
        content,
        emotion: selectedEmotion || undefined,
        image: "/images/window-view.png", // 실제 구현에서는 업로드된 이미지 URL
        likes: 0,
        comments: 0,
      })

      // 임시 저장 내용 삭제
      setSavedDraft("")

      // 일기 목록 페이지로 이동
      router.push(ROUTES.DIARY.LIST)
    } catch (error) {
      console.error("일기 저장 중 오류 발생:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion)
    setShowEmotionSelector(false)
  }

  const handleManualSave = () => {
    if (content) {
      setSavedDraft(content)
      setIsSaving(true)
      setTimeout(() => setIsSaving(false), 1500)
    }
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <div className="text-sm text-gray-500 mb-2" aria-label="오늘 날짜">
          {formatDate(new Date(), "full")}
        </div>

        {selectedEmotion && (
          <div className="flex items-center mb-2">
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary/20 bg-primary/5 rounded-full"
              onClick={() => setShowEmotionSelector(true)}
              aria-label={`선택된 감정: ${selectedEmotion}, 클릭하여 변경`}
            >
              <Smile className="h-4 w-4 mr-1" aria-hidden="true" />
              {selectedEmotion}
            </Button>
          </div>
        )}

        {isSaving && <div className="text-xs text-gray-500 animate-fade-in">임시 저장 중...</div>}

        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 glass-effect rounded-2xl p-4 shadow-md"
      >
        <Textarea
          ref={textareaRef}
          placeholder="오늘의 이야기를 자유롭게 적어보세요..."
          className="w-full h-full min-h-[200px] resize-none border-none focus-visible:ring-0 text-base bg-transparent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={APP_CONFIG.diary.maxLength}
          aria-label="일기 내용"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="사진 촬영하기">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" aria-label="이미지 추가하기">
              <ImageIcon className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEmotionSelector(true)}
              className="rounded-full"
              aria-label="감정 선택하기"
            >
              <Smile className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleManualSave}
              className="rounded-full"
              aria-label="임시 저장하기"
            >
              <Save className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || content.length < APP_CONFIG.diary.minLength || isSubmitting || isLoading}
            className="gap-1 rounded-full bg-gradient-soft shadow-md shadow-primary/20"
            aria-label="일기 저장하기"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            저장하기
          </Button>
        </div>

        {content.length > 0 && (
          <div className="text-xs text-right mt-2 text-gray-500">
            {content.length} / {APP_CONFIG.diary.maxLength} 자
            {content.length < APP_CONFIG.diary.minLength && (
              <span className="text-amber-500 ml-2">최소 {APP_CONFIG.diary.minLength}자 이상 작성해주세요</span>
            )}
          </div>
        )}
      </motion.div>

      {showEmotionSelector && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="emotion-selector-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-5">
                <EmotionSelector onSelect={handleEmotionSelect} onClose={() => setShowEmotionSelector(false)} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  )
}
