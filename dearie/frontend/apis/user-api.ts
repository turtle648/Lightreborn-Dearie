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

export const getUserProfile = async (): Promise<Omit<UserInfoResponse, 'id'>> => {
  try {
    console.log('getUserProfile 호출, 현재 localStorage:', localStorage.getItem('userId'));
    console.log('현재 쿠키:', document.cookie);
    
    const response = await api.get("/auth/me");
    console.log('getUserProfile 응답:', response.data);
    
    if (response.status !== 200) {
      throw new Error("사용자 활동 내역을 가져오는 중 오류 발생");
    }
    const { result } = response.data;
    // id 필드를 제외한 나머지 정보만 반환
    const { id, ...userInfo } = result;
    return userInfo;
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

export interface LoginResponse {
  id: string;
  name: string;
  nickName: string;
  profileImage: string;
  userActivity?: {
    diaryCount: number;
    completeMissionCount: number;
    consecutiveCount: number;
  };
}

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  console.log('로그인 시도:', request.id);
  
  const response = await api.post("/auth/login", request);
  const { result } = response.data;
  console.log('로그인 응답 전체:', response.data);
  
  // 로그인 응답에서 직접 userId 저장
  if (result && result.id) {
    console.log('로그인 성공, 토큰 설정 대기 중...');
    
    // 토큰이 설정될 때까지 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // 로그인 성공 후 바로 /auth/me API를 호출하여 실제 PK를 가져옵니다
      const userInfo = await api.get("/auth/me");
      const userData = userInfo.data.result;
      
      if (userData && userData.id) {
        // 백엔드에서 반환하는 id가 문자열이면 숫자로 변환
        const userId = typeof userData.id === 'string' ? 
          (isNaN(Number(userData.id)) ? 1 : Number(userData.id)) : // 숫자로 변환할 수 없으면 임시로 1 사용
          userData.id;
        
        console.log('userId 저장:', userId);
        localStorage.setItem('userId', String(userId));
      } else {
        // userData.id가 없으면 임시로 1 사용
        console.log('userData.id 없음, 임시 ID 사용: 1');
        localStorage.setItem('userId', '1');
      }
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      // 오류 발생시 임시로 1 사용
      console.log('오류 발생으로 임시 ID 사용: 1');
      localStorage.setItem('userId', '1');
    }
  } else {
    console.error('로그인 응답에 id가 없습니다:', result);
  }
  
  return result;
};

export const signup = async (request: SignupRequest): Promise<number> => {
  const response = await api.post("/auth/signup", request);
  return response.status;
};

export const logout = async (): Promise<number> => {
  const response = await api.post("/auth/logout");
  return response.status;
};
