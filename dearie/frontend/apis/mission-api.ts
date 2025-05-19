/**
 * 미션 관련 API 호출 함수
 */
import axios from "axios"
import type { Mission, MissionCategory, DailyMissionResponseDTO, RecentMissionResponseDTO, MissionDetailResponseDTO, MissionCompletionRequest } from "@/types/mission"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// 쿠키 실어서 요청
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

interface BaseResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * 오늘의 미션을 가져오기기
 */
export async function getDailyMissions(limit: number): Promise<DailyMissionResponseDTO[]> {
  const res = await api.get<BaseResponse<DailyMissionResponseDTO[]>>(
    '/missions/today'
  )
  return res.data.result.slice(0, limit)
}

/**
 * 미션 완료 상태를 업데이트하는 함수
 */
export async function submitMissionCompletion(userMissionId: number,
  request: MissionCompletionRequest
): Promise<BaseResponse<any>> {
  const formData = new FormData();

  // JSON 부분
  formData.append("missionId", String(request.missionId));
  formData.append("missionExecutionType", request.missionExecutionType);

  // 이미지 파일 추가
  if (request.imageFile) {
    console.log("이미지 파일 정보:", {
      name: request.imageFile.name,
      type: request.imageFile.type,
      size: request.imageFile.size
    });
    
    // 다른 키 이름으로도 시도 (잠재적 백엔드 요구사항에 맞추기)
    formData.append("imageFile", request.imageFile, request.imageFile.name);
  } else {
    console.error("이미지 파일이 없습니다!");
  }

  if (request.imageKeyword) formData.append("imageKeyword", request.imageKeyword);
  if (request.longitude) formData.append("longitude", String(request.longitude));
  if (request.latitude) formData.append("latitude", String(request.latitude));

  if (request.title) formData.append("title", request.title);
  if (request.artist) formData.append("artist", request.artist);
  if (request.musicImageUrl) formData.append("musicImageUrl", request.musicImageUrl);

  if (request.textContent) formData.append("textContent", request.textContent);

  if (request.startTime) formData.append("startTime", request.startTime);
  if (request.endTime) formData.append("endTime", request.endTime);
  if (request.pathJson) formData.append("pathJson", request.pathJson);
  if (request.distance !== undefined) formData.append("distance", String(request.distance));

  // 파일
  if (request.snapshotFile) {
    formData.append("snapshotFile", request.snapshotFile);
  }

  const response = await api.post(`/missions/${userMissionId}/completions`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
  
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

// ✅ 최근 완료한 미션 목록 조회 (페이지네이션)
export async function getCompletedMission(limit: number = 5): Promise<RecentMissionResponseDTO[]> {
  const response = await api.get<BaseResponse<RecentMissionResponseDTO[]>>(`/missions/recent-success?page=${limit}`)
  return response.data.result
}

// ✅ 완료한 미션 상세 조회
export async function getCompletedMissionDetail(
  userMissionId: number, 
  missionExecutionType: string
): Promise<MissionDetailResponseDTO<any>> {
  const response = await api.get<BaseResponse<MissionDetailResponseDTO<any>>>(
    `/missions/recent-success/${userMissionId}/${missionExecutionType}`
  );
  return response.data.result;
}
