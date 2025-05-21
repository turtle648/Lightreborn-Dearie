"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Square, Save, AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { WalkingMapBox, type LatLng } from "@/components/feature/mission/walking-mapbox";
import { WalkingSummary } from "@/components/feature/mission/walking-summary";
import type { MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { useMissionStore } from "@/stores/mission-store";
import { submitMissionCompletion } from "@/apis/mission-api";
import { MissionCompletionRequest } from "@/types/mission";
import axios from "axios";

export default function WalkingMissionPage() {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);

  const [userMissionId, setUserMissionId] = useState<number | null>(null);
  const [missionId, setMissionId] = useState<number | null>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// 쿠키 실어서 요청
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

  // 캡처 관련 디버깅용 상태와 캡처 성공 여부를 직접 확인할 수 있는 UI 추가
  const [debugInfo, setDebugInfo] = useState<string>("");

  const [capturedMapBlob, setCapturedMapBlob] = useState<Blob | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  // 맵 렌더링 완료 상태 추적
  const mapRenderedRef = useRef<boolean>(false);
  const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stopWalkingTimeRef = useRef<number>(0);
  const [capturedMapUrl, setCapturedMapUrl] = useState<string | null>(null);


  const { all, preview, fetchAll, setStatus } = useMissionStore();

  // URL 파라미터 추출
  useEffect(() => {
    const url = new URL(window.location.href);
    const userMissionIdParam = url.searchParams.get("userMissionId");
    const missionIdParam = url.searchParams.get("missionId");

    const parsedUserMissionId = userMissionIdParam ? Number(userMissionIdParam) : null;
    const parsedMissionId = missionIdParam ? Number(missionIdParam) : null;

    if (!parsedUserMissionId || isNaN(parsedUserMissionId)) {
      router.push(ROUTES.MISSION.LIST);
      return;
    }

    setUserMissionId(parsedUserMissionId);
    setMissionId(parsedMissionId);
  }, [router]);

  // 미션 데이터 조회
  const mission = useMemo(() => {
    if (!userMissionId) return null;
    return all.find(m => m.id === userMissionId) || preview.find(m => m.id === userMissionId);
  }, [all, preview, userMissionId]);

  useEffect(() => {
    if (!mission) fetchAll();
  }, [mission, fetchAll]);

  // 초기 위치 설정
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setCurrentPosition({ lat: 35.0883, lng: 128.8442 });
      return;
    }
    
    if (!navigator.geolocation) {
      setLocationError("브라우저에서 위치 정보 지원 안 함");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      pos => setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => {
        let msg = "위치 정보 에러";
        if (err.code === 1) { msg = "퍼미션 거부"; setPermissionDenied(true); }
        else if (err.code === 2) msg = "위치 사용 불가";
        else if (err.code === 3) msg = "요청 타임아웃";
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // 맵 렌더링 완료 확인용 이펙트 - 맵 초기 렌더링 감지
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    
    const checkMapRendered = () => {
      mapRenderedRef.current = true;
    };
    
    map.once('idle', checkMapRendered);
    
    return () => {
      map.off('idle', checkMapRendered);
    };
  }, []);

  // 거리 계산
  const calculateDistance = (p1: any, p2: any) => {
    const R = 6371e3;
    const φ1 = (p1.lat * Math.PI) / 180;
    const φ2 = (p2.lat * Math.PI) / 180;
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
    const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 산책 시작
  const startWalking = () => {
    if (!currentPosition) return alert("위치 로딩 중...");
    setIsTracking(true);
    setStartTime(new Date());
    setPath([currentPosition]);
    setIsCaptured(false);
    setCapturedMapBlob(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => {
        const np = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentPosition(np);
        setPath(prev => {
          const last = prev[prev.length - 1];
          const dist = calculateDistance(last, np);
          if (dist > 2) {
            const next = [...prev, np];
            const total = next.slice(1).reduce((sum, _, i) => sum + calculateDistance(next[i], next[i + 1]), 0);
            setDistance(total);
            return next;
          }
          return prev;
        });
      },
      () => { alert("추적 에러"); stopWalking(); },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
    );

    timerRef.current = setInterval(() => {
      setDuration(d => (d + 1 >= 900 ? (stopWalking(), 900) : d + 1));
    }, 1000);
  };

  // 맵 캡처 방식을 완전히 대체하는 방법 (백업 캡처)
  const createPathImage = () => {
    try {
      console.log("경로 이미지 생성 시작");
      setIsCapturing(true);
      
      // 새 캔버스 생성 (맵과 독립적)
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("캔버스 컨텍스트 생성 실패");
        setIsCapturing(false);
        return;
      }
      
      // 배경색 설정 (OpenStreetMap 유사 색상)
      ctx.fillStyle = '#f2efe9';  // 옅은 베이지 (OSM 배경색과 유사)
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 경로 좌표를 캔버스에 맞게 변환
      const padding = 40;
      const mapWidth = canvas.width - padding * 2;
      const mapHeight = canvas.height - padding * 2;
      
      // 경로 범위 계산
      const minLat = Math.min(...path.map(p => p.lat));
      const maxLat = Math.max(...path.map(p => p.lat));
      const minLng = Math.min(...path.map(p => p.lng));
      const maxLng = Math.max(...path.map(p => p.lng));
      
      // 좌표 변환 함수 (경로 좌표 -> 캔버스 픽셀)
      const toPixelX = (lng: number) => {
        return padding + ((lng - minLng) / (maxLng - minLng || 0.0001)) * mapWidth;
      };
      
      const toPixelY = (lat: number) => {
        // Y축은 반전 (위도가 높을수록 캔버스 상단)
        return padding + ((maxLat - lat) / (maxLat - minLat || 0.0001)) * mapHeight;
      };
      
      // 경로 그리기
      ctx.beginPath();
      if (path.length > 0) {
        ctx.moveTo(toPixelX(path[0].lng), toPixelY(path[0].lat));
        path.slice(1).forEach(point => {
          ctx.lineTo(toPixelX(point.lng), toPixelY(point.lat));
        });
      }
      
      // 경로 스타일 설정
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ff5555';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // 시작점 그리기 (녹색)
      if (path.length > 0) {
        ctx.beginPath();
        ctx.arc(toPixelX(path[0].lng), toPixelY(path[0].lat), 8, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // 종료점 그리기 (빨간색)
      if (path.length > 1) {
        ctx.beginPath();
        const lastPoint = path[path.length - 1];
        ctx.arc(toPixelX(lastPoint.lng), toPixelY(lastPoint.lat), 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // 맵 이미지 추가 (단순 그리드)
      ctx.strokeStyle = '#dddddd';
      ctx.lineWidth = 0.5;
      
      // 수평선
      for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        const y = padding + (i * mapHeight / 10);
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }
      
      // 수직선
      for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        const x = padding + (i * mapWidth / 10);
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvas.height - padding);
        ctx.stroke();
      }
      
      // 북쪽 표시
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText('N', canvas.width / 2, padding - 10);
      
      // 경로 거리 표시
      ctx.font = '12px Arial';
      ctx.fillStyle = '#555555';
      ctx.textAlign = 'center';
      ctx.fillText(`${(distance / 1000).toFixed(2)}km`, canvas.width / 2, canvas.height - padding / 2);
      
      // 저작권 표시 추가
      ctx.font = '10px Arial';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'right';
      ctx.fillText('© Created by Walking App', canvas.width - 10, canvas.height - 5);
      
      // 이미지 생성
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("✅ 경로 이미지 생성 성공:", blob.size, "bytes");
            setCapturedMapBlob(blob);
            setIsCaptured(true);
            
            // 미리보기용 URL 생성 (디버깅)
            const url = URL.createObjectURL(blob);
            setCapturedMapUrl(url);
            setDebugInfo(`직접 그린 경로 이미지: ${blob.size} bytes`);
          } else {
            console.error("❌ Blob 생성 실패");
            setDebugInfo("직접 그린 이미지 Blob 생성 실패");
          }
          setIsCapturing(false);
        },
        "image/jpeg",
        0.9
      );
    } catch (error) {
      console.error("경로 이미지 생성 오류:", error);
      setIsCapturing(false);
      setDebugInfo(`경로 이미지 생성 오류: ${error}`);
    }
  };

  // 산책 종료 함수 수정
  const stopWalking = () => {
    setIsTracking(false);
    setIsCompleted(true);
    setEndTime(new Date());

    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (path.length < 2) return;

    // 맵 기반 캡처가 아닌, 직접 경로만 그린 이미지 생성
    setIsCapturing(true);
    
    // 경로 전체 bounds 계산
    const bounds = path.reduce(
      (b: maplibregl.LngLatBounds, p) => b.extend([p.lng, p.lat]),
      new maplibregl.LngLatBounds([path[0].lng, path[0].lat], [path[0].lng, path[0].lat])
    );

    const map = mapRef.current?.getMap();
    if (map) {
      // 지도 뷰 맞추기 (애니메이션 없이 즉시)
      map.fitBounds(bounds, { padding: 40, duration: 0 });
    }
    
    // 바로 직접 경로 이미지 생성으로 진행
    setTimeout(() => {
      createPathImage();
    }, 500);
  };

  // 미션 결과 저장 - 캡처 없이도 저장 가능
  // 미션 결과 저장 - 이미지 포함해서 저장
const handleSave = async () => {
  if (!userMissionId || !missionId) {
    alert("저장 조건이 충족되지 않았습니다.");
    return;
  }

  setIsSaving(true);

  try {
    // 이미지가 없으면 다시 생성
    if (!capturedMapBlob) {
      await createPathImage();
    }

    if (!capturedMapBlob) {
      alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
      setIsSaving(false);
      return;
    }

    const pathJson = JSON.stringify(path);

    // 파일 객체 생성
    const imageFile = new File([capturedMapBlob], "walk_path.jpg", { 
      type: "image/jpeg", 
      lastModified: Date.now() 
    });

    // 직접 FormData 구성
    const formData = new FormData();
    formData.append("missionId", missionId.toString());
    formData.append("missionExecutionType", "WALK");
    formData.append("startTime", startTime?.toISOString() || "");
    formData.append("endTime", endTime?.toISOString() || "");
    formData.append("pathJson", pathJson);
    formData.append("distance", distance.toString());
    
    // 중요: snapshotFile은 RequestPart로 별도 처리되므로 여기에 추가
    formData.append("snapshotFile", imageFile);

    console.log("FormData 구성 완료, 항목 확인:");
    for (const [key, value] of formData.entries()) {
      console.log(`- ${key}: ${value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value}`);
    }

    try {
      // 직접 API 호출
      const response = await api.post(`/missions/${userMissionId}/completions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("미션 완료 응답:", response.data);
      router.push(`/mission/recent-success/${userMissionId}?type=WALK`);
    } catch (error) {
      console.error("미션 제출 실패", error);
      
      // 실패 시 추가 정보 기록
      if (axios.isAxiosError(error)) {
        console.error("상태 코드:", error.response?.status);
        console.error("응답 데이터:", error.response?.data);
      }
      
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error("산책 미션 제출 처리 오류", error);
    alert("저장 중 오류가 발생했습니다.");
  } finally {
    setIsSaving(false);
  }
};

  // 위치 권한 재요청
  const requestLocationPermission = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationError(null);
        setPermissionDenied(false);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <AppLayout showBack title="산책하기 미션" rightAction={null}>
      <div className="flex flex-col h-full p-4 pb-8 bg-white" >
        <Card className="mb-4 shadow-md overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="h-[50vh] w-full relative" >
              {isTracking && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-soft px-6 py-3 rounded-full animate-pulse">
                    <span className="text-white">기록 중...</span>
                  </div>
                </div>
              )}
              {/* 핵심 변경: 무조건 WalkingMapBox를 계속 표시하고, 캡처된 결과만 저장 */}
              <WalkingMapBox
                ref={mapRef}
                currentPosition={currentPosition}
                path={path}
                isTracking={isTracking}
                isCompleted={isCompleted}
              />
              
              {/* 캡처 중 표시 */}
              {isCapturing && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center loading-indicator">
                  <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center">
                    <RefreshCw className="animate-spin mr-2 text-blue-500" />
                    <span>경로 이미지 생성 중...</span>
                  </div>
                </div>
              )}
              
              {/* 디버깅 정보 표시 (개발용) */}
              {debugInfo && (
                <div className="absolute bottom-2 left-2 right-2 bg-white/80 p-2 text-xs z-30 rounded debug-info">
                  {debugInfo}
                </div>
              )}
            </div>
            {locationError && (
              <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center p-6">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <p className="mb-4">{locationError}</p>
                {permissionDenied ? (
                  <Button onClick={() => router.push(ROUTES.MISSION.LIST)}>미션 목록으로</Button>
                ) : (
                  <Button onClick={requestLocationPermission}>권한 재요청</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <WalkingSummary
          startTime={isTracking || isCompleted ? startTime : null}
          endTime={isCompleted ? endTime : null}
          duration={isTracking || isCompleted ? duration : 0}
          distance={isTracking || isCompleted ? distance : 0}
        />

        <div className="mt-4 flex justify-center">
          {isCompleted ? (
            <Button
              onClick={handleSave}
              className="px-8 py-6 rounded-full bg-gradient-soft"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <RefreshCw className="animate-spin mr-2" />
                  저장 중...
                </div>
              ) : (
                <>
                  <Save className="mr-2" /> 저장하기
                </>
              )}
            </Button>
          ) : isTracking ? (
            <Button onClick={stopWalking} className="px-8 py-6 rounded-full bg-red-500">
              <Square className="mr-2" /> 산책 완료
            </Button>
          ) : (
            <Button
              onClick={startWalking}
              disabled={!currentPosition || !!locationError}
              className="px-8 py-6 rounded-full bg-gradient-soft"
            >
              <Play className="mr-2" /> 산책 시작
            </Button>
          )}
        </div>
        
        {/* 캡처 결과 미리보기 (개발용) */}
        {capturedMapUrl && process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-20 right-4 bg-white p-2 rounded-lg shadow-lg z-50">
            <p className="text-xs mb-1">캡처된 이미지 (디버깅용):</p>
            <img 
              src={capturedMapUrl} 
              alt="캡처된 경로 이미지" 
              style={{maxWidth: "150px", maxHeight: "150px", border: "1px solid #ddd"}} 
            />
          </div>
        )}
      </div>
      
      {/* CSS 수정을 위한 스타일 적용 */}
      <style jsx global>{`
        /* 모바일 화면 최적화를 위한 CSS 변수 */
        :root {
          --vh: 1vh;
        }
        
        /* 맵 컨테이너의 가시성 보장 */
        .maplibregl-map {
          visibility: visible !important;
          display: block !important;
        }
        
        /* 검은색 배경 요소 제거 */
        div[style*="background-color: rgb(0, 0, 0)"],
        div[style*="background: rgb(0, 0, 0)"],
        div[style*="background-color: black"],
        div[style*="background: black"] {
          background-color: transparent !important;
          background: transparent !important;
        }
      `}</style>
    </AppLayout>
  );
}