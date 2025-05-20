/**
 * 사용자 관련 API 호출 함수
 */

import type {
  LoginRequest,
  SignupRequest,
  UserInfoResponse,
  UserProfile,
  UserStats,
} from "@/types/user";
import api from "./axiosClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const getUserProfile = async (): Promise<UserInfoResponse> => {
  try {
    const response = await api.get("/auth/me");
    if (response.status !== 200) {
      throw new Error("사용자 활동 내역을 가져오는 중 오류 발생");
    }

    return response.data.result as UserInfoResponse;
  } catch (error) {
    console.error("사용자 활동 내역을 가져오는 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 사용자 통계를 가져오는 함수
 */
export async function getUserStats(
  period: "weekly" | "monthly" | "yearly" = "weekly"
): Promise<UserStats> {
  try {
    // 실제 구현에서는 fetch 사용
    // const response = await fetch(`${API_BASE_URL}/user/stats?period=${period}`)
    // if (!response.ok) throw new Error('Failed to fetch user stats')
    // return await response.json()

    // 목업 데이터 반환
    if (period === "weekly") {
      return {
        emotions: [
          { name: "슬픔", count: 2, percentage: 20 },
          { name: "평온", count: 3, percentage: 30 },
          { name: "불안", count: 1, percentage: 10 },
          { name: "화남", count: 1, percentage: 10 },
          { name: "기쁨", count: 3, percentage: 30 },
        ],
        period: "weekly",
        totalEntries: 10,
      };
    }

    return {
      emotions: [],
      period,
      totalEntries: 0,
    };
  } catch (error) {
    console.error(`${period} 사용자 통계를 가져오는 중 오류 발생:`, error);
    throw error;
  }
}

/**
 * 사용자 활동 내역을 가져오는 함수
 */
export async function getUserActivities(limit = 5): Promise<any[]> {
  try {
    // 실제 구현에서는 fetch 사용
    // const response = await fetch(`${API_BASE_URL}/user/activities?limit=${limit}`)
    // if (!response.ok) throw new Error('Failed to fetch user activities')
    // return await response.json()

    // 목업 데이터 반환
    return [
      {
        id: 1,
        type: "diary",
        title: "카페 501",
        description:
          "따뜻한 차 한 잔, 창밖의 풍경, 조용한 음악 같은 일상의 작은 행복에 마음을 전달한 감정입니다.",
        image: "/warm-cafe-corner.png",
        date: "2025.04.23",
      },
      {
        id: 2,
        type: "mission",
        title: "5분 명상하기",
        description: "조용한 곳에서 5분간 명상하며 마음 가다듬기",
        image: "/peaceful-meditation.png",
        date: "2025.04.22",
      },
    ];
  } catch (error) {
    console.error("사용자 활동 내역을 가져오는 중 오류 발생:", error);
    throw error;
  }
}

export const login = async (request: LoginRequest): Promise<number> => {
  const response = await api.post("/auth/login", request);
  return response.status;
};

export const signup = async (request: SignupRequest): Promise<number> => {
  const response = await api.post("/auth/signup", request);
  return response.status;
};

export const logout = async (): Promise<number> => {
  const response = await api.post("/auth/logout");
  return response.status;
};
