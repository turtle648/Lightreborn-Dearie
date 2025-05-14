// app/(mission)/walking/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
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

export default function WalkingMissionPage() {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [capturedMapBlob, setCapturedMapBlob] = useState<Blob | null>(null);  // Blob state 추가
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
  const { stopRecording, walkLoading, walkError } = useMissionStore();


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

  // 종료
  const stopWalking = () => {
    setIsTracking(false);
    setIsCompleted(true);
    setEndTime(new Date());
    if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    const map = mapRef.current?.getMap();
    if (!map || path.length < 2) return;

    // bounds 계산 및 fit
    const bounds = path.reduce(
      (b: maplibregl.LngLatBounds, p) => b.extend([p.lng, p.lat]),
      new maplibregl.LngLatBounds([path[0].lng, path[0].lat], [path[0].lng, path[0].lat])
    );
    map.fitBounds(bounds, { padding: 40, duration: 0 });

    // idle 후 캡처
    map.once("idle", () => {
      const cv = map.getCanvas();
      const url = cv.toDataURL("image/png");
      setCapturedMapUrl(url);
      cv.toBlob(blob => {
        if (blob) setCapturedMapBlob(blob);
      }, "image/png");  // Blob 저장
      setIsCaptured(true);
    });
  };

  // 저장 
  const handleSave = async () => {
    if (!isCaptured || !capturedMapBlob) {
      return alert("지도 캡처 중입니다. 잠시만 기다려주세요.");
    }
    try {
      // userMissionId=11 하드코딩
      await stopRecording(11, path, capturedMapBlob, endTime ?? new Date());
      alert("서버에 저장되었습니다!");
    } catch {
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 권한 재요청
  const requestLocationPermission = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => { setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationError(null); setPermissionDenied(false); },
      err => { /* ... */ },
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
            <Button onClick={handleSave} className="px-8 py-6 rounded-full bg-gradient-soft" disabled={!isCaptured}>
              <Save className="mr-2" /> 저장하기
            </Button>
          ) : isTracking ? (
            <Button onClick={stopWalking} className="px-8 py-6 rounded-full bg-red-500">
              <Square className="mr-2" /> 산책 완료
            </Button>
          ) : (
            <Button onClick={startWalking} disabled={!currentPosition || !!locationError} className="px-8 py-6 rounded-full bg-gradient-soft">
              <Play className="mr-2" /> 산책 시작
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
