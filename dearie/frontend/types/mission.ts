/**
 * 미션 관련 타입 정의
 */

export type MissionCategory = 'STATIC' | 'DYNAMIC';
export type MissionResultType = 'TEXT' | 'IMAGE' | 'MUSIC' | 'WALK';

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

export interface DailyMissionResponseDTO {
  /** user_missions.id */
  id: number;
  /** missions.id */
  missionId: number;
  /** missions.mission_title */
  missionTitle: string;
  /** missions.content */
  content: string;
  /** user_missions.is_completed */
  isCompleted: boolean;
  /** mission_type.type */
  missionType: MissionCategory;
  /** 아이콘 이름 (예: 'Award', 'Sparkles' 등) */
  icon: string;
  /** Tailwind 색상 클래스 (예: 'text-orange-500') */
  color: string;
  /** 라우트 경로 (예: '/mission/walking') */
  route: string;
}

export interface RecentMissionResponseDTO {
  userMissionId: number
  title: string
  date: string // ISO string
  content: string
  missionType: MissionCategory
  resultType: MissionResultType
  imageUrl: string | null
}

export interface MissionDetailResponseDTO<T> {
  missionTitle: string
  missionContent: string
  date: string // ISO string
  resultType: MissionResultType
  detail: T
}