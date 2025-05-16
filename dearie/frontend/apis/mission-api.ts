/**
 * 미션 관련 API 호출 함수
 */
import axios from "axios"
import type { Mission, MissionCategory, DailyMissionResponseDTO } from "@/types/mission"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// 쿠키 실어서 요청
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

interface BaseResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * 오늘의 미션을 가져오기기
 */
export async function getDailyMissions(limit: number): Promise<DailyMissionResponseDTO[]> {
  const res = await api.get<BaseResponse<DailyMissionResponseDTO[]>>(
    '/missions/today'
  )
  return res.data.result.slice(0, limit)
}

/**
 * 미션 완료 상태를 업데이트하는 함수
 */
export async function updateMissionStatus(id: number, completed: boolean): Promise<boolean> {
  try {
    // 실제 구현에서는 fetch 사용
    // const response = await fetch(`${API_BASE_URL}/missions/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ completed })
    // })
    // if (!response.ok) throw new Error('Failed to update mission status')
    // return true

    // 오프라인 지원을 위한 로컬 스토리지 저장
    if (typeof window !== "undefined") {
      const completedMissions = localStorage.getItem("completedMissions")
      const missions = completedMissions ? (JSON.parse(completedMissions) as number[]) : []

      if (completed && !missions.includes(id)) {
        missions.push(id)
      } else if (!completed) {
        const index = missions.indexOf(id)
        if (index !== -1) missions.splice(index, 1)
      }

      localStorage.setItem("completedMissions", JSON.stringify(missions))
    }

    return true
  } catch (error) {
    console.error(`미션 ${id}의 상태를 업데이트하는 중 오류 발생:`, error)
    return false
  }
}

export interface WalkRecordResponse {
  id: number;
  userMissionId: number;
  startTime: string;
  endTime?: string;
  pathJson: string;
  snapshotUrl: string;
}

/**
 * 산책 기록 종료
 * POST {API_BASE_URL}/walk-records/{userMissionId}/end
 */
export async function endWalk(
  userMissionId: number,
  path: { lat: number; lng: number }[],
  snapshot: Blob,
  endTime?: Date
): Promise<WalkRecordResponse> {
  const form = new FormData();
  form.append("pathData", JSON.stringify(path));
  form.append("snapshot", snapshot, "snapshot.png");

  const params = endTime
    ? { endTime: endTime.toISOString() }
    : undefined;

  const { data } = await axios.post<{ data: WalkRecordResponse }>(
    `${API_BASE_URL}/walk-records/${userMissionId}/end`,
    form,
    {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.data;
}