"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useMissionStore } from "@/stores/mission-store"

export function RecentActivity() {
  const { recentMissions, fetchRecentMissions, recentLoading } = useMissionStore()

  useEffect(() => {
    fetchRecentMissions(0) // page = 0
  }, [fetchRecentMissions])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">최근 활동</CardTitle>
            <Link href="/mission/recent-success">
              <Button variant="link" className="text-primary p-0 h-auto">
                더보기
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLoading && <p className="text-sm text-gray-500">로딩 중...</p>}
            {!recentLoading && recentMissions.map((mission, index) => (
              <motion.div
                key={mission.userMissionId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index + 0.5, duration: 0.3 }}
                whileHover={{ x: 5 }}
              >
                <Link href={`/mission/recent-success/${mission.userMissionId}?type=${mission.missionExecutionType}`}>
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <Image
                        src={mission.imageUrl || "https://previews.123rf.com/images/sudakasi/sudakasi1405/sudakasi140500174/28673467-%EC%95%84%EB%A6%84%EB%8B%A4%EC%9A%B4-%EC%9E%90%EC%97%B0-%EB%B0%B0%EA%B2%BD.jpg"}
                        alt={mission.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{mission.title}</h3>
                        <span className="text-xs text-gray-500">{mission.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{mission.content}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {!recentLoading && recentMissions.length === 0 && (
              <p className="text-center text-gray-400 py-6">최근 완료한 미션이 없습니다.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
