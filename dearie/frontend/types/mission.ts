/**
 * 미션 관련 타입 정의
 */

export type MissionCategory = "mindfulness" | "emotion" | "activity"
export type MissionDifficulty = "쉬움" | "보통" | "어려움"

export interface Mission {
  id: number
  title: string
  description: string
  difficulty: string
  category: MissionCategory
  icon: string
  color: string
  route?: string
}
