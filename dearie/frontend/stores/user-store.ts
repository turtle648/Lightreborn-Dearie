"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfoResponse, UserProfile, UserStats } from "@/types/user";
import {
  getUserProfile,
  getUserStats,
  getUserActivities,
} from "@/apis/user-api";

interface UserState {
  profile: UserInfoResponse | null;
  stats: UserStats | null;
  activities: any[];
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchProfile: () => Promise<void>;
  fetchStats: (period: "weekly" | "monthly" | "yearly") => Promise<void>;
  fetchActivities: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      stats: null,
      activities: [],
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const profile = await getUserProfile();
          set({ profile, isLoading: false });
        } catch (error) {
          set({ error: "프로필을 불러오는데 실패했습니다.", isLoading: false });
          console.error("프로필 불러오기 오류:", error);
        }
      },

      fetchStats: async (period) => {
        set({ isLoading: true, error: null });
        try {
          const stats = await getUserStats(period);
          set({ stats, isLoading: false });
        } catch (error) {
          set({ error: "통계를 불러오는데 실패했습니다.", isLoading: false });
          console.error("통계 불러오기 오류:", error);
        }
      },

      fetchActivities: async () => {
        set({ isLoading: true, error: null });
        try {
          const activities = await getUserActivities();
          set({ activities, isLoading: false });
        } catch (error) {
          set({
            error: "활동 내역을 불러오는데 실패했습니다.",
            isLoading: false,
          });
          console.error("활동 내역 불러오기 오류:", error);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
);
