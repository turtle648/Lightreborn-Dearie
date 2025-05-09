"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function RecentActivity() {
  // 샘플 데이터
  const activities = [
    {
      id: 1,
      type: "diary",
      title: "카페 501",
      description: "따뜻한 차 한 잔, 창밖의 풍경, 조용한 음악 같은 일상의 작은 행복에 마음을 전달한 감정입니다.",
      image: "/warm-cafe-corner.png",
      date: "2025.04.23",
    },
    {
      id: 2,
      type: "mission",
      title: "5분 명상하기",
      description: "조용한 곳에서 5분간 명상하며 마음 가다듬기",
      image: "/placeholder.svg?height=80&width=80&query=meditation",
      date: "2025.04.22",
    },
  ]

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
            <Button variant="link" className="text-primary p-0 h-auto">
              더보기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index + 0.5, duration: 0.3 }}
                whileHover={{ x: 5 }}
              >
                <Link href={activity.type === "diary" ? `/diary/${activity.id}` : `/mission/${activity.id}`}>
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <Image
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{activity.title}</h3>
                        <span className="text-xs text-gray-500">{activity.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{activity.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
