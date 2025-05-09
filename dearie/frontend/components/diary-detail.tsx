"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Bookmark, Smile, Frown, Meh } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface DiaryDetailProps {
  id: string
}

export function DiaryDetail({ id }: DiaryDetailProps) {
  // 샘플 데이터 - 실제로는 API에서 가져올 것
  const diary = {
    id: Number.parseInt(id),
    date: "2025 / 04 / 23 (화)",
    content: `오늘은 눈을 뜨는 것조차 힘들었다. 무언가 해야 할 일이 분명히 있었던 것 같은데, 머릿속은 안개처럼 뿌옇고, 손끝 하나 움직이는 싫었다. 아무도 나를 기다리지 않는다는 생각이 들자, 하루를 시작할 이유가 없어 보였다. 

하지만 창문 밖으로 들어오는 햇살이 내 얼굴을 비추자 조금씩 마음이 움직이기 시작했다. 오랜만에 창가에 앉아 따뜻한 차 한 잔을 마시며 바깥 풍경을 바라보았다. 

시간은 느리게 흘러갔지만, 그 느림이 오히려 나에게 위안이 되었다. 아무것도 하지 않아도 괜찮다는 생각이 들었다. 오늘 하루는 그저 나를 위한 시간으로 채워도 충분하다.`,
    image: "/images/window-view.png",
    emotion: "슬픔",
    aiAnalysis: {
      emotions: [
        { name: "슬픔", value: 65 },
        { name: "불안", value: 20 },
        { name: "평온", value: 15 },
      ],
      keywords: ["무기력", "고립감", "위안", "자기수용"],
      summary:
        "무기력함과 고립감을 느끼지만 자연과 여유를 통해 위안을 찾고 자기 수용으로 나아가는 과정이 담겨 있습니다.",
      recommendation: "가벼운 산책이나 명상을 통해 자연과 연결되는 시간을 더 가져보는 것이 도움이 될 수 있습니다.",
    },
  }

  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  return (
    <div>
      {diary.image && (
        <div className="relative w-full h-72">
          <Image src={diary.image || "/placeholder.svg"} alt="일기 이미지" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
        </div>
      )}

      <div className="p-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-2xl p-6 shadow-xl mb-6"
        >
          <div className="mb-4">
            <h1 className="text-xl font-bold mb-2">{diary.date}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 rounded-full">
                {diary.emotion}
              </Badge>
              <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200 rounded-full">
                AI 분석 완료
              </Badge>
            </div>
          </div>

          <div className="mb-6 whitespace-pre-line">
            <p className="text-gray-800 leading-relaxed">{diary.content}</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleLike} className="rounded-full">
                <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSave} className="rounded-full">
              <Bookmark className={`h-5 w-5 ${saved ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-100/80 p-1 rounded-full">
            <TabsTrigger value="analysis" className="rounded-full">
              AI 분석
            </TabsTrigger>
            <TabsTrigger value="recommendation" className="rounded-full">
              추천
            </TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="p-5 space-y-5">
                  <div>
                    <h3 className="text-sm font-medium mb-3">감정 분석</h3>
                    <div className="space-y-3">
                      {diary.aiAnalysis.emotions.map((emotion, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              {emotion.name === "슬픔" && <Frown className="h-4 w-4 mr-1 text-blue-500" />}
                              {emotion.name === "불안" && <Meh className="h-4 w-4 mr-1 text-amber-500" />}
                              {emotion.name === "평온" && <Smile className="h-4 w-4 mr-1 text-green-500" />}
                              <span className="text-sm">{emotion.name}</span>
                            </div>
                            <span className="text-sm">{emotion.value}%</span>
                          </div>
                          <Progress value={emotion.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">키워드</h3>
                    <div className="flex flex-wrap gap-2">
                      {diary.aiAnalysis.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 rounded-full">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">요약</h3>
                    <p className="text-sm text-gray-600">{diary.aiAnalysis.summary}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="recommendation">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="p-5">
                  <h3 className="text-sm font-medium mb-3">추천 활동</h3>
                  <p className="text-sm text-gray-600 mb-5">{diary.aiAnalysis.recommendation}</p>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-full">
                      <Smile className="h-4 w-4 text-primary" />
                      <span>5분 명상하기</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-full">
                      <Smile className="h-4 w-4 text-primary" />
                      <span>가벼운 산책하기</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-full">
                      <Smile className="h-4 w-4 text-primary" />
                      <span>감사일기 쓰기</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
