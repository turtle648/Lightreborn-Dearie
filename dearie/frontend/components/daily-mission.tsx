"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronRight, Sparkles } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface MissionProps {
  id: number
  title: string
  description: string
  difficulty: string
  category: string
}

interface DailyMissionProps {
  mission: MissionProps
}

export function DailyMission({ mission }: DailyMissionProps) {
  const [completed, setCompleted] = useState(false)

  const handleComplete = () => {
    setCompleted(!completed)
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
                <Sparkles className="h-4 w-4 text-primary" />
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
                onClick={handleComplete}
              >
                {completed ? (
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
