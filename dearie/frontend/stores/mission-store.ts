"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MissionCategory, DailyMissionResponseDTO, RecentMissionResponseDTO, MissionDetailResponseDTO } from "@/types/mission";
import {
  getDailyMissions,
  updateMissionStatus,
  endWalk,
  WalkRecordResponse,
  getCompletedMission,
  getCompletedMissionDetail,
} from "@/apis/mission-api";

interface LatLng {
  lat: number;
  lng: number;
}

interface MissionStore {
  all: DailyMissionResponseDTO[]    // 5개 전체
  preview: DailyMissionResponseDTO[]// 미리보기용 (2개)
  loading: boolean
  error: string | null

  // 최근 완료 미션
  recentMissions: RecentMissionResponseDTO[]
  missionDetail: MissionDetailResponseDTO<any> | null
  recentLoading: boolean
  detailLoading: boolean
  recentError: string | null
  detailError: string | null
  hasMore: boolean
  setHasMore: (hasMore: boolean) => void

  // 기존 미션 API
  fetchAll: (limit?: number) => Promise<void>;
  fetchDaily: (limit?: number) => Promise<void>;
  setStatus: (id: number, completed: boolean) => Promise<void>;

  fetchRecentMissions: (page?: number) => Promise<void>
  fetchMissionDetail: (userMissionId: number) => Promise<void>

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

// 미션 id별 메타 정보 할당 함수
function getMissionMetaById(missionId: number) {
  if (missionId === 2) {
    return { icon: "Music", color: "text-blue-500", route: "/mission/music" };
  }
  if ([9, 12, 25].includes(missionId)) {
    return { icon: "Footprints", color: "text-green-500", route: "/mission/walking" };
  }
  if ([8, 10, 14].includes(missionId)) {
    return { icon: "Camera", color: "text-violet-500", route: "/mission/photo" };
  }
  // 기본: 텍스트 미션
  return { icon: "Notebook", color: "text-red-500", route: "/mission/text" };
}

export const useMissionStore = create<MissionStore>()(
  persist(
    (set, get) => ({
      // 초기 state
      all: [],
      preview: [],
      loading: false,
      error: null,

      recentMissions: [],
      missionDetail: null,
      recentLoading: false,
      detailLoading: false,
      recentError: null,
      detailError: null,

      hasMore: true,
      setHasMore: (hasMore: boolean) => set({ hasMore }),

      fetchAll: async (limit = 5) => {
        set({ loading: true, error: null });
        try {
          const data = await getDailyMissions(limit);
          // id별로 icon, color, route 할당
          const withMeta = data.map(m => ({ ...m, ...getMissionMetaById(m.missionId) }));
          set({ preview: withMeta });
        } catch (e: any) {
          set({ error: e.message || '미션 불러오기 실패' });
        } finally {
          set({ loading: false });
        }
      },

      fetchDaily: async (limit = 2) => {
        set({ loading: true, error: null });
        try {
          const data = await getDailyMissions(limit);
          // id별로 icon, color, route 할당
          const withMeta = data.map(m => ({ ...m, ...getMissionMetaById(m.missionId) }));
          set({ preview: withMeta });
        } catch (e: any) {
          set({ error: e.message || '미션 불러오기 실패' });
        } finally {
          set({ loading: false });
        }
      },

      setStatus: async (id, completed) => {
        set({ loading: true, error: null });
        try {
          const success = await updateMissionStatus(id, completed);
          if (success) {
            set(state => ({
              all: state.all.map(m =>
                m.id === id ? { ...m, isCompleted: completed } : m
              ),
              preview: state.preview.map(m =>
                m.id === id ? { ...m, isCompleted: completed } : m
              ),
            }));
          } else {
            throw new Error('미션 상태 업데이트 실패');
          }
        } catch (e: any) {
          set({ error: e.message || '미션 상태 업데이트 중 오류' });
        } finally {
          set({ loading: false });
        }
      },

      fetchRecentMissions: async (page = 0) => {
        set({ recentLoading: true, recentError: null });
      
        try {
          const result = await getCompletedMission(page);
      
          set(state => {
            const existingIds = new Set(state.recentMissions.map(m => m.userMissionId));
            const newMissions = result.filter(m => !existingIds.has(m.userMissionId));
            return {
              recentMissions: page === 0
                ? result
                : [...state.recentMissions, ...newMissions],
              hasMore: result.length === 5, // 5개 미만이면 더 이상 없음
            };
          });
        } catch (e: any) {
          set({ recentError: e.message || "최근 미션 불러오기 실패" });
        } finally {
          set({ recentLoading: false });
        }
      },
      

      fetchMissionDetail: async (userMissionId) => {
        set({ detailLoading: true, detailError: null });
        try {
          const detail = await getCompletedMissionDetail(userMissionId);
          set({ missionDetail: detail });
        } catch (e: any) {
          set({ detailError: e.message || "미션 상세 조회 실패" });
        } finally {
          set({ detailLoading: false });
        }
      },

      walkRecord: undefined,
      walkLoading: false,
      walkError: undefined,

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
