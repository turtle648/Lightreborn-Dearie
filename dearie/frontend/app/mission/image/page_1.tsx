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
  verified: boolean
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const imageKeyword = searchParams.get("label") || "cup"; // fallback도 있음

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
    if (verificationResult?.verified) {
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

  // 카메라 스트림 관리
  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      if (isCameraOpen && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }, // 후면 카메라 사용
            audio: false
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("카메라 접근 오류:", err);
          toast({
            title: "카메라 접근 실패",
            description: "카메라에 접근할 수 없습니다. 권한을 확인해주세요.",
            variant: "destructive",
          });
          setIsCameraOpen(false);
        }
      }
    };
    
    setupCamera();
    
    // 정리 함수: 컴포넌트 언마운트 또는 isCameraOpen 상태 변경 시 스트림 정리
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  // 카메라로 사진 촬영
  const capturePhoto = () => {
    setIsCameraOpen(true);
  }
  
  // 실제 사진 촬영 (비디오에서 이미지 캡처)
  const takePicture = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // 비디오 크기에 맞춰 캔버스 설정
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // 비디오 프레임을 캔버스에 그림
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 캔버스의 이미지를 데이터 URL로 변환
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        
        // 데이터 URL을 Blob으로 변환하고 File 객체 생성
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setImageFile(file);
            
            // 카메라 닫기
            setIsCameraOpen(false);
            
            // 이미지 검증 시작
            await verifyAndSaveImage(file);
          }
        }, 'image/jpeg', 0.8);
      }
    }
  }

  // 대체 입력 방식으로 파일 선택 처리
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

      // 위치 정보가 있으면 추가
      if (response?.code === 200) {
        setIsCompleted(true);
        setIsSaved(true);
        setVerificationProgress(100);
        setVerificationResult({
          missionId,
          resultType: "IMAGE",
          completedAt: new Date().toISOString(),
          detail: {
            detections: [], // 실제 검증 결과로 대체 가능
          },
          requiredObjectLabel: imageKeyword,
          verified: true,
        });

        toast({
          title: "이미지 미션 완료",
          description: `${imageKeyword} 미션을 완료했어요!`,
          variant: "default",
        });
      } else {
        throw new Error("미션 검증 실패");
      }
    } catch (error) {
      console.error("이미지 검증 중 오류 발생:", error);
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
    setIsCameraOpen(false)
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
            {det.label} ({Math.round(det.confidence * 100)}%)
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
                {/* 카메라 뷰 */}
                {isCameraOpen && (
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative h-full w-full flex flex-col"
                  >
                    <div className="relative flex-1 bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="p-4 flex justify-center bg-gray-900 gap-4">
                      <Button 
                        onClick={() => setIsCameraOpen(false)}
                        variant="outline"
                        className="rounded-full"
                      >
                        <RefreshCw className="h-6 w-6" />
                      </Button>
                      <Button 
                        onClick={takePicture}
                        className="w-16 h-16 rounded-full bg-white border-4 border-gray-300"
                      />
                      <Button 
                        onClick={() => {
                          setIsCameraOpen(false);
                          if (cameraRef.current) cameraRef.current.click();
                        }}
                        variant="outline"
                        className="rounded-full"
                      >
                        <Upload className="h-6 w-6" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* 1. 사진 촬영 단계 */}
                {!isCameraOpen && !capturedImage && (
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
                          오늘의 카페 미션
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
                {!isCameraOpen && capturedImage && isVerifying && (
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
                {!isCameraOpen && capturedImage && !isVerifying && verificationResult && (
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
                        animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="w-28 h-28 bg-gradient-to-br from-[#fbb6a7] to-[#f7b0c5] rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-[#fbb6a7]" />
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-2"
                      >
                        <h3 className="text-2xl font-bold mb-1">
                          {verificationResult.verified ? "검증 성공했습니다!" : "검증 실패했습니다."}
                        </h3>
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-gray-600 mt-2 whitespace-pre-line text-center"
                      >
                        {verificationResult.verified
                          ? `소중한 순간을 사진으로 담았습니다.\n이런 기록들이 모여\n당신의 마음 여정을 만들어갑니다.`
                          : `다시 시도해 주세요.`}
                      </motion.p>
                    </div>
                    <div className="flex-1 mb-6 flex items-center justify-center">
                      <div className="relative w-[320px] h-[220px] bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto">
                        {capturedImage && (
                          <Image
                            src={capturedImage || "/placeholder.svg"}
                            alt="촬영된 사진"
                            fill
                            className="object-contain rounded-2xl"
                          />
                        )}
                        {/* 성공 시 박스 오버레이 */}
                        {verificationResult.verified && renderBoxes()}
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 w-full mt-4">
                      {verificationResult.verified ? (
                        <Button
                          onClick={() => router.push(ROUTES.MISSION.LIST)}
                          className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#fbb6a7] to-[#f7b0c5] text-white font-semibold shadow-lg shadow-primary/20"
                        >
                          돌아가기
                        </Button>
                      ) : (
                        <Button
                          onClick={retakePhoto}
                          className="flex-1 py-3 rounded-full border-[#fbb6a7] text-[#fbb6a7] border-2 bg-white hover:bg-[#fbb6a7]/10 font-semibold"
                        >
                          다시 찍기
                        </Button>
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