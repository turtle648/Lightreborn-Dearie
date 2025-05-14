"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { getMissions, updateMissionStatus } from "@/apis/mission-api"
import { Icon } from "@/assets/icons"

interface MissionListProps {
  category?: string
}

export function MissionList({ category }: MissionListProps) {
  const router = useRouter()
  const [missions, setMissions] = useState<any[]>([])
  const [completedMissions, setCompletedMissions] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 미션 데이터 가져오기
  useEffect(() => {
    const fetchMissions = async () => {
      setIsLoading(true)
      try {
        const data = await getMissions(category as any)
        setMissions(data)
      } catch (error) {
        console.error("미션 목록을 가져오는 중 오류 발생:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMissions()
  }, [category])

  // 완료된 미션 상태 가져오기
  useEffect(() => {
    const storedCompletedMissions = localStorage.getItem("completedMissions")
    if (storedCompletedMissions) {
      setCompletedMissions(JSON.parse(storedCompletedMissions))
    }
  }, [])

  const handleMissionStart = (mission: any) => {
    // 산책하기 미션인 경우 특별히 처리
    if (mission.title === "산책하기") {
      router.push("/mission/walking")
    } else if (mission.route) {
      router.push(mission.route)
    } else {
      // 라우트가 없는 경우 기본 동작 (완료 처리)
      toggleComplete(mission.id)
    }
  }

  const toggleComplete = async (id: number) => {
    const isCompleted = completedMissions.includes(id)

    try {
      await updateMissionStatus(id, !isCompleted)

      if (isCompleted) {
        setCompletedMissions(completedMissions.filter((missionId) => missionId !== id))
      } else {
        setCompletedMissions([...completedMissions, id])
      }
    } catch (error) {
      console.error("미션 상태 업데이트 중 오류 발생:", error)
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">미션을 불러오는 중...</div>
  }

  return (
    <div className="space-y-4">
      {missions.map((mission, index) => {
        const isCompleted = completedMissions.includes(mission.id)
        // 아이콘 컴포넌트 동적 생성
        const IconComponent = ({ className }: { className?: string }) => {
          const iconName = mission.icon as any
          return <Icon name={iconName} className={cn(className, mission.color)} />
        }

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
                      <IconComponent className="h-5 w-5" />
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
                      onClick={() => (isCompleted ? toggleComplete(mission.id) : handleMissionStart(mission))}
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
