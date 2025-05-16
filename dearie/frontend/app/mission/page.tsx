"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { useEffect, useState } from "react"
import { MissionItem } from "@/components/feature/mission/mission-item"
import { useMissionStore } from "@/stores/mission-store"
import type { MissionCategory, DailyMissionResponseDTO } from "@/types/mission"

export default function MissionPage() {
  const { preview, fetchAll, loading } = useMissionStore();
  const [selectedType, setSelectedType] = useState<"all" | MissionCategory>("all");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 탭 필터링
  const filteredMissions = preview.filter((mission: DailyMissionResponseDTO) => {
    if (selectedType === "all") return true;
    if (selectedType === "STATIC") return mission.missionType === "STATIC";
    if (selectedType === "DYNAMIC") return mission.missionType === "DYNAMIC";
    return true;
  });

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">오늘의 미션</h1>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedType(value as any)}>
          <TabsList className="grid grid-cols-3 mb-6 bg-gray-100/80 p-1 rounded-full">
            <TabsTrigger value="all" className="rounded-full">전체</TabsTrigger>
            <TabsTrigger value="STATIC" className="rounded-full">마음챙김</TabsTrigger>
            <TabsTrigger value="DYNAMIC" className="rounded-full">활동</TabsTrigger>
          </TabsList>
          <div className="space-y-3">
            {loading && <div>로딩 중...</div>}
            {!loading && filteredMissions.map((mission) => (
              <MissionItem key={mission.id} mission={mission} />
            ))}
            {!loading && filteredMissions.length === 0 && (
              <div className="text-center text-gray-400 py-8">미션이 없습니다.</div>
            )}
          </div>
        </Tabs>
      </div>
    </AppLayout>
  )
}
