/**
 * 미션 관련 API 호출 함수
 */
import axios from "axios"
import type { Mission, MissionCategory } from "@/types/mission"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

/**
 * 미션 목록을 가져오는 함수
 */
export async function getMissions(category?: MissionCategory): Promise<Mission[]> {
  try {
    // 실제 구현에서는 fetch 사용
    // const url = category
    //   ? `${API_BASE_URL}/missions?category=${category}`
    //   : `${API_BASE_URL}/missions`
    // const response = await fetch(url)
    // if (!response.ok) throw new Error('Failed to fetch missions')
    // return await response.json()

    // 목업 데이터 반환
    const allMissions = getMockMissions()
    return category ? allMissions.filter((mission) => mission.category === category) : allMissions
  } catch (error) {
    console.error("미션 목록을 가져오는 중 오류 발생:", error)
    return getMockMissions()
  }
}

/**
 * 오늘의 추천 미션을 가져오는 함수
 */
export async function getDailyMissions(limit = 2): Promise<Mission[]> {
  try {
    // 실제 구현에서는 fetch 사용
    // const response = await fetch(`${API_BASE_URL}/missions/daily?limit=${limit}`)
    // if (!response.ok) throw new Error('Failed to fetch daily missions')
    // return await response.json()

    // 목업 데이터에서 랜덤으로 선택
    const allMissions = getMockMissions()
    return allMissions.slice(0, limit)
  } catch (error) {
    console.error("오늘의 미션을 가져오는 중 오류 발생:", error)
    return getMockMissions().slice(0, limit)
  }
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

// 목업 데이터
function getMockMissions(): Mission[] {
  return [
    {
      id: 1,
      title: "오늘의 추천 미션",
      description: "창문 밖 풍경을 5분간 바라보며 깊게 호흡하기",
      difficulty: "쉬움",
      category: "mindfulness",
      icon: "Sparkles",
      color: "text-primary",
      route: "/mission/mindfulness",
    },
    {
      id: 2,
      title: "감정 표현하기",
      description: "오늘 느낀 감정을 3가지 단어로 표현해보기",
      difficulty: "보통",
      category: "emotion",
      icon: "Award",
      color: "text-amber-500",
      route: "/mission/emotion",
    },
    {
      id: 3,
      title: "5분 명상하기",
      description: "조용한 곳에서 5분간 명상하며 마음 가다듬기",
      difficulty: "보통",
      category: "mindfulness",
      icon: "Clock",
      color: "text-blue-500",
      route: "/mission/meditation",
    },
    {
      id: 4,
      title: "감사일기 쓰기",
      description: "오늘 감사했던 일 3가지 적어보기",
      difficulty: "쉬움",
      category: "emotion",
      icon: "Sparkles",
      color: "text-green-500",
      route: "/mission/gratitude",
    },
    {
      id: 5,
      title: "산책하기",
      description: "15분 동안 천천히 걸으며 주변 환경 관찰하기",
      difficulty: "쉬움",
      category: "activity",
      icon: "Award",
      color: "text-violet-500",
      route: "/mission/walking",
    },
  ]
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