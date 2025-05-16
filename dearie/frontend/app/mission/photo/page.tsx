"use client"

import type React from "react"

import { useState, useRef } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, ImageIcon, Save, RefreshCw, Check, Upload } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PhotoMissionPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("camera")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 사진 촬영 (실제로는 파일 선택으로 대체)
  const capturePhoto = () => {
    // 실제 구현에서는 카메라 API 사용
    // 여기서는 예시 이미지로 대체
    setCapturedImage("/peaceful-forest-stream.png")
  }

  // 갤러리에서 사진 선택
  const selectFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 실제 구현에서는 파일 처리 로직
      // 여기서는 예시 이미지로 대체
      setCapturedImage("/serene-landscape.png")
    }
  }

  // 사진 다시 찍기
  const retakePhoto = () => {
    setCapturedImage(null)
  }

  // 사진 완료
  const completePhotoCapture = () => {
    setIsCompleted(true)
  }

  // 사진 세션 저장
  const savePhotoSession = () => {
    // 실제 구현에서는 API 호출로 데이터 저장
    setIsSaved(true)

    // 로컬 스토리지에 저장 (예시)
    const photoData = {
      imageUrl: capturedImage,
      description: description,
      date: new Date().toISOString(),
    }

    try {
      const savedPhotos = JSON.parse(localStorage.getItem("photoHistory") || "[]")
      savedPhotos.push(photoData)
      localStorage.setItem("photoHistory", JSON.stringify(savedPhotos))
    } catch (error) {
      console.error("사진 데이터 저장 중 오류 발생:", error)
    }
  }

  return (
    <AppLayout showBack title="사진 기록 미션" rightAction={null}>
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 mb-4">
          <Card className="h-full border-none shadow-md overflow-hidden">
            <CardContent className="p-0 h-full">
              {!capturedImage ? (
                <div className="h-full flex flex-col">
                  <Tabs defaultValue="camera" className="h-full flex flex-col" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mx-4 mt-4">
                      <TabsTrigger value="camera">카메라</TabsTrigger>
                      <TabsTrigger value="gallery">갤러리</TabsTrigger>
                    </TabsList>

                    <TabsContent value="camera" className="flex-1 flex flex-col">
                      <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera className="h-12 w-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 mb-6">카메라로 지금 이 순간을 담아보세요</p>
                          <Button onClick={capturePhoto} className="px-6 py-2 rounded-full bg-gradient-soft shadow-md">
                            <Camera className="mr-2 h-5 w-5" />
                            사진 촬영하기
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="gallery" className="flex-1 flex flex-col">
                      <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 mb-6">갤러리에서 의미있는 사진을 선택해보세요</p>
                          <Button
                            onClick={selectFromGallery}
                            className="px-6 py-2 rounded-full bg-gradient-soft shadow-md"
                          >
                            <Upload className="mr-2 h-5 w-5" />
                            사진 선택하기
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : !isCompleted ? (
                <div className="h-full flex flex-col">
                  <div className="relative flex-1">
                    <Image
                      src={capturedImage || "/placeholder.svg"}
                      alt="촬영된 사진"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-4 flex justify-between">
                    <Button onClick={retakePhoto} variant="outline" className="rounded-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      다시 찍기
                    </Button>
                    <Button onClick={completePhotoCapture} className="rounded-full bg-gradient-soft shadow-md">
                      <Check className="mr-2 h-4 w-4" />이 사진으로 결정
                    </Button>
                  </div>
                </div>
              ) : !isSaved ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col p-4"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">사진에 담긴 이야기</h3>
                    <p className="text-sm text-gray-600">이 사진에 담긴 순간이나 감정을 기록해보세요.</p>
                  </div>

                  <div className="relative h-48 mb-4">
                    <Image
                      src={capturedImage || "/placeholder.svg"}
                      alt="촬영된 사진"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>

                  <div className="flex-1 mb-4">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="이 사진은 나에게..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <Button
                    onClick={savePhotoSession}
                    className="w-full py-3 rounded-full bg-gradient-soft shadow-lg shadow-primary/20"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    저장하기
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col p-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">사진 기록 완료!</h3>
                    <p className="text-gray-600">
                      소중한 순간을 사진으로 담았습니다. 이런 기록들이 모여 당신의 마음 여정을 만들어갑니다.
                    </p>
                  </div>

                  <div className="flex-1 mb-6">
                    <div className="relative h-48 mb-4 mx-auto">
                      <Image
                        src={capturedImage || "/placeholder.svg"}
                        alt="촬영된 사진"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>

                    {description && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 italic">"{description}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button
                      onClick={() => router.push(ROUTES.MISSION.LIST)}
                      className="flex-1 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      미션 목록으로
                    </Button>
                    <Button
                      onClick={() => {
                        // 미션 완료 처리
                        router.push(ROUTES.HOME)
                      }}
                      className="flex-1 py-3 rounded-full bg-gradient-soft shadow-lg shadow-primary/20"
                    >
                      미션 완료하기
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
