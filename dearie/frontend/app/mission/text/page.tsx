"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Save, FileText, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function TextMissionPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState<string>("오늘 가장 감사했던 순간은 무엇인가요?")
  const [text, setText] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // 프롬프트 변경
  const changePrompt = () => {
    const prompts = [
      "오늘 가장 감사했던 순간은 무엇인가요?",
      "지금 이 순간 당신의 마음은 어떤 색깔인가요? 그 이유는 무엇인가요?",
      "오늘 하루 중 가장 평화로웠던 순간을 떠올려보세요.",
      "자신에게 가장 필요한 말은 무엇인가요?",
      "오늘 배운 작은 교훈이 있다면 무엇인가요?",
    ]

    // 현재와 다른 프롬프트 선택
    let newPrompt = prompt
    while (newPrompt === prompt) {
      newPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    }
    setPrompt(newPrompt)
  }

  // 텍스트 완료
  const completeTextMission = () => {
    if (text.trim().length === 0) return
    setIsCompleted(true)
  }

  // 텍스트 세션 저장
  const saveTextSession = () => {
    // 실제 구현에서는 API 호출로 데이터 저장
    setIsSaved(true)

    // 로컬 스토리지에 저장 (예시)
    const textData = {
      prompt: prompt,
      content: text,
      date: new Date().toISOString(),
    }

    try {
      const savedTexts = JSON.parse(localStorage.getItem("textHistory") || "[]")
      savedTexts.push(textData)
      localStorage.setItem("textHistory", JSON.stringify(savedTexts))
    } catch (error) {
      console.error("텍스트 데이터 저장 중 오류 발생:", error)
    }
  }

  return (
    <AppLayout showBack title="글쓰기 미션" rightAction={null}>
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 mb-4">
          <Card className="h-full border-none shadow-md overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col">
              {!isCompleted ? (
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold mb-2">오늘의 질문</h3>
                      <Button variant="ghost" size="sm" onClick={changePrompt} className="h-8 px-2">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        다른 질문
                      </Button>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-primary font-medium">{prompt}</p>
                    </div>
                  </div>

                  <div className="flex-1 mb-6">
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="자유롭게 작성해보세요..."
                      className="min-h-[200px] h-full resize-none"
                    />
                  </div>

                  <Button
                    onClick={completeTextMission}
                    className="w-full py-3 rounded-full bg-gradient-soft shadow-lg shadow-primary/20"
                    disabled={text.trim().length === 0}
                  >
                    <Save className="mr-2 h-5 w-5" />
                    작성 완료
                  </Button>
                </div>
              ) : !isSaved ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">글쓰기 완료!</h3>
                    <p className="text-sm text-gray-600">작성한 글에 어울리는 태그를 선택해보세요. (선택사항)</p>
                  </div>

                  <div className="mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                      <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">
                        {prompt}
                      </Badge>
                      <p className="text-gray-700 whitespace-pre-line">{text}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200">
                        #감사
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        #성찰
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      >
                        #긍정
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer bg-purple-100 text-purple-800 hover:bg-purple-200"
                      >
                        #성장
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer bg-pink-100 text-pink-800 hover:bg-pink-200">
                        #행복
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button
                      onClick={saveTextSession}
                      className="w-full py-3 rounded-full bg-gradient-soft shadow-lg shadow-primary/20"
                    >
                      <Save className="mr-2 h-5 w-5" />
                      저장하기
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col h-full"
                >
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">글쓰기 미션 완료!</h3>
                    <p className="text-gray-600">
                      자신의 생각과 감정을 글로 표현하는 것은 마음 건강에 큰 도움이 됩니다.
                    </p>
                  </div>

                  <div className="flex-1 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">
                        {prompt}
                      </Badge>
                      <p className="text-gray-700 whitespace-pre-line">{text}</p>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button
                      onClick={() => router.push(ROUTES.MISSION.LIST)}
                      className="flex-1 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      미션 목록으로
                    </Button>
                    <Button
                      onClick={() => {
                        // 미션 완료 처리
                        router.push(ROUTES.HOME)
                      }}
                      className="flex-1 py-3 rounded-full bg-gradient-soft shadow-lg shadow-primary/20"
                    >
                      미션 완료하기
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
