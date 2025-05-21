"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, ImageIcon, Save, RefreshCw, Check, Upload, MapPin, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"
import { submitMissionCompletion } from "@/apis/mission-api";
import { useMissionStore } from "@/stores/mission-store"

// API 응답 타입 정의
interface Detection {
  label: string
  confidence: number
  box: number[]
}

interface MissionResult {
  missionId: number
  resultType: string
  completedAt: string
  detail: {
    detections: Detection[]
  }
  requiredObjectLabel: string
  verified: boolean,
  locationVerified: boolean
}

export default function ImageMissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missionId = Number(searchParams.get("missionId"));
  const userMissionId = Number(searchParams.get("userMissionId"));
  const missionContent = useMissionStore((state) => state.missionContent);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationResult, setVerificationResult] = useState<MissionResult | null>(null);
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const requiredObjectLabel = searchParams.get("requiredObjectLabel") || "";
  const imageKeyword = searchParams.get("label") || requiredObjectLabel; // fallback도 있음


  // 위치 정보 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error)
        },
        { enableHighAccuracy: true },
      )
    }
  }, [])

  // confetti: 성공 시에만
  useEffect(() => {
    if (verificationResult?.verified && verificationResult?.locationVerified) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: [
          "#fbb6a7", "#f7b0c5", "#fff0f5", "#ffb6b9", "#ffd166", "#a3e635", "#38bdf8", "#6366f1", "#f87171", "#facc15", "#34d399", "#f472b6",
        ],
      });
    }
  }, [verificationResult]);

  // 카메라로 사진 촬영
  const capturePhoto = () => {
    if (cameraRef.current) {
      cameraRef.current.click()
    }
  }

  // 파일 선택 처리 (카메라에서만)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const imageUrl = URL.createObjectURL(file)
    setCapturedImage(imageUrl)
    // 검증 및 저장 시작
    verifyAndSaveImage(file)
  }

  
  // 검증 및 저장 함수
  const verifyAndSaveImage = async (file: File) => {
    setIsVerifying(true);
    setVerificationProgress(0);
    setVerificationResult(null);

    const progressInterval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      const response = await submitMissionCompletion(userMissionId, {
        missionId,
        missionExecutionType: "IMAGE",
        imageKeyword,
        imageFile: file,
        latitude: position?.latitude,
        longitude: position?.longitude,
      });

      // API 응답 구조에 맞게 검증 상태 확인
      const isVerified = response.result?.detail.requiredObjectDetected || false;
      const isLocationVerified =
        imageKeyword === "카페"
          ? response.result?.detail.locationVerified || false
          : true;


      // 검증 결과 설정 (성공, 실패 둘 다 처리)
      setVerificationProgress(100);
      setVerificationResult({
        missionId,
        resultType: response.result?.resultType || "IMAGE",
        completedAt: response.result?.completedAt || new Date().toISOString(),
        detail: {
          // 실제 API에서 반환한 detections 사용
          detections: response.result?.detail?.detections || [],
        },
        requiredObjectLabel: response.result?.requiredObjectLabel || imageKeyword,
        verified: isVerified,
        locationVerified: isLocationVerified
      });

      if (!isVerified) {
        toast({
          title: "미션 검증 실패",
          description: `${imageKeyword}가 이미지에서 인식되지 않았습니다. 다시 시도해주세요.`,
          variant: "destructive",
        });
      } else if (!isLocationVerified) {
        toast({
          title: "위치 확인 실패",
          description: "사진은 잘 찍었지만, 지금은 지정된 장소가 아닌 것 같아요.",
          variant: "destructive",
        });
      } else {
        setIsCompleted(true);
        setIsSaved(true);
        toast({
          title: "이미지 미션 완료",
          description: `${imageKeyword} 미션을 완료했어요!`,
          variant: "default",
        });
      }

    } catch (error) {
      console.error("이미지 검증 중 오류 발생:", error);
      
      // 네트워크 에러 등의 경우 실패 상태로 설정
      setVerificationResult({
        missionId,
        resultType: "IMAGE",
        completedAt: new Date().toISOString(),
        detail: { detections: [] },
        requiredObjectLabel: imageKeyword,
        verified: false,
        locationVerified: false,
      });
      
      toast({
        title: "오류 발생",
        description: "이미지 검증 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsVerifying(false);
    }
  };

  // 사진 다시 찍기
  const retakePhoto = () => {
    setCapturedImage(null)
    setImageFile(null)
    setVerificationResult(null)
    setVerificationProgress(0)
  }

  // 박스 오버레이 렌더링
  const renderBoxes = () => {
    if (!verificationResult || !capturedImage || !verificationResult.verified) return null
    return verificationResult.detail.detections.map((det, idx) => {
      const [x, y, width, height] = det.box
      return (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: `${width}%`,
            height: `${height}%`,
            border: "2px solid #f472b6",
            borderRadius: "8px",
            boxShadow: "0 0 8px rgba(244, 114, 182, 0.6)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-24px",
              left: "0",
              background: "#f472b6",
              color: "white",
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "6px",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(244, 114, 182, 0.5)",
            }}
          >
            {det.label}
          </span>
        </div>
      )
    })
  }

  const displayContent = missionContent || "오늘의 이미지 미션을 완료해보세요.";

  return (
    <AppLayout showBack title="이미지 미션" rightAction={null}>
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 mb-4">
          <Card className="h-full border-none shadow-md overflow-hidden bg-gradient-to-br from-white to-pink-50">
            <CardContent className="p-0 h-full">
              <AnimatePresence mode="wait">
                {/* 1. 사진 촬영 단계 */}
                {!capturedImage && (
                  <motion.div
                    key="capture"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="h-full flex flex-col items-center justify-center"
                  >
                    <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 w-full">
                      <div className="text-center w-full">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="w-32 h-32 bg-gradient-to-br from-[#fbb6a7] to-[#f7b0c5] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                          <Camera className="h-16 w-16 text-white" />
                        </motion.div>
                        <motion.h2
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="text-xl font-bold mb-2"
                        >
                          오늘의 사진 미션
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-gray-600 mb-6"
                        >
                          {displayContent}
                        </motion.p>
                        <Button
                          onClick={capturePhoto}
                          className="px-6 py-6 rounded-full bg-gradient-to-r from-[#fbb6a7] to-[#f7b0c5] text-white font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                        >
                          <Camera className="mr-2 h-5 w-5 text-white" />
                          사진 촬영하기
                        </Button>
                        <input
                          type="file"
                          ref={cameraRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                        />
                        {position && (
                          <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1 text-[#fbb6a7]" />
                            위치 정보 사용 가능
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* 2. 검증 및 저장 진행 중 */}
                {capturedImage && isVerifying && (
                  <motion.div
                    key="verifying"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="h-full flex flex-col items-center justify-center"
                  >
                    <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 w-full">
                      <div className="relative w-[320px] h-[220px] bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto">
                        {capturedImage && (
                          <Image
                            src={capturedImage || "/placeholder.svg"}
                            alt="촬영된 사진"
                            fill
                            className="object-contain rounded-2xl"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white rounded-2xl">
                          <Loader2 className="h-12 w-12 animate-spin mb-4" />
                          <p className="text-lg font-medium mb-2">이미지 검증 및 저장 중...</p>
                          <div className="w-64 mb-2">
                            <Progress value={verificationProgress} className="h-2" />
                          </div>
                          <p className="text-sm opacity-80">잠시만 기다려주세요</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* 3. 검증 결과(성공/실패) */}
                {capturedImage && !isVerifying && verificationResult && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-[600px] flex flex-col p-6 justify-center items-center relative"
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1, 
                          rotate: verificationResult.verified ? [0, 10, -10, 0] : 0 
                        }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          verificationResult.verified && verificationResult.locationVerified
                            ? "bg-gradient-to-br from-[#fbb6a7] to-[#f7b0c5]" 
                            : "bg-gradient-to-br from-gray-200 to-gray-300"
                        }`}
                      >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                          {verificationResult.verified && verificationResult.locationVerified? (
                            <ImageIcon className="h-12 w-12 text-[#fbb6a7]" />
                          ) : (
                            <RefreshCw className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-2"
                      >
                        <h3 className="text-2xl font-bold mb-1">
                          {verificationResult.verified && verificationResult.locationVerified ? "검증 성공했습니다!" : "검증 실패했습니다."}
                        </h3>
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-gray-600 mt-2 whitespace-pre-line text-center"
                      >
                        {
                          !verificationResult?.verified
                            ? `${verificationResult?.requiredObjectLabel}가 이미지에서 인식되지 않았습니다.\n다시 한 번 찍어볼까요?`
                            : !verificationResult?.locationVerified
                              ? `사진은 잘 찍혔지만,\n지금은 지정된 장소가 아닌 것 같아요.\n조금만 더 이동해서 다시 시도해볼까요?`
                              : `소중한 순간을 사진으로 담았습니다.\n이런 기록들이 모여\n당신의 마음 여정을 만들어갑니다.`
                        }
                      </motion.p>
                    </div>
                    <div className="flex-1 mb-6 flex items-center justify-center">
                      <div className="relative w-[320px] h-[220px] bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto">
                        {capturedImage && (
                          <Image
                            src={capturedImage || "/placeholder.svg"}
                            alt="촬영된 사진"
                            fill
                            className={`object-contain rounded-2xl ${!verificationResult.verified ? "opacity-70" : ""}`}
                          />
                        )}
                        {/* 성공 시 박스 오버레이 */}
                        {verificationResult.verified && verificationResult.locationVerified && renderBoxes()}
                        
                        {/* 실패 시 오버레이 */}
                        {!verificationResult.verified && verificationResult.locationVerified && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                              <Badge 
                                variant="destructive" 
                                className="mb-2 px-3 py-1 bg-red-100 text-red-600 border border-red-200"
                              >
                                {requiredObjectLabel} 인식 실패
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 w-full mt-4">
                      {verificationResult.verified && verificationResult.locationVerified ? (
                        <Button
                          onClick={() => router.push(`/mission/recent-success/${userMissionId}?type=IMAGE`)}
                          className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#fbb6a7] to-[#f7b0c5] text-white font-semibold shadow-lg shadow-primary/20"
                        >
                          돌아가기
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={retakePhoto}
                            className="flex-1 py-3 rounded-full border-[#fbb6a7] text-[#fbb6a7] border-2 bg-white hover:bg-[#fbb6a7]/10 font-semibold"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            다시 촬영하기
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
