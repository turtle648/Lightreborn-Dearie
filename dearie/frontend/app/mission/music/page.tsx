"use client"

import { useState, useRef } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, SkipForward, SkipBack, Save, Music2 } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export default function MusicMissionPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // 3분 (초 단위)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [reflection, setReflection] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 음악 재생/일시정지
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // 음악 완료
  const completeMusicSession = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsPlaying(false)
    setIsCompleted(true)
  }

  // 음악 세션 저장
  const saveMusicSession = () => {
    // 실제 구현에서는 API 호출로 데이터 저장
    setIsSaved(true)

    // 로컬 스토리지에 저장 (예시)
    const musicData = {
      songTitle: "고요한 밤의 멜로디",
      artist: "마음의 소리",
      duration: duration,
      mood: selectedMood,
      reflection: reflection,
      date: new Date().toISOString(),
    }

    try {
      const savedMusic = JSON.parse(localStorage.getItem("musicHistory") || "[]")
      savedMusic.push(musicData)
      localStorage.setItem("musicHistory", JSON.stringify(savedMusic))
    } catch (error) {
      console.error("음악 세션 데이터 저장 중 오류 발생:", error)
    }
  }

  // 시간 포맷팅 (초 -> mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // 기분 선택
  const moods = [
    { name: "평온함", color: "bg-blue-100 text-blue-800" },
    { name: "기쁨", color: "bg-yellow-100 text-yellow-800" },
    { name: "감상적", color: "bg-purple-100 text-purple-800" },
    { name: "활력", color: "bg-green-100 text-green-800" },
    { name: "몽환적", color: "bg-indigo-100 text-indigo-800" },
  ]

  return (
    <AppLayout showBack title="음악 감상 미션" rightAction={null}>
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 mb-4">
          <Card className="h-full border-none shadow-md overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center">
              {!isCompleted ? (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-64 h-64 mb-6">
                    <Image
                      src="/placeholder-uv8ap.png"
                      alt="음악 앨범 커버"
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg drop-shadow-md">고요한 밤의 멜로디</h3>
                      <p className="text-white/90 text-sm drop-shadow-md">마음의 소리</p>
                    </div>
                  </div>

                  <div className="w-full max-w-md mb-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      onValueChange={(value) => {
                        setCurrentTime(value[0])
                        if (audioRef.current) {
                          audioRef.current.currentTime = value[0]
                        }
                      }}
                      className="mb-4"
                    />
                    <div className="flex justify-center items-center gap-4">
                      <Button variant="ghost" size="icon" className="rounded-full h-12 w-12">
                        <SkipBack className="h-6 w-6" />
                      </Button>
                      <Button
                        onClick={togglePlayback}
                        variant="default"
                        size="icon"
                        className="rounded-full h-16 w-16 bg-gradient-soft shadow-lg shadow-primary/20"
                      >
                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full h-12 w-12">
                        <SkipForward className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>

                  <audio
                    ref={audioRef}
                    src="/peaceful-meditation.mp3"
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />

                  <Button
                    onClick={completeMusicSession}
                    className="mt-4 px-6 py-2 rounded-full bg-primary hover:bg-primary/90"
                  >
                    음악 감상 완료
                  </Button>
                </div>
              ) : !isSaved ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-md"
                >
                  <h3 className="text-xl font-bold mb-4 text-center">음악을 듣고 느낀 감정</h3>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">이 음악을 들으면서 어떤 감정을 느꼈나요?</p>
                    <div className="flex flex-wrap gap-2">
                      {moods.map((mood) => (
                        <Badge
                          key={mood.name}
                          variant="outline"
                          className={`cursor-pointer ${
                            selectedMood === mood.name
                              ? `${mood.color} border-2`
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                          onClick={() => setSelectedMood(mood.name)}
                        >
                          {mood.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">음악을 들으며 떠오른 생각이나 느낌을 기록해보세요.</p>
                    <Textarea
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder="이 음악은 나에게..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <Button
                    onClick={saveMusicSession}
                    className="w-full py-3 rounded-full bg-gradient-soft shadow-lg shadow-primary/20"
                    disabled={!selectedMood && reflection.trim().length === 0}
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
                  className="w-full max-w-md text-center"
                >
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Music2 className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">음악 감상 완료!</h3>
                    <p className="text-gray-600">
                      음악을 통해 마음을 돌보는 시간을 가졌습니다. 이런 순간들이 쌓여 더 건강한 마음을 만들어갑니다.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg mb-6">
                    <p className="font-medium mb-1">선택한 감정</p>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {selectedMood || "선택 안함"}
                    </Badge>

                    {reflection && (
                      <>
                        <p className="font-medium mt-3 mb-1">나의 기록</p>
                        <p className="text-sm text-gray-600 italic">"{reflection}"</p>
                      </>
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
