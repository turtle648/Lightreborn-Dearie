/**
 * 사용자 관련 타입 정의
 */

export interface UserProfile {
  name: string;
  avatar?: string;
  streakDays: number;
  totalDiaries: number;
  completedMissions: number;
}

export interface UserStats {
  emotions: {
    name: string;
    count: number;
    percentage: number;
  }[];
  period: "weekly" | "monthly" | "yearly";
  totalEntries: number;
}

export interface UserActivity {
  id: number;
  type: "diary" | "mission";
  title: string;
  description: string;
  image?: string;
  date: string;
}

export interface SignupRequest {
  id: string;
  password: string;
  name: string;
  nickName: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  emergencyContact?: string;
}

export interface LoginRequest {
  id: string;
  password: string;
}

export interface UserInfoResponse {
  id: string;
  name: string;
  nickname: string;
  profileImage: string;
  userActivity: UserActivity;
}

export interface UserActivity {
  diaryCount: number;
  completeMissionCount: number;
  consecutiveCount: number;
}
