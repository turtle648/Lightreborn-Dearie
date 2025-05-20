"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Square, Save, AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { WalkingMapBox } from "@/components/feature/mission/walking-mapbox";
import { WalkingSummary } from "@/components/feature/mission/walking-summary";
import type { MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { useMissionStore } from "@/stores/mission-store";
import { submitMissionCompletion } from "@/apis/mission-api";

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
  const [capturedMapUrl, setCapturedMapUrl] = useState<string | null>(null);

  const { all, preview, fetchAll, setStatus } = useMissionStore();

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
  }, []);


    const mission = useMemo(() => {
    if (!userMissionId) return null;
    return all.find(m => m.id === userMissionId) || preview.find(m => m.id === userMissionId);
  }, [all, preview, userMissionId]);

  useEffect(() => {
    if (!mission) fetchAll();
  }, [mission, fetchAll]);

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

  // 시작
  const startWalking = () => {
    if (!currentPosition) return alert("위치 로딩 중...");
    setIsTracking(true);
    setStartTime(new Date());
    setPath([currentPosition]);
    setIsCaptured(false);

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

  const stopWalking = () => {
    setIsTracking(false);
    setIsCompleted(true);
    setEndTime(new Date());
    if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    const map = mapRef.current?.getMap();
    if (!map || path.length < 2) return;

    setIsCapturing(true);

    // bounds 계산 및 fit
    const bounds = path.reduce(
      (b: maplibregl.LngLatBounds, p) => b.extend([p.lng, p.lat]),
      new maplibregl.LngLatBounds([path[0].lng, path[0].lat], [path[0].lng, path[0].lat])
    );
    
    // 지도 범위 조정 (애니메이션 없이)
    map.fitBounds(bounds, { padding: 40, duration: 0 });
    
    // 캡처 타임아웃 설정 - 최대 3초간 대기
    const captureTimeout = setTimeout(() => {
      // 3초 후에도 캡처가 완료되지 않았다면 강제로 캡처 시도
      if (isCapturing) {
        try {
          const cv = map.getCanvas();
          const url = cv.toDataURL("image/jpeg", 0.7);
          setCapturedMapUrl(url);
          
          cv.toBlob(blob => {
            if (blob) setCapturedMapBlob(blob);
            setIsCaptured(true);
            setIsCapturing(false);
          }, "image/jpeg", 0.7);
        } catch (err) {
          console.error("강제 캡처 오류:", err);
          setIsCaptured(true);
          setIsCapturing(false);
        }
      }
    }, 3000);
    
    // 일정 시간 후 캡처 시도 (짧은 대기 시간)
    setTimeout(() => {
      try {
        const cv = map.getCanvas();
        const url = cv.toDataURL("image/jpeg", 0.7);
        setCapturedMapUrl(url);
        
        cv.toBlob(blob => {
          if (blob) setCapturedMapBlob(blob);
          clearTimeout(captureTimeout); // 타임아웃 취소
          setIsCaptured(true);
          setIsCapturing(false);
        }, "image/jpeg", 0.7);
      } catch (err) {
        // 오류 발생 시 타임아웃으로 처리되게 놔둠
        console.error("첫 번째 캡처 시도 실패:", err);
      }
    }, 500);
    
    // 원래 방식도 병행 (가장 먼저 완료되는 방식이 적용됨)
    map.once("idle", () => {
      if (!isCaptured) {
        try {
          const cv = map.getCanvas();
          const url = cv.toDataURL("image/jpeg", 0.7);
          setCapturedMapUrl(url);
          
          cv.toBlob(blob => {
            if (blob) setCapturedMapBlob(blob);
            clearTimeout(captureTimeout); // 타임아웃 취소
            setIsCaptured(true);
            setIsCapturing(false);
          }, "image/jpeg", 0.7);
        } catch (err) {
          console.error("idle 이벤트 캡처 오류:", err);
          // 오류 발생 시 타임아웃으로 처리되게 놔둠
        }
      }
    });
  };

  const handleSave = async () => {
    if (!isCaptured || !capturedMapBlob || !userMissionId || !missionId) {
      alert("저장 조건이 충족되지 않았습니다.");
      return;
    }

    setIsSaving(true);

    try {
      const pathJson = JSON.stringify(path);
      const snapshotFile = new File([capturedMapBlob], "walk_path.jpg", { type: "image/jpeg" });

      await submitMissionCompletion(userMissionId, {
        missionId,
        missionExecutionType: "WALK",
        pathJson,
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString(),
        distance,
        snapshotFile,
      });

      router.push(`/mission/recent-success/${userMissionId}?type=WALK`);
    } catch (error) {
      console.error("산책 미션 제출 실패", error);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };


  // 권한 재요청
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
      <div className="flex flex-col h-full p-4 pb-8">
        <Card className="mb-4 shadow-md overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="h-[50vh] w-full relative">
              {isTracking && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-soft px-6 py-3 rounded-full animate-pulse">
                    <span className="text-white">기록 중...</span>
                  </div>
                </div>
              )}
              {isCompleted && capturedMapUrl ? (
                <img src={capturedMapUrl!} className="w-full h-full object-cover" />
              ) : (
                <WalkingMapBox
                  ref={mapRef}
                  currentPosition={currentPosition}
                  path={path}
                  isTracking={isTracking}
                  isCompleted={isCompleted}
                />
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
              disabled={!isCaptured || isCapturing || isSaving}
            >
              {isCapturing || isSaving ? (
                <div className="flex items-center">
                  <RefreshCw className="animate-spin mr-2" />
                  {isCapturing ? "지도 캡처 중..." : "저장 중..."}
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
      </div>
    </AppLayout>
  );
}
