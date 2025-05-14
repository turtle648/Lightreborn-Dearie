"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getMissions } from "@/apis/mission-api"
import type { Mission, MissionCategory } from "@/types/mission"
import { MissionItem } from "@/components/feature/mission/mission-item"

export default function MissionPage() {
  const router = useRouter()
  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory | undefined>(undefined)

  useEffect(() => {
    const fetchMissions = async () => {
      const allMissions = await getMissions(selectedCategory)
      setMissions(allMissions)
    }
    fetchMissions()
  }, [selectedCategory])

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">오늘의 미션</h1>
          <Button variant="outline" size="sm" className="gap-1 rounded-full">
            <Filter className="h-4 w-4" />
            필터
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedCategory(value === "all" ? undefined : value as MissionCategory)}>
          <TabsList className="grid grid-cols-4 mb-6 bg-gray-100/80 p-1 rounded-full">
            <TabsTrigger value="all" className="rounded-full">
              전체
            </TabsTrigger>
            <TabsTrigger value="mindfulness" className="rounded-full">
              마음챙김
            </TabsTrigger>
            <TabsTrigger value="emotion" className="rounded-full">
              감정
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-full">
              활동
            </TabsTrigger>
          </TabsList>
          <div className="space-y-3">
            {missions.map((mission) => (
              <MissionItem key={mission.id} mission={mission} />
            ))}
          </div>
        </Tabs>
      </div>
    </AppLayout>
  )
}
