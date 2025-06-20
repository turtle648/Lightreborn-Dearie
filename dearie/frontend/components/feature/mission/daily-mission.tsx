"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronRight, Sparkles } from "lucide-react"
import { useState } from "react"
import { cn } from "@/utils/cn"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface MissionProps {
  id: number
  title: string
  description: string
  difficulty: string
  category: string
  route?: string
}

interface DailyMissionProps {
  mission: MissionProps
}

export default function DailyMission({ mission }: DailyMissionProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleMissionAction = async () => {
    if (isUpdating) return

    console.log("미션 정보:", mission); // 미션 객체 확인
    console.log("제목:", mission.title);

    if (completed) {
      setIsUpdating(true)
      try {
        
        setCompleted(false)
      } catch (error) {
        console.error("미션 상태 업데이트 중 오류 발생:", error)
      } finally {
        setIsUpdating(false)
      }
    } else {
      // 산책하기 미션인 경우 산책 페이지로 이동
      if (mission.title === "산책하기") {
        console.log("산책하기 미션 감지, 이동 시도");
        router.push("/mission/walking")
        return;
      } else if (mission.route) {
        console.log("경로로 이동 시도:", mission.route); // 로그 추가
        router.push(mission.route);
        return; // 여기서 함수 종료
      } else {
        // 라우트가 없는 경우 기본 동작 (완료 처리)
        setIsUpdating(true)
        try {
         
          setCompleted(true)
        } catch (error) {
          console.error("미션 상태 업데이트 중 오류 발생:", error)
        } finally {
          setIsUpdating(false)
        }
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={cn("overflow-hidden transition-all border-none shadow-md", completed ? "bg-primary/10" : "bg-white")}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">{mission.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 rounded-full">
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
                aria-pressed={completed}
                aria-label={completed ? "미션 완료 취소하기" : "미션 시작하기"}
              >
                {isUpdating ? (
                  "처리 중..."
                ) : completed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                    완료
                  </>
                ) : (
                  <>
                    시작하기
                    <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
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
