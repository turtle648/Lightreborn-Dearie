/**
 * 사용자 목업 데이터
 */

import type { UserProfile, UserStats, UserActivity } from "@/types/user"

export const mockUserProfile: UserProfile = {
  name: "윌리",
  avatar: "/diverse-professional-profiles.png",
  streakDays: 8,
  totalDiaries: 42,
  completedMissions: 15,
}

export const mockUserStats: UserStats = {
  emotions: [
    { name: "슬픔", count: 2, percentage: 20 },
    { name: "평온", count: 3, percentage: 30 },
    { name: "불안", count: 1, percentage: 10 },
    { name: "화남", count: 1, percentage: 10 },
    { name: "기쁨", count: 3, percentage: 30 },
  ],
  period: "weekly",
  totalEntries: 10,
}

export const mockUserActivities: UserActivity[] = [
  {
    id: 1,
    type: "diary",
    title: "카페 501",
    description: "따뜻한 차 한 잔, 창밖의 풍경, 조용한 음악 같은 일상의 작은 행복에 마음을 전달한 감정입니다.",
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
]
