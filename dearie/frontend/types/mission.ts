/**
 * 미션 관련 타입 정의
 */

export type MissionCategory = 'STATIC' | 'DYNAMIC';
export type MissionExecutionType = 'TEXT' | 'IMAGE' | 'MUSIC' | 'WALK';
export type requiredObjectLabel = 'flower' | 'leaves' | 'bench' | 'cup';

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
  missionExecutionType: MissionExecutionType;
  requiredObjectLabel: requiredObjectLabel;
}

export interface RecentMissionResponseDTO {
  userMissionId: number
  title: string
  date: string // ISO string
  content: string
  missionType: MissionCategory
  missionExecutionType: MissionExecutionType
  imageUrl: string | null
}

export interface MissionDetailResponseDTO<T> {
  missionTitle: string
  missionContent: string
  date: string // ISO string
  missionExecutionType: MissionExecutionType
  detail: T
}

export interface MissionCompletionRequest {
  missionId: number;
  missionExecutionType: "WALK" | "IMAGE" | "TEXT" | "MUSIC";

  // 이미지 미션
  imageFile?: File;
  imageKeyword?: string;
  longitude?: number;
  latitude?: number;

  // 음악 미션
  title?: string;
  artist?: string;
  musicImageUrl?: string;

  // 텍스트 미션
  textContent?: string;

  // 산책 미션
  startTime?: string; // ISO string
  endTime?: string;   // ISO string
  pathJson?: string;
  distance?: number;

  // snapshotFile 따로 전달
  snapshotFile?: File;
}
