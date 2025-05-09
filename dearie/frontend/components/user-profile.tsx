"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { motion } from "framer-motion"

export function UserProfile() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-none shadow-lg overflow-hidden">
        <div className="h-24 bg-gradient-soft"></div>
        <CardContent className="p-6 -mt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                <AvatarImage src="/diverse-professional-profiles.png" />
                <AvatarFallback>윌리</AvatarFallback>
              </Avatar>
              <div className="mt-8">
                <h2 className="text-2xl font-bold">윌리님</h2>
                <p className="text-sm text-gray-500">일기 작성 30일째</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-white/80 shadow-sm">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <p className="text-2xl font-bold text-primary">42</p>
              <p className="text-xs text-gray-500 mt-1">작성한 일기</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <p className="text-2xl font-bold text-primary">15</p>
              <p className="text-xs text-gray-500 mt-1">완료한 미션</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <p className="text-2xl font-bold text-primary">8</p>
              <p className="text-xs text-gray-500 mt-1">연속 작성일</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
