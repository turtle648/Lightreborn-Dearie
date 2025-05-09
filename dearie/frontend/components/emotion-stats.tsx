"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { motion } from "framer-motion"

export function EmotionStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">감정 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList className="grid grid-cols-3 mb-4 bg-gray-100/80 p-1 rounded-full">
              <TabsTrigger value="weekly" className="rounded-full">
                주간
              </TabsTrigger>
              <TabsTrigger value="monthly" className="rounded-full">
                월간
              </TabsTrigger>
              <TabsTrigger value="yearly" className="rounded-full">
                연간
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-4">
              <div className="relative h-48 w-full">
                <Image src="/images/profile-page.png" alt="주간 감정 통계" fill className="object-contain" />
              </div>

              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div>
                  <div className="h-4 bg-blue-400 rounded-full mb-1"></div>
                  <span>슬픔</span>
                </div>
                <div>
                  <div className="h-8 bg-green-400 rounded-full mb-1"></div>
                  <span>평온</span>
                </div>
                <div>
                  <div className="h-12 bg-yellow-400 rounded-full mb-1"></div>
                  <span>불안</span>
                </div>
                <div>
                  <div className="h-6 bg-red-400 rounded-full mb-1"></div>
                  <span>화남</span>
                </div>
                <div>
                  <div className="h-10 bg-purple-400 rounded-full mb-1"></div>
                  <span>기쁨</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monthly">
              <div className="text-center py-8 text-gray-500">
                <p>월간 감정 통계는 한 달 이상 사용 후 확인할 수 있습니다.</p>
              </div>
            </TabsContent>

            <TabsContent value="yearly">
              <div className="text-center py-8 text-gray-500">
                <p>연간 감정 통계는 일 년 이상 사용 후 확인할 수 있습니다.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
