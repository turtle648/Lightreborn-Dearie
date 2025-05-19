"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { getCompletedMissionDetail } from "@/apis/mission-api";
import { MissionDetailResponseDTO, MissionExecutionType } from "@/types/mission";
import Image from "next/image";

// 필요한 타입 정의 (없다면 추가)
interface YoloDetectionResult {
  label: string;
  confidence: number;
}

interface ImageResultDetail {
  detections: YoloDetectionResult[];
  requiredObjectLabel: string;
  isVerified: boolean;
  s3ImageUrl: string;
}

interface MusicResultDetail {
  title: string;
  artist: string;
  thumbnailImageUrl: string;
  isVerified: boolean;
}

interface TextResultDetail {
  content: string;
  isVerified: boolean;
}

interface WalkResultDetail {
  id: number;
  startTime: string;
  endTime: string;
  duration: { seconds: number };
  pathFileUrl: string;
  snapshotUrl: string;
  createdAt: string;
  userMissionId: number;
  missionResultId: number;
  isVerified: boolean;
}

export default function MissionDetailPage() {
  const { userMissionId } = useParams();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type'); // URL에서 type 쿼리 파라미터 가져오기
  
  const [missionDetail, setMissionDetail] = useState<MissionDetailResponseDTO<any> | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissionDetail = async () => {
      setDetailLoading(true);
      setDetailError(null);
      try {
        if (userMissionId && typeParam) {
          const data = await getCompletedMissionDetail(Number(userMissionId), typeParam);
          console.log("미션 상세 데이터:", data); // 개발자 도구에서 확인용
          setMissionDetail(data);
        } else {
          throw new Error("미션 정보가 충분하지 않습니다");
        }
      } catch (error: any) {
        console.error("미션 상세 조회 오류:", error);
        setDetailError(error.message || "미션 정보를 가져오는 데 실패했습니다.");
      } finally {
        setDetailLoading(false);
      }
    };

    fetchMissionDetail();
  }, [userMissionId, typeParam]);

  if (detailLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AppLayout>
    );
  }

  if (detailError) {
    return (
      <AppLayout>
        <div className="flex flex-col justify-center items-center h-64 p-4">
          <div className="text-red-500 mb-4">{detailError}</div>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            뒤로 가기
          </button>
        </div>
      </AppLayout>
    );
  }

  if (!missionDetail) {
    return (
      <AppLayout>
        <div className="flex flex-col justify-center items-center h-64 p-4">
          <div className="text-gray-400 mb-4">미션 정보를 찾을 수 없습니다.</div>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            뒤로 가기
          </button>
        </div>
      </AppLayout>
    );
  }

  // 미션 타입별 UI 렌더링
  const renderMissionDetail = () => {
    const { missionExecutionType, detail } = missionDetail;
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {missionExecutionType === 'WALK' && '🚶 산책 미션'}
            {missionExecutionType === 'IMAGE' && '📸 이미지 미션'}
            {missionExecutionType === 'TEXT' && '✍️ 텍스트 미션'}
            {missionExecutionType === 'MUSIC' && '🎵 음악 미션'}
          </h2>
          {/* <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            detail.isVerified 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {detail.isVerified ? '✓ 검증 완료' : '⏳ 검증 대기중'}
          </div> */}
        </div>
        
        {missionExecutionType === 'WALK' && (
          <div className="space-y-6">
            {detail.snapshotUrl && (
              <div className="relative w-full h-80 rounded-xl overflow-hidden group">
                <Image 
                  src={detail.snapshotUrl} 
                  alt="산책 경로" 
                  fill 
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">시작 시간</p>
                <p className="font-medium">{new Date(detail.startTime).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">종료 시간</p>
                <p className="font-medium">{new Date(detail.endTime).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">소요 시간</p>
                <p className="font-medium">
                  {detail.duration 
                    ? `${Math.floor(detail.duration.seconds / 60)}분 ${detail.duration.seconds % 60}초` 
                    : '정보 없음'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {missionExecutionType === 'IMAGE' && (
          <div className="space-y-6">
            {detail.s3ImageUrl && (
              <div className="relative w-full h-80 rounded-xl overflow-hidden group">
                <Image 
                  src={detail.s3ImageUrl} 
                  alt="미션 이미지" 
                  fill 
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-2">필요한 객체</p>
              <p className="font-medium text-lg mb-4">{detail.requiredObjectLabel}</p>
              {detail.detections && detail.detections.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">감지된 객체</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.detections.map((detection: YoloDetectionResult, idx: number) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {detection.label} ({(detection.confidence * 100).toFixed(1)}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {missionExecutionType === 'TEXT' && (
          <div className="p-6 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-2">작성 내용</p>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {detail.content}
              </p>
            </div>
          </div>
        )}
        
        {missionExecutionType === 'MUSIC' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-6 bg-gray-50 rounded-xl">
              {detail.thumbnailImageUrl && (
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden flex-shrink-0 shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <Image 
                    src={detail.thumbnailImageUrl} 
                    alt="앨범 커버" 
                    fill 
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">곡 정보</p>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{detail.title}</h3>
                  <p className="text-lg text-gray-600">{detail.artist}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    🎵 음악 미션
                  </span>
                  {/* <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    detail.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {detail.isVerified ? '✓ 검증 완료' : '⏳ 검증 대기중'}
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>이전으로</span>
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{missionDetail.missionTitle}</h1>
            <div className="text-sm text-gray-500 mb-4">
              {new Date(missionDetail.date).toLocaleDateString('ko-KR', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
            <p className="text-gray-700 leading-relaxed">{missionDetail.missionContent}</p>
          </div>
        </div>
        
        {renderMissionDetail()}
      </div>
    </AppLayout>
  );
}