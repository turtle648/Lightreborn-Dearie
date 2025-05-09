"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { DiaryEntry, DiaryAnalysis } from "@/types/diary"
import { getDiaries, getDiary, saveDiary, analyzeDiary } from "@/apis/diary-api"

interface DiaryState {
  diaries: DiaryEntry[]
  currentDiary: DiaryEntry | null
  isLoading: boolean
  error: string | null
  analysis: DiaryAnalysis | null

  // 액션
  fetchDiaries: () => Promise<void>
  fetchDiary: (id: string | number) => Promise<void>
  createDiary: (diary: Omit<DiaryEntry, "id" | "date">) => Promise<void>
  analyzeDiaryContent: (content: string) => Promise<void>
  likeDiary: (id: number) => void
  clearError: () => void
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set, get) => ({
      diaries: [],
      currentDiary: null,
      isLoading: false,
      error: null,
      analysis: null,

      fetchDiaries: async () => {
        set({ isLoading: true, error: null })
        try {
          const diaries = await getDiaries()
          set({ diaries, isLoading: false })
        } catch (error) {
          set({ error: "일기 목록을 불러오는데 실패했습니다.", isLoading: false })
          console.error("일기 목록 불러오기 오류:", error)
        }
      },

      fetchDiary: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const diary = await getDiary(id)
          set({ currentDiary: diary, isLoading: false })
        } catch (error) {
          set({ error: "일기를 불러오는데 실패했습니다.", isLoading: false })
          console.error("일기 불러오기 오류:", error)
        }
      },

      createDiary: async (diary) => {
        set({ isLoading: true, error: null })
        try {
          const newDiary = await saveDiary(diary)
          set((state) => ({
            diaries: [newDiary, ...state.diaries],
            currentDiary: newDiary,
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "일기를 저장하는데 실패했습니다.", isLoading: false })
          console.error("일기 저장 오류:", error)
        }
      },

      analyzeDiaryContent: async (content) => {
        set({ isLoading: true, error: null })
        try {
          const analysis = await analyzeDiary(content)
          set({ analysis, isLoading: false })
        } catch (error) {
          set({ error: "일기 분석에 실패했습니다.", isLoading: false })
          console.error("일기 분석 오류:", error)
        }
      },

      likeDiary: (id) => {
        set((state) => ({
          diaries: state.diaries.map((diary) => (diary.id === id ? { ...diary, likes: diary.likes + 1 } : diary)),
          currentDiary:
            state.currentDiary && state.currentDiary.id === id
              ? { ...state.currentDiary, likes: state.currentDiary.likes + 1 }
              : state.currentDiary,
        }))
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "diary-storage",
      partialize: (state) => ({
        diaries: state.diaries,
        currentDiary: state.currentDiary,
      }),
    },
  ),
)
