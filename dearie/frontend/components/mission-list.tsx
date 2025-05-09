"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ChevronRight, Sparkles, Clock, Award } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MissionListProps {
  category?: string
}

export function MissionList({ category }: MissionListProps) {
  // 샘플 데이터
  const allMissions = [
    {
      id: 1,
      title: "오늘의 추천 미션",
      description: "창문 밖 풍경을 5분간 바라보며 깊게 호흡하기",
      difficulty: "쉬움",
      category: "mindfulness",
      icon: Sparkles,
      color: "text-primary",
    },
    {
      id: 2,
      title: "감정 표현하기",
      description: "오늘 느낀 감정을 3가지 단어로 표현해보기",
      difficulty: "보통",
      category: "emotion",
      icon: Award,
      color: "text-amber-500",
    },
    {
      id: 3,
      title: "5분 명상하기",
      description: "조용한 곳에서 5분간 명상하며 마음 가다듬기",
      difficulty: "보통",
      category: "mindfulness",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      id: 4,
      title: "감사일기 쓰기",
      description: "오늘 감사했던 일 3가지 적어보기",
      difficulty: "쉬움",
      category: "emotion",
      icon: Sparkles,
      color: "text-green-500",
    },
    {
      id: 5,
      title: "산책하기",
      description: "15분 동안 천천히 걸으며 주변 환경 관찰하기",
      difficulty: "쉬움",
      category: "activity",
      icon: Award,
      color: "text-violet-500",
    },
  ]

  const filteredMissions = category ? allMissions.filter((mission) => mission.category === category) : allMissions

  const [completedMissions, setCompletedMissions] = useState<number[]>([])

  const toggleComplete = (id: number) => {
    if (completedMissions.includes(id)) {
      setCompletedMissions(completedMissions.filter((missionId) => missionId !== id))
    } else {
      setCompletedMissions([...completedMissions, id])
    }
  }

  return (
    <div className="space-y-4">
      {filteredMissions.map((mission, index) => {
        const isCompleted = completedMissions.includes(mission.id)
        const Icon = mission.icon

        return (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "overflow-hidden transition-all border-none shadow-md",
                isCompleted ? "bg-primary/10" : "bg-white",
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`h-5 w-5 ${mission.color}`} />
                      <h3 className="font-semibold">{mission.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs bg-primary/10 text-primary border-primary/20 rounded-full"
                      >
                        {mission.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant={isCompleted ? "outline" : "default"}
                      size="sm"
                      className={cn(
                        "rounded-full shadow-sm",
                        isCompleted
                          ? "border-primary text-primary bg-white hover:bg-primary/5"
                          : "bg-gradient-soft hover:opacity-90",
                      )}
                      onClick={() => toggleComplete(mission.id)}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          완료
                        </>
                      ) : (
                        <>
                          시작하기
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
