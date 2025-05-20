"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import type { RecentMissionResponseDTO } from "@/types/mission"

interface CompletedMissionCardProps {
  mission: RecentMissionResponseDTO
}

export function CompletedMissionCard({ mission }: CompletedMissionCardProps) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-md">
        <CardContent className="p-4 flex gap-4">
          {/* 썸네일 */}
          <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
            <Image
              src={mission.imageUrl || "https://previews.123rf.com/images/sudakasi/sudakasi1405/sudakasi140500174/28673467-%EC%95%84%EB%A6%84%EB%8B%A4%EC%9A%B4-%EC%9E%90%EC%97%B0-%EB%B0%B0%EA%B2%BD.jpg"}
              alt={mission.title}
              fill
              className="object-cover"
            />
          </div>

          {/* 텍스트 */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-md font-semibold">{mission.title}</h3>
              <span className="text-xs text-gray-500">{mission.date}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{mission.content}</p>
            <div className="flex items-center justify-between">
              <Badge className="text-xs rounded-full" variant="outline">
                {mission.missionType === "STATIC" ? "마음챙김" : "활동"}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="text-sm p-0 h-auto text-primary"
                onClick={() => router.push(`/missions/recent-success/${mission.userMissionId}?type=${mission.missionExecutionType}`)}
              >
                자세히 보기 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
