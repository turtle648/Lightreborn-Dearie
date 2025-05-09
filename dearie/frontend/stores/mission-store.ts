"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Mission, MissionCategory } from "@/types/mission"
import { getMissions, getDailyMissions, updateMissionStatus } from "@/apis/mission-api"

interface MissionState {
  missions: Mission[]
  dailyMissions: Mission[]
  completedMissions: number[]
  isLoading: boolean
  error: string | null

  // 액션
  fetchMissions: (category?: MissionCategory) => Promise<void>
  fetchDailyMissions: () => Promise<void>
  toggleMissionComplete: (id: number) => Promise<void>
  isMissionCompleted: (id: number) => boolean
  clearError: () => void
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      missions: [],
      dailyMissions: [],
      completedMissions: [],
      isLoading: false,
      error: null,

      fetchMissions: async (category) => {
        set({ isLoading: true, error: null })
        try {
          const missions = await getMissions(category)
          set({ missions, isLoading: false })
        } catch (error) {
          set({ error: "미션 목록을 불러오는데 실패했습니다.", isLoading: false })
          console.error("미션 목록 불러오기 오류:", error)
        }
      },

      fetchDailyMissions: async () => {
        set({ isLoading: true, error: null })
        try {
          const dailyMissions = await getDailyMissions()
          set({ dailyMissions, isLoading: false })
        } catch (error) {
          set({ error: "오늘의 미션을 불러오는데 실패했습니다.", isLoading: false })
          console.error("오늘의 미션 불러오기 오류:", error)
        }
      },

      toggleMissionComplete: async (id) => {
        const { completedMissions } = get()
        const isCompleted = completedMissions.includes(id)

        try {
          await updateMissionStatus(id, !isCompleted)

          set((state) => ({
            completedMissions: isCompleted
              ? state.completedMissions.filter((missionId) => missionId !== id)
              : [...state.completedMissions, id],
          }))
        } catch (error) {
          set({ error: "미션 상태 업데이트에 실패했습니다." })
          console.error("미션 상태 업데이트 오류:", error)
        }
      },

      isMissionCompleted: (id) => {
        return get().completedMissions.includes(id)
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "mission-storage",
      partialize: (state) => ({
        completedMissions: state.completedMissions,
      }),
    },
  ),
)
