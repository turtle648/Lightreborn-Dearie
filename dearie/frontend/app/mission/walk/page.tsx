"use client";

import { useState, useRef, useEffect, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Map as MapIcon, Timer, Play, Pause, Camera, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import { toast } from "@/components/ui/use-toast";
import confetti from "canvas-confetti";
import { submitMissionCompletion } from "@/apis/mission-api";
import { WalkingMapBox } from "@/components/feature/mission/walking-mapbox";
import { MapRef } from "react-map-gl/maplibre";
import html2canvas from "html2canvas";

// 현재 위치 추적 및 타이머 상태
interface WalkState {
  isTracking: boolean;
  startTime: Date | null;
  endTime: Date | null;
  elapsedTime: number;
  distance: number;
  path: { lat: number; lng: number }[];
  currentLocation: { lat: number; lng: number } | null;
}

// 불필요한 리렌더링을 방지하기 위한 메모이즈된 WalkingMapBox
const OptimizedMap = memo(WalkingMapBox, (prevProps, nextProps) => {
  // 기본 조건: 추적 상태나 완료 상태가 변경됐을 때는 항상 리렌더링
  if (prevProps.isTracking !== nextProps.isTracking || 
      prevProps.isCompleted !== nextProps.isCompleted) {
    return false;
  }
  
  // 현재 위치가 없으면 항상 리렌더링
  if (!prevProps.currentPosition || !nextProps.currentPosition) {
    return false;
  }
  
  // 경로 길이가 5개 이상 변경됐을 때만 리렌더링
  if (Math.abs(prevProps.path.length - nextProps.path.length) >= 5) {
    return false;
  }
  
  // 현재 위치가 0.0005도(약 50m) 이상 변경됐을 때만 리렌더링
  const prevPos = prevProps.currentPosition;
  const nextPos = nextProps.currentPosition;
  if (Math.abs(prevPos.lat - nextPos.lat) > 0.0005 || 
      Math.abs(prevPos.lng - nextPos.lng) > 0.0005) {
    return false;
  }
  
  // 위 조건에 해당하지 않으면 리렌더링 방지
  return true;
});

export default function WalkMissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missionId = Number(searchParams.get("missionId"));
  const userMissionId = Number(searchParams.get("userMissionId"));
  
  // 산책 관련 상태
  const [walkState, setWalkState] = useState<WalkState>({
    isTracking: false,
    startTime: null,
    endTime: null,
    elapsedTime: 0,
    distance: 0,
    path: [],
    currentLocation: null,
  });
  
  // 이미지 캡처 관련 상태
  const [snapshotImage, setSnapshotImage] = useState<string | null>(null);
  const [snapshotFile, setSnapshotFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // 타이머 및 위치 추적 ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const watchPositionIdRef = useRef<number | null>(null);
  const mapRef = useRef<MapRef>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // 위치 업데이트 최적화를 위한 디바운스 상태
  const lastPositionUpdateRef = useRef<number>(0);
  const lastPathUpdateRef = useRef<number>(0);
  const lastValidPositionRef = useRef<{lat: number, lng: number} | null>(null);
  const positionHistoryRef = useRef<{lat: number, lng: number, timestamp: number}[]>([]);
  
  // 새 경로 포인트 추가 함수 - 최소 거리 기준 적용
  const addPathPoint = (newPoint: {lat: number, lng: number}, currentPath: {lat: number, lng: number}[]) => {
    if (currentPath.length === 0) {
      return [newPoint];
    }
    
    const lastPoint = currentPath[currentPath.length - 1];
    const distance = calculateDistance(
      lastPoint.lat, lastPoint.lng,
      newPoint.lat, newPoint.lng
    );
    
    // 최소 10미터 이상 움직였을 때만 경로에 추가
    const minDistance = 0.01; // 약 10미터
    if (distance >= minDistance) {
      return [...currentPath, newPoint];
    }
    
    return currentPath;
  };
  
  // 위치 데이터 필터링 함수
  const filterPosition = (position: GeolocationPosition): {lat: number, lng: number} | null => {
    const { latitude, longitude, accuracy, speed } = position.coords;
    const now = Date.now();

    // 정확도가 너무 낮으면 무시 (30m 이상)
    if (accuracy > 30) {
      console.warn("정확도 낮음, 무시됨:", accuracy);
      return null;
    }

    // 속도가 비정상적으로 높으면 무시 (시속 30km 이상)
    if (speed !== null && speed > 8.33) { // 30km/h = 8.33m/s
      console.warn("비정상 속도, 무시됨:", speed);
      return null;
    }

    // 마지막 유효 위치가 있는 경우
    if (lastValidPositionRef.current) {
      const lastPos = lastValidPositionRef.current;
      const distance = calculateDistance(
        lastPos.lat, lastPos.lng,
        latitude, longitude
      ) * 1000; // m 단위

      // 1초에 30m 이상 이동하면 무시 (시속 108km 이상)
      if (distance > 30) {
        console.warn("비정상 이동 거리, 무시됨:", distance);
        return null;
      }
    }

    // 마지막 좌표만 저장
    lastValidPositionRef.current = { lat: latitude, lng: longitude };
    return lastValidPositionRef.current;
  };
  
  // 산책 시작 함수
  const startWalk = () => {
    // 이미 진행 중이면 무시
    if (walkState.isTracking) return;
    
    // 위치 정보 권한 확인
    if (!navigator.geolocation) {
      toast({
        title: "위치 정보 사용 불가",
        description: "이 브라우저에서는 위치 정보를 사용할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }
    
    // 현재 시간 설정
    const now = new Date();
    console.log("산책 시작 시간:", now);
    
    // 위치 추적 시작 - 업데이트 빈도 제한 적용
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        
        // 최소 1초 간격으로 위치 업데이트
        if (now - lastPositionUpdateRef.current < 1000) {
          return;
        }
        
        const filteredPosition = filterPosition(position);
        if (!filteredPosition) {
          return;
        }

        const { lat: latitude, lng: longitude } = filteredPosition;
        lastPositionUpdateRef.current = now;

        setWalkState((prev) => {
          let newDistance = prev.distance;

          if (prev.currentLocation) {
            const delta = calculateDistance(
              prev.currentLocation.lat,
              prev.currentLocation.lng,
              latitude,
              longitude
            ) * 1000; // m 단위

            if (delta < 5) {
              // 5m 이하 이동은 무시
              return prev;
            }

            newDistance += delta / 1000; // 다시 km로 누적
          }

          const newPath = addPathPoint({ lat: latitude, lng: longitude }, prev.path);
          return {
            ...prev,
            currentLocation: { lat: latitude, lng: longitude },
            path: newPath,
            distance: newDistance,
          };
        });
      },
      (error) => {
        console.error("위치 추적 오류:", error);
        toast({
          title: "위치 추적 오류",
          description: `위치 정보를 가져오는데 실패했습니다: ${error.message}`,
          variant: "destructive",
        });
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 3000,  // 3초 동안 캐시된 위치 사용
        timeout: 5000 
      }
    );
    
    // 타이머 시작
    const timerInterval = setInterval(() => {
      setWalkState((prev) => ({
        ...prev,
        elapsedTime: prev.elapsedTime + 1,
      }));
    }, 1000);
    
    // ref 저장 및 상태 업데이트
    watchPositionIdRef.current = watchId;
    timerIntervalRef.current = timerInterval;
    
    setWalkState((prev) => {
      const updatedState = {
        ...prev,
        isTracking: true,
        startTime: now,
        endTime: null,
      };
      console.log("업데이트된 상태:", updatedState);
      return updatedState;
    });
    
    toast({
      title: "산책 시작",
      description: "경로를 추적하고 있습니다. 진행 상황을 지도에서 확인하세요.",
    });
  };
  
  // 산책 중지 함수
  const stopWalk = () => {
    // 추적 중이 아니면 무시
    if (!walkState.isTracking) return;
    
    // 타이머 중지
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // 위치 추적 중지
    if (watchPositionIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchPositionIdRef.current);
      watchPositionIdRef.current = null;
    }
    
    // 종료 시간 설정
    const now = new Date();
    console.log("산책 종료 시간:", now);
    
    setWalkState((prev) => ({
      ...prev,
      isTracking: false,
      endTime: now,
    }));
    
    // 약간의 지연 후 스냅샷 캡처 (지도가 완전히 렌더링된 후)
    setTimeout(() => {
      captureSnapshot();
    }, 800);
    
    toast({
      title: "산책 완료",
      description: `총 ${formatTime(walkState.elapsedTime)} 동안 약 ${walkState.distance.toFixed(2)}km를 걸었습니다.`,
    });
  };
  
  // 경로 스냅샷 캡처 함수 - 지도 이미지 캡처
  const captureSnapshot = async () => {
    if (!mapContainerRef.current) {
      console.error("지도 컨테이너 참조를 찾을 수 없습니다.");
      return;
    }
    
    try {
      // HTML2Canvas를 사용하여 지도 영역 캡처
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        logging: false, // 로깅 비활성화
        backgroundColor: null, // 배경색 투명처리
      });
      
      // 캔버스를 이미지로 변환
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // 품질 낮춤
      setSnapshotImage(dataUrl);
      
      // dataURL을 Blob으로 변환하고 File 객체 생성
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `walk_path_${Date.now()}.jpg`, { type: "image/jpeg" });
      setSnapshotFile(file);
      
      console.log("스냅샷 캡처 완료:", file.size + " bytes");
    } catch (error) {
      console.error("스냅샷 캡처 오류:", error);
      toast({
        title: "스냅샷 생성 실패",
        description: "지도 이미지를 캡처하는데 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };
  
  // 산책 데이터 저장 함수
  const saveWalkData = async () => {
    // 시간 정보가 없는 경우 안전 장치 추가
    if (!walkState.startTime || !walkState.endTime) {
      console.warn("시간 정보 누락, 현재 시간으로 대체합니다.");
      
      const currentTime = new Date();
      const startTime = walkState.startTime || new Date(currentTime.getTime() - (walkState.elapsedTime * 1000));
      const endTime = walkState.endTime || currentTime;
      
      // 임시 업데이트
      setWalkState(prev => ({
        ...prev,
        startTime,
        endTime
      }));
    }
    
    // 스냅샷 파일이 없는 경우 다시 캡처 시도
    if (!snapshotFile) {
      console.warn("스냅샷 파일이 없습니다. 캡처를 다시 시도합니다.");
      await captureSnapshot();
      
      // 짧은 지연 후 다시 확인
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 여전히 없으면 경고
      if (!snapshotFile) {
        toast({
          title: "스냅샷 생성 실패",
          description: "지도 이미지를 생성할 수 없습니다. 다시 시도하세요.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsSaving(true);
    
    try {
      // 안전을 위해 최종 상태 확인
      const finalStartTime = walkState.startTime || new Date(Date.now() - (walkState.elapsedTime * 1000));
      const finalEndTime = walkState.endTime || new Date();
      
      // 경로 데이터를 JSON 문자열로 변환
      const pathJson = JSON.stringify(walkState.path);
      
      // FormData 구성
      const formData = new FormData();
      
      // 필수 정보 추가
      formData.append("missionId", String(missionId));
      formData.append("missionExecutionType", "WALK");
      
      // 산책 데이터
      formData.append("startTime", finalStartTime.toISOString());
      formData.append("endTime", finalEndTime.toISOString());
      formData.append("pathJson", pathJson);
      formData.append("distance", String(walkState.distance));
      
      // 스냅샷 파일 추가
      if (snapshotFile) {
        formData.append("snapshotFile", snapshotFile);
      }
      
      // 콘솔에 FormData 내용 확인 (디버깅용)
      console.log("API 요청 데이터:", {
        userMissionId,
        missionId,
        startTime: finalStartTime.toISOString(),
        endTime: finalEndTime.toISOString(),
        pathLength: walkState.path.length,
        distance: walkState.distance,
        hasSnapshotFile: !!snapshotFile
      });
      
      // API 호출
      const response = await submitMissionCompletion(userMissionId, {
        missionId,
        missionExecutionType: "WALK",
        startTime: finalStartTime.toISOString(),
        endTime: finalEndTime.toISOString(),
        pathJson,
        distance: walkState.distance,
        snapshotFile
      });
      
      console.log("API 응답:", response);
      
      toast({
        title: "산책 미션 완료",
        description: "산책 데이터가 성공적으로 저장되었습니다!",
      });
      
      // 성공 효과
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // 미션 목록 페이지로 이동
      setTimeout(() => {
        router.push(ROUTES.MISSION.LIST);
      }, 2000);
      
    } catch (error) {
      console.error("산책 데이터 저장 오류:", error);
      toast({
        title: "저장 실패",
        description: "산책 데이터를 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 컴포넌트 언마운트 시 타이머와 위치 추적 정리
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      if (watchPositionIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
      }
    };
  }, []);
  
  // 초기 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setWalkState(prev => ({
            ...prev,
            currentLocation: { lat: latitude, lng: longitude }
          }));
        },
        (error) => {
          console.error("초기 위치 가져오기 실패:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);
  
  // 유틸리티 함수들
  
  // 시간 형식 변환 (초 -> MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 두 지점 간의 거리 계산 (Haversine 공식)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // km 단위 거리
  };
  
  return (
    <AppLayout showBack title="산책 미션" rightAction={null}>
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 mb-4">
          <Card className="h-full border-none shadow-md overflow-hidden bg-gradient-to-br from-white to-blue-50">
            <CardContent className="p-0 h-full">
              <AnimatePresence mode="wait">
                {/* 산책 시작 전 화면 */}
                {!walkState.startTime && (
                  <motion.div
                    key="start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center p-6"
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <MapIcon className="h-16 w-16 text-white" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">산책 미션</h2>
                    <p className="text-gray-600 mb-8 text-center">
                      30분 이상 걸으면서 신선한 공기를 마시고 주변 환경을 관찰해보세요.
                    </p>
                    <Button
                      onClick={startWalk}
                      className="px-6 py-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      산책 시작하기
                    </Button>
                  </motion.div>
                )}
                
                {/* 산책 진행 중 화면 */}
                {walkState.startTime && walkState.isTracking && (
                  <motion.div
                    key="tracking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col"
                  >
                    {/* 지도 영역 */}
                    <div ref={mapContainerRef} className="flex-1 relative">
                      {walkState.currentLocation && (
                        <OptimizedMap
                          ref={mapRef}
                          currentPosition={walkState.currentLocation}
                          path={walkState.path}
                          isTracking={walkState.isTracking}
                          isCompleted={false}
                        />
                      )}
                      
                      {/* 지도가 로드되지 않은 경우 대체 UI */}
                      {!walkState.currentLocation && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-500">위치 정보를 가져오는 중...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* 현재 정보 패널 */}
                    <div className="bg-white p-4 border-t border-gray-200">
                      <div className="flex justify-between mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 flex-1 mr-2">
                          <p className="text-sm text-gray-500">경과 시간</p>
                          <p className="text-2xl font-bold text-blue-700">{formatTime(walkState.elapsedTime)}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 flex-1 ml-2">
                          <p className="text-sm text-gray-500">이동 거리</p>
                          <p className="text-2xl font-bold text-green-700">{walkState.distance.toFixed(2)} km</p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={stopWalk}
                        className="w-full py-4 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition-colors"
                      >
                        <Pause className="mr-2 h-5 w-5" />
                        산책 종료하기
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* 산책 완료 화면 */}
                {walkState.startTime && !walkState.isTracking && walkState.endTime && (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col p-6"
                  >
                    <h2 className="text-xl font-bold mb-4">산책 완료!</h2>
                    
                    {/* 산책 통계 */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">총 시간</p>
                          <p className="text-xl font-bold">{formatTime(walkState.elapsedTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">총 거리</p>
                          <p className="text-xl font-bold">{walkState.distance.toFixed(2)} km</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">시작 시간</p>
                          <p className="text-base font-medium">
                            {walkState.startTime?.toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">종료 시간</p>
                          <p className="text-base font-medium">
                            {walkState.endTime?.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 경로 이미지 */}
                    <div className="flex-1 mb-6">
                      <p className="text-sm text-gray-500 mb-2">산책 경로</p>
                      <div className="relative bg-white rounded-lg shadow-md overflow-hidden w-full h-64">
                        {snapshotImage ? (
                          <img
                            src={snapshotImage}
                            alt="산책 경로"
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <div ref={mapContainerRef} className="w-full h-full">
                            <OptimizedMap
                              ref={mapRef}
                              currentPosition={null}
                              path={walkState.path}
                              isTracking={false}
                              isCompleted={true}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 저장 버튼 */}
                    <Button
                      onClick={saveWalkData}
                      disabled={isSaving}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle 
                              className="opacity-25" 
                              cx="12" 
                              cy="12" 
                              r="10" 
                              stroke="currentColor" 
                              strokeWidth="4" 
                              fill="none" 
                            />
                            <path 
                              className="opacity-75" 
                              fill="currentColor" 
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                            />
                          </svg>
                          저장 중...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          저장하기
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}