"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Smile } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { AppLayout } from "@/components/app-layout"
import { fetchReportSummary, ReportSummaryResponse } from "@/apis/report-api"
import { format, getWeek, startOfMonth, startOfWeek } from "date-fns"
import { useUserStore } from "@/stores/user-store"

const emotionEmojis: { [key: string]: string } = {
  기쁨: "😊",
  슬픔: "😢",
  분노: "😠",
  불안: "😰",
  평온: "😌",
};
const emotionOrder = ["기쁨", "슬픔", "분노", "불안", "평온"];

export function WeeklyReportDetail() {
  const { profile } = useUserStore();
  const [currentWeek, setCurrentWeek] = useState("")
  const [data, setData] = useState<ReportSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 현재 날짜로 주차 계산
    const now = new Date()
    const month = now.getMonth() + 1
    // 해당 월의 첫 날의 주차를 기준으로 현재 주차 계산
    const firstWeekOfMonth = getWeek(startOfMonth(now), { weekStartsOn: 1 })
    const currentWeekOfYear = getWeek(now, { weekStartsOn: 1 })
    const weekOfMonth = currentWeekOfYear - firstWeekOfMonth + 1
    setCurrentWeek(`${month}월 ${weekOfMonth}주차`)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const storedUserId = localStorage.getItem('userId')
        if (!storedUserId || isNaN(Number(storedUserId))) {
          setError("유효하지 않은 사용자 ID")
          return
        }
        const userId = Number(storedUserId)
        const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
        const weekStartDate = format(monday, "yyyy-MM-dd")
        // 리포트는 항상 fetchReportSummary로만 조회
        const result = await fetchReportSummary(userId, weekStartDate)
        setData(result)
        setError(null)
      } catch (err: any) {
        setError('데이터를 불러오는데 실패했습니다.')
        console.error('Failed to fetch report summary:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getEmotionHeight = (emotion: string, score: number) => {
    const minHeight = 4;
    const maxHeight = 88;
    return `${Math.max(minHeight, (score / 100) * maxHeight)}px`;
  }

  return (
    <AppLayout>
      <div className="p-0 sm:p-6 space-y-6">
        {/* 상단 헤더 */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur flex items-center h-14 px-4 border-b">
          <Link
            href={ROUTES.MYPAGE}
            className="flex items-center text-gray-700 hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-lg font-medium">주간 리포트 상세</span>
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 sm:px-0"
        >
          <h1 className="text-2xl font-bold mb-6">{profile?.name}님의 {currentWeek} 감정 리포트</h1>
          
          {loading ? (
            <Card className="border-none shadow-md mb-6">
              <CardContent className="p-5">
                <div className="text-center">불러오는 중...</div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-none shadow-md mb-6">
              <CardContent className="p-5">
                <div className="text-red-500">{error}</div>
              </CardContent>
            </Card>
          ) : data ? (
            (() => {
              const [analysis, cheer] = (data.comment ?? "").split("|", 2);
              return (
                <>
                  {/* 감정 차트 */}
                  <Card className="border-none shadow-md mb-6">
                    <CardContent className="p-5">
                      <div className="w-full overflow-x-auto local-hide-scrollbar">
                        <div className="flex items-end justify-around h-[240px] gap-0 mb-2 max-w-full mt-[-96px] min-w-0">
                          {emotionOrder.map((emotion, index) => {
                            const score = data.emotionScores[emotion] ?? 0;
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
                            );
                          })}
                        </div>
                      </div>
                      {/* 감정 분석 카드 */}
                      <motion.div
                        className="mt-6 p-5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <h3 className="font-bold text-lg mb-2 text-primary">감정 분석</h3>
                        <p className="text-gray-700 text-base mb-2">{analysis?.trim()}</p>
                      </motion.div>
                      {/* 응원 한마디 카드 */}
                      {cheer && (
                        <motion.div
                          className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/10 shadow-sm text-gray-700 leading-relaxed"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                        >
                          <span className="block text-lg font-semibold mb-1 text-primary">응원 한마디</span>
                          <span className="block text-base">{cheer?.trim()}</span>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 추천 활동 */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">{profile?.name}님을 위한 추천 활동</h2>
                    <div className="space-y-3">
                      {(data?.recommendations ?? ["5분 명상하기", "가벼운 산책하기", "감사 일기 쓰기"]).map((activity, index) => (
                        <motion.div
                          key={activity}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                        >
                          <div className="bg-white rounded-sm shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="p-4 flex items-center">
                              <div className="w-8 h-8 rounded-full bg-[#FFEEEE] flex items-center justify-center mr-3">
                                <span className="text-[#FF9999] text-lg">
                                  {index === 0 ? "😌" : index === 1 ? "🚶" : "✍️"}
                                </span>
                              </div>
                              <div className="flex-1 text-lg font-medium text-gray-800">{activity}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 심리 상태 체크 안내 */}
                  {(data.needSurvey ||
                    data.emotionScores["분노"] >= 40 ||
                    data.emotionScores["불안"] >= 40 ||
                    data.emotionScores["슬픔"] >= 40 ||
                    (data.emotionScores["분노"] + data.emotionScores["불안"] + data.emotionScores["슬픔"]) >= 50) && (
                    <div className="mt-6 p-6 rounded-xl bg-[#FFF5F5]/60 border border-[#FFDEDE] shadow-sm flex flex-col items-center text-center">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">📋</span>
                        <span className="text-lg font-medium text-gray-900">심리 상태 체크 안내</span>
                      </div>
                      <p className="text-base text-gray-700 mb-4">
                        최근 슬픔, 불안, 분노 감정이 높게 나타났어요.
                        <br />
                        <span className="font-medium text-gray-900">마음 건강을 위해 심리 상태를 체크해보세요.</span>
                      </p>
                      <Button
                        asChild
                        className="text-base h-6 py-6 bg-white hover:bg-gray-50 text-[#FF7777] border border-[#FFDEDE] shadow-sm"
                      >
                        <Link href="/survey">심리 상태 체크하기</Link>
                      </Button>
                    </div>
                  )}

                  {/* 일기 바로가기 */}
                  <div className="mt-8">
                    <Link href={ROUTES.DIARY.LIST}>
                      <Button className="w-full rounded-full bg-gradient-soft text-white text-lg h-12 py-4">
                        나의 일기 돌아보기
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </>
              );
            })()
          ) : (
            <Card className="border-none shadow-md mb-6">
              <CardContent className="p-5">
                <div className="text-center">데이터가 없습니다.</div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
      <style jsx>{`
        .local-hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .local-hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
    </AppLayout>
  )
}

// 감정별 그라데이션 매핑 함수
function getEmotionGradient(emotion: string): string {
  const gradientMap: { [key: string]: string } = {
    기쁨: "linear-gradient(to top, #c084fc, #a78bfa)",
    슬픔: "linear-gradient(to top, #93c5fd, #60a5fa)",
    분노: "linear-gradient(to top, #fca5a5, #ef4444)",
    불안: "linear-gradient(to top, #fde68a, #fbbf24)",
    평온: "linear-gradient(to top, #6ee7b7, #34d399)",
  };
  return gradientMap[emotion] || "linear-gradient(to top, #e5e7eb, #9ca3af)";
}
