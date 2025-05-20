"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ClipboardList } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { fetchReportSummary, type ReportSummaryResponse } from "@/apis/report-api"
import { format } from "date-fns"

// 감정별 이모지 매핑
const emotionEmojis: { [key: string]: string } = {
  기쁨: "😊",
  슬픔: "😢",
  분노: "😠",
  불안: "😰",
  평온: "😌",
}

const emotionOrder = ["기쁨", "슬픔", "분노", "불안", "평온"]

export function WeeklyReportPreview() {
  const [data, setData] = useState<ReportSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const userId = 1
        const currentDate = format(new Date(), "yyyy-MM-dd")
        const result = await fetchReportSummary(userId, currentDate)
        setData(result)
        setError(null)
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setError("아직 리포트가 없습니다.")
        } else {
          setError("데이터를 불러오는데 실패했습니다.")
        }
        console.error("Failed to fetch report summary:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // 감정 높이 계산 함수 수정
  function getEmotionHeight(emotion: string, score: number) {
    // 최소 높이 4px 설정 
    const minHeight = 4
    // 최대 높이를 88px로 증가 
    const maxHeight = 88
    return `${Math.max(minHeight, (score / 100) * maxHeight)}px`
  }

  if (loading) {
    return (
      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-4">
          <div className="text-center">불러오는 중...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            아직 작성된 일기가 없습니다.
            <br />
            오늘의 감정을 일기로 남겨보세요!
          </div>
        </CardContent>
      </Card>
    )
  }

  // 가장 높은 감정 찾기
  const dominantEmotion = Object.entries(data.emotionScores).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
  const dominantEmoji = emotionEmojis[dominantEmotion] || "✨"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent flex items-start">
          <CardTitle className="text-lg flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-primary" />
            주간 리포트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* 그래프 컨테이너 */}
            <div className="flex justify-center mt-7">
              <div className="relative w-full h-36">
                <div className="flex items-end justify-around h-32 gap-0 mb-1">
                  {emotionOrder.map((emotion, index) => {
                    const score = data.emotionScores[emotion] ?? 0
                    return (
                      <motion.div
                        key={emotion}
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                      >
                        <motion.div
                          className="w-8 rounded-md shadow-md overflow-hidden"
                          style={{
                            height: getEmotionHeight(emotion, score),
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: getEmotionHeight(emotion, score) }}
                          transition={{ duration: 0.8, delay: 0.2 * index }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              background: getEmotionGradient(emotion),
                            }}
                          />
                        </motion.div>
                        <motion.div
                          className="flex flex-col items-center mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + 0.1 * index, duration: 0.5 }}
                        >
                          <span className="text-lg mb-1">{emotionEmojis[emotion]}</span>
                          <span className="text-xs font-medium">{emotion}</span>
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 멘트 부분 */}
            <motion.div
              className="text-sm p-4 rounded-xl bg-primary/5 border border-primary/10 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="font-medium text-base">
                이번 주, 당신의 감정 곡선에는{" "}
                <span className="text-lg font-bold" style={{ color: getEmotionColor(dominantEmotion) }}>
                  <br />
                  {dominantEmotion} {dominantEmoji}
                </span>
                이(가) 주요하게 나타났습니다.
              </p>
              <p className="mt-2 text-gray-600 text-base">감정의 변화를 더 자세히 살펴보고 맞춤형 활동을</p>
              <p className="mt-1 text-gray-600 text-base">추천 받아보세요.</p>
            </motion.div>

            <div className="flex justify-end">
              <Link href="/weekly-report">
                <Button variant="ghost" size="sm" className="text-[#f1b29f] gap-1 p-0 hover:bg-transparent">
                  자세히 보기
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// 감정별 색상 매핑 함수
function getEmotionColor(emotion: string): string {
  const colorMap: { [key: string]: string } = {
    기쁨: "#a78bfa",
    슬픔: "#60a5fa",
    분노: "#ef4444",
    불안: "#fbbf24",
    평온: "#34d399",
  }
  return colorMap[emotion] || "#d1d5db" // 기본값은 회색
}

// 감정별 그라데이션 매핑 함수
function getEmotionGradient(emotion: string): string {
  const gradientMap: { [key: string]: string } = {
    기쁨: "linear-gradient(to top, #c084fc, #a78bfa)", // 보라색 그라데이션
    슬픔: "linear-gradient(to top, #93c5fd, #60a5fa)", // 파란색 그라데이션
    분노: "linear-gradient(to top, #fca5a5, #ef4444)", // 빨간색 그라데이션
    불안: "linear-gradient(to top, #fde68a, #fbbf24)", // 노란색 그라데이션
    평온: "linear-gradient(to top, #6ee7b7, #34d399)", // 초록색 그라데이션
  }
  return gradientMap[emotion] || "linear-gradient(to top, #e5e7eb, #9ca3af)" // 기본값은 회색 그라데이션
}
