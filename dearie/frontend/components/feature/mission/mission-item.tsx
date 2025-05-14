"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { updateMissionStatus } from "@/apis/mission-api"
import { Icon } from "@/assets/icons"
import type { Mission } from "@/types/mission"

interface MissionItemProps {
  mission: Mission
}

export function MissionItem({ mission }: MissionItemProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // 완료된 미션 상태 가져오기
  useEffect(() => {
    const storedCompletedMissions = localStorage.getItem("completedMissions")
    if (storedCompletedMissions) {
      const completedMissions = JSON.parse(storedCompletedMissions) as number[]
      setCompleted(completedMissions.includes(mission.id))
    }
  }, [mission.id])

  const handleMissionAction = async () => {
    if (isUpdating) return

    if (completed) {
      setIsUpdating(true)
      try {
        await updateMissionStatus(mission.id, false)
        setCompleted(false)
      } catch (error) {
        console.error("미션 상태 업데이트 중 오류 발생:", error)
      } finally {
        setIsUpdating(false)
      }
    } else {
      if (mission.route) {
        router.push(mission.route)
      } else {
        setIsUpdating(true)
        try {
          await updateMissionStatus(mission.id, true)
          setCompleted(true)
        } catch (error) {
          console.error("미션 상태 업데이트 중 오류 발생:", error)
        } finally {
          setIsUpdating(false)
        }
      }
    }
  }

  // 아이콘 컴포넌트 동적 생성
  const IconComponent = ({ className }: { className?: string }) => {
    const iconName = mission.icon as any
    return <Icon name={iconName} className={cn(className, mission.color)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all border-none shadow-md",
          completed ? "bg-primary/10" : "bg-white",
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
                <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-gray-200 rounded-full">
                  {mission.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant={completed ? "outline" : "default"}
                size="sm"
                className={cn(
                  "rounded-full shadow-sm",
                  completed
                    ? "border-primary text-primary bg-white hover:bg-primary/5"
                    : "bg-gradient-soft hover:opacity-90",
                )}
                onClick={handleMissionAction}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  "처리 중..."
                ) : completed ? (
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
} 