"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Mission, MissionCategory } from "@/types/mission";
import {
  getMissions,
  getDailyMissions,
  updateMissionStatus,
  WalkRecordResponse,
  endWalk,
} from "@/apis/mission-api";

interface LatLng {
  lat: number;
  lng: number;
}

interface MissionStore {
  missions: Mission[];
  daily: Mission[];
  loading: boolean;
  error?: string;

  // 기존 미션 API
  fetchAll: (category?: MissionCategory) => Promise<void>;
  fetchDaily: (limit?: number) => Promise<void>;
  setStatus: (id: number, completed: boolean) => Promise<void>;

  // 산책 기록 관련 상태
  walkRecord?: WalkRecordResponse;
  walkLoading: boolean;
  walkError?: string;

  stopRecording: (
    userMissionId: number,
    path: LatLng[],
    snapshot: Blob,
    endTime?: Date
  ) => Promise<void>;
}

export const useMissionStore = create<MissionStore>()(
  persist(
    (set, get) => ({
      // 초기 state
      missions: [],
      daily: [],
      loading: false,
      error: undefined,
      walkRecord: undefined,
      walkLoading: false,
      walkError: undefined,

      // 미션 CRUD 액션
      fetchAll: async (category) => {
        set({ loading: true, error: undefined });
        try {
          const list = await getMissions(category);
          set({ missions: list });
        } catch (e: any) {
          set({ error: e.message || "미션 불러오기 실패" });
        } finally {
          set({ loading: false });
        }
      },

      fetchDaily: async (limit = 2) => {
        set({ loading: true, error: undefined });
        try {
          const list = await getDailyMissions(limit);
          set({ daily: list });
        } catch (e: any) {
          set({ error: e.message || "오늘의 미션 불러오기 실패" });
        } finally {
          set({ loading: false });
        }
      },

      setStatus: async (id, completed) => {
        set({ loading: true, error: undefined });
        try {
          await updateMissionStatus(id, completed);
          // 상태 변경 후 리스트 재조회
          get().fetchAll();
        } catch (e: any) {
          set({ error: e.message || "미션 상태 업데이트 실패" });
        } finally {
          set({ loading: false });
        }
      },

      stopRecording: async (userMissionId, path, snapshot, endTime) => {
        set({ walkLoading: true, walkError: undefined });
        try {
          const dto = await endWalk(userMissionId, path, snapshot, endTime);
          set({ walkRecord: dto });
        } catch (e: any) {
          set({ walkError: e.message || "산책 종료 실패" });
        } finally {
          set({ walkLoading: false });
        }
      },
    }),
    {
      name: "mission-store",
      // // 저장하고 싶지 않은 상태 제외
      // partialize: state => ({
      //   missions: state.missions,
      //   daily: state.daily,
      //   walkRecord: state.walkRecord,    // ← 추가
      // })
    }
  )
);
