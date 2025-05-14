"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, Route, Calendar, Timer } from "lucide-react"
import { formatDuration } from "@/utils/format-date"

interface WalkingSummaryProps {
  startTime: Date | null
  endTime: Date | null
  duration: number // 초 단위
  distance: number // 미터 단위
}

export function WalkingSummary({ startTime, endTime, duration, distance }: WalkingSummaryProps) {
  // 시간 포맷팅
  const formatTime = (date: Date | null) => {
    if (!date) return "-"
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 거리 포맷팅
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    } else {
      return `${(meters / 1000).toFixed(2)}km`
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">시작 시간</p>
              <p className="font-medium">{formatTime(startTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">종료 시간</p>
              <p className="font-medium">{formatTime(endTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Timer className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">운동 시간</p>
              <p className="font-medium">{formatDuration(duration)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Route className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">총 거리</p>
              <p className="font-medium">{formatDistance(distance)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
