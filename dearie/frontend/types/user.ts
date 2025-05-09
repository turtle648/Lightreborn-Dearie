/**
 * 사용자 관련 타입 정의
 */

export interface UserProfile {
  name: string
  avatar?: string
  streakDays: number
  totalDiaries: number
  completedMissions: number
}

export interface UserStats {
  emotions: {
    name: string
    count: number
    percentage: number
  }[]
  period: "weekly" | "monthly" | "yearly"
  totalEntries: number
}

export interface UserActivity {
  id: number
  type: "diary" | "mission"
  title: string
  description: string
  image?: string
  date: string
}
