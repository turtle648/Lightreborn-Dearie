"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useMissionStore } from "@/stores/mission-store"
import type { MissionCategory, RecentMissionResponseDTO } from "@/types/mission"
import { CompletedMissionCard } from "@/components/feature/mission/completed-mission-item"
import { useInView } from "react-intersection-observer"

export default function MissionPage() {
  const { recentMissions, fetchRecentMissions, recentLoading, hasMore } = useMissionStore();
  const [selectedType, setSelectedType] = useState<"all" | MissionCategory>("all");
  const [page, setPage] = useState(0);
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "0px" });

  useEffect(() => {
    // 최초 1회만
    fetchRecentMissions(0);
    setPage(0);
  }, [fetchRecentMissions]);

  useEffect(() => {
    if (page === 0) return; // 첫 페이지는 이미 위에서 호출
    fetchRecentMissions(page);
  }, [page, fetchRecentMissions]);

  useEffect(() => {
    if (inView && !recentLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [inView, recentLoading, hasMore]);

  // 탭 필터링
  const filteredMissions = recentMissions.filter((mission: RecentMissionResponseDTO) => {
    if (selectedType === "all") return true;
    return mission.missionType === selectedType;
  });

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">성공한 미션</h1>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedType(value as any)}>
          <TabsList className="grid grid-cols-3 mb-6 bg-gray-100/80 p-1 rounded-full">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:text-white data-[state=active]:bg-black">전체</TabsTrigger>
            <TabsTrigger value="STATIC" className="rounded-full data-[state=active]:text-white data-[state=active]:bg-black">마음챙김</TabsTrigger>
            <TabsTrigger value="DYNAMIC" className="rounded-full data-[state=active]:text-white data-[state=active]:bg-black">활동</TabsTrigger>
          </TabsList>
          <div className="space-y-3">
            {recentLoading && page === 0 && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            )}
            {!recentLoading && filteredMissions.length === 0 && (
              <div className="text-center text-gray-400 py-8">아직 성공한 미션이 없습니다.</div>
            )}
            {filteredMissions.map((mission) => (
              <CompletedMissionCard key={mission.userMissionId} mission={mission} />
            ))}
            
            {/* 로딩 표시기와 관찰 대상 요소를 분리 */}
            {hasMore && (
              <div className="h-10 flex items-center justify-center">
                {recentLoading && page > 0 ? (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    <span>더 불러오는 중...</span>
                  </div>
                ) : (
                  // 빈 div는 로딩 중이 아닐 때만 보임
                  <div ref={ref} className="h-20 w-full"></div>
                )}
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </AppLayout>
  )
}