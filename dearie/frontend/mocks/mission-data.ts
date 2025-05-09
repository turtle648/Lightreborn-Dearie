/**
 * 미션 목업 데이터
 */

import type { Mission } from "@/types/mission"

export const mockMissions: Mission[] = [
  {
    id: 1,
    title: "오늘의 추천 미션",
    description: "창문 밖 풍경을 5분간 바라보며 깊게 호흡하기",
    difficulty: "쉬움",
    category: "mindfulness",
    icon: "Sparkles",
    color: "text-primary",
  },
  {
    id: 2,
    title: "감정 표현하기",
    description: "오늘 느낀 감정을 3가지 단어로 표현해보기",
    difficulty: "보통",
    category: "emotion",
    icon: "Award",
    color: "text-amber-500",
  },
  {
    id: 3,
    title: "5분 명상하기",
    description: "조용한 곳에서 5분간 명상하며 마음 가다듬기",
    difficulty: "보통",
    category: "mindfulness",
    icon: "Clock",
    color: "text-blue-500",
  },
  {
    id: 4,
    title: "감사일기 쓰기",
    description: "오늘 감사했던 일 3가지 적어보기",
    difficulty: "쉬움",
    category: "emotion",
    icon: "Sparkles",
    color: "text-green-500",
  },
  {
    id: 5,
    title: "산책하기",
    description: "15분 동안 천천히 걸으며 주변 환경 관찰하기",
    difficulty: "쉬움",
    category: "activity",
    icon: "Award",
    color: "text-violet-500",
  },
]
