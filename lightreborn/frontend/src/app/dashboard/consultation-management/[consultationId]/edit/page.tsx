"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { colors } from "@/constants/colors"
import { Calendar as CalendarIcon, File, Mic, Edit, Save, X, Loader, Trash2 } from "lucide-react"
import { UserInfo } from "@/components/common/UserInfo"
import { ColorBox } from "@/components/common/ColorBox"
import { useParams, useRouter } from "next/navigation"

interface AudioFile extends File {
  name: string;
}

export default function ConsultationPage() {

  const params = useParams()
  const consultationId = params.consultationId as string

  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"summary" | "keywords">("summary")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 음성 녹음 관련 상태
  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingStatus, setRecordingStatus] = useState("대기 중")
  
  // 분석 및 로딩 관련 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  
  // 녹음 시간 업데이트 함수
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [isRecording])
  
  // AI 분석 로딩 시뮬레이션
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAnalyzing && !analysisComplete) {
      interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsAnalyzing(false)
            setAnalysisComplete(true)
            return 100
          }
          return prev + 5
        })
      }, 300)
    }
    
    return () => clearInterval(interval)
  }, [isAnalyzing, analysisComplete])
  
  // 녹음 시간 포맷 함수
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0] as AudioFile)
    }
  }
  
  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0] as AudioFile)
    }
  }
  
  const handleFile = (file: AudioFile) => {
    // 파일 형식 검사 (.mp3, .wav 등)
    const validFileTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3']
    if (!validFileTypes.includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다. mp3 또는 wav 형식만 업로드 가능합니다.')
      return
    }
    
    setAudioFile(file)
    // 파일이 변경되면 분석 결과 초기화
    setAnalysisComplete(false)
    setAnalysisProgress(0)
  }
  
  // 녹음 시작/중지 함수
  const toggleRecording = () => {
    if (isRecording) {
      // 녹음 중지 로직
      setIsRecording(false)
      setRecordingStatus("녹음 완료")
      
      // 실제 애플리케이션에서는 여기서 녹음된 오디오를 처리
      // 이 예제에서는 가상의 파일을 생성
      const mockFile = new Blob([""], { type: "audio/mpeg" }) as unknown as AudioFile
      Object.defineProperty(mockFile, 'name', {
        value: "20250527_이OO_정기상담.mp3",
        writable: true
      })
      setAudioFile(mockFile)
      // 분석 결과 초기화
      setAnalysisComplete(false)
      setAnalysisProgress(0)
    } else {
      // 녹음 시작 로직
      setIsRecording(true)
      setRecordingTime(0)
      setRecordingStatus("녹음 중...")
    }
  }
  
  // AI 분석 시작 함수
  const startAnalysis = () => {
    if (!audioFile) {
      alert('분석할 파일이 없습니다. 파일을 업로드하거나 녹음해주세요.')
      return
    }
    
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisComplete(false)
  }

  const handleEdit = () => {
    router.push(`/dashboard/consultation-management/${consultationId}`)
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
          상담일지 수정하기
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleEdit}
          >
            <Edit size={18} className="mr-2" />
            <span>저장</span>
          </Button>
          <Button 
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-50"
          >
            <Trash2 size={18} className="mr-2" />
            삭제
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽 카드: 상담 기본 정보 */}
        <Card title="상담 기본 정보">
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 w-full rounded-lg">
                <h3 className="text-sm text-gray-500 mb-1">상담유형</h3>
                <p className="text-xl font-medium text-[#6B9AFF]">정기상담</p>
              </div>
              <div className="bg-gray-50 p-4 w-full col-span-2 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-1">상담일시</h3>
                <p className="text-xl font-medium text-[#6B9AFF]">2025. 06. 27. 13시 (60분)</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="상담대상자 정보">
          <div className="p-6 flex flex-row gap-4 justify-between">
            <UserInfo 
              name="이OO"
              id={consultationId || "0137"}
              gender="남"
              age={27}
            />
            <ColorBox 
              scoreText="58점"
              color="#FFCACA"
              title="고립 위험군"
            />
          </div>
        </Card>
      </div>
      <div className="grid-span-2">
        <Card title="원클릭 상담일지 작성하기">
          <div className="p-6">
            {audioFile ? (
              // 오디오 파일이 있는 경우
              <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Mic className="mr-2 text-gray-400" size={20} />
                  <p className="text-sm text-gray-600">
                    {audioFile.name || "20250527_이OO_정기상담.mp3"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="text" 
                    size="sm"
                    onClick={() => {
                      setAudioFile(null)
                      setAnalysisComplete(false)
                      setAnalysisProgress(0)
                    }}
                  >
                    <X size={16} className="text-gray-500" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {isRecording ? (
                  // 녹음 중인 경우
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-blue-600 font-medium">{recordingStatus}</span>
                      </div>
                      <span className="text-gray-500">{formatTime(recordingTime)}</span>
                    </div>
                    <Button
                      variant="primary"
                      onClick={toggleRecording}
                      className="w-full"
                    >
                      녹음 중지
                    </Button>
                  </div>
                ) : (
                  // 파일 드롭 영역
                  <div
                    className={`flex flex-col items-center justify-center ${
                      isDragging ? "bg-blue-100 border-blue-400" : "bg-blue-50"
                    } rounded-md p-6 mb-4 gap-3 transition-colors cursor-pointer border-2 border-dashed ${
                      isDragging ? "border-blue-400" : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleFileSelectClick}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".mp3,.wav"
                      onChange={handleFileChange}
                    />
                    <File size={24} className="text-blue-500 mb-2" />
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">상담 녹음 파일을 이 곳에 드래그하거나 클릭하여 추가하세요.</p>
                      <p className="text-xs text-gray-400">(mp3, wav 형식 지원)</p>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="flex flex-col items-center w-full mt-10">
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader className="animate-spin mr-2" size={32} />
                </div>
              ) : (
                <Button 
                  variant="primary" 
                  className="w-50"
                  onClick={startAnalysis}
                  disabled={!audioFile || isAnalyzing}
                > 
                  AI 음성파일 분석 시작
                </Button>
              )}
              
            </div>
            
            {/* 로딩 상태 표시 */}
            {isAnalyzing && (
              <div className="mt-6 flex flex-col items-center gap-5">
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* 분석 결과 (분석 완료 후에만 표시) */}
      {analysisComplete && (
        <div className="grid-span-2">
          <Card title="상담 요약 AI 기반 상담일지">
            <div className="p-6">
              <div className="flex border-b mb-6">
                <button
                  className={`px-4 py-2 ${activeTab === "summary" ? "border-b-2 border-[#6B9AFF] text-[#6B9AFF] font-medium" : "text-gray-500"}`}
                  onClick={() => setActiveTab("summary")}
                >
                  상담 주요 내용 요약
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "keywords" ? "border-b-2 border-[#6B9AFF] text-[#6B9AFF] font-medium" : "text-gray-500"}`}
                  onClick={() => setActiveTab("keywords")}
                >
                  대화자 발언 주요 키워드
                </button>
              </div>

              {activeTab === "summary" ? (
                <Card title="상담 주요 내용 요약">
                  <div className="space-y-4"> 
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">대화 진행 시에 온든 생활이 어느 정도 정착됨.</p>
                      <p className="text-sm">자신의 마음에 온든 생활이 어려고 사람을 대하는 것이 어색하고 괜찮은 이유로 추가적인 경제활동을 검토함.</p>
                      <p className="text-sm">부모와 함께 거주하나, 부모 측에서도 걱이이 없어 사생활 고려 상황에 맞게 지지해줌.</p>
                      <p className="text-sm">경제활동에 대한 의지는 있으나 시도 측에서 일상생활 고민 상황에도 꾸준히 보임.</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card title="대화자 발언 주요 키워드">
                  <div className="bg-[#FFF8E6] p-4 rounded-lg">
                    <p className="text-sm mb-4">사람이 많은 곳에 가면 너무 불편해요</p>
                    <p className="text-sm mb-4">혼자 있을 때 그냥 여유롭고 편해요. 하루가 어떻게 지나가는지도 모르겠고요</p>
                    <p className="text-sm">일은 하고 싶긴 한데... 무섭기도 해요. 나 같은 사람이 할 수 있을지 모르겠어요</p>
                  </div>
                </Card>
              )}

              <div className="mt-6">
                <Card title="상담자의 주요 개입 내용">
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">정서적 지지 및 공감 제공 (비난 없는 환경 조성)</p>
                      <p className="text-sm">경제활동을 준비를 위한 단계적 접근 방법 안내</p>
                      <p className="text-sm">지역 내 경제활동을 연계 프로그램 안내 및 참여 권유</p>
                      <p className="text-sm">자기 효능감 회복을 위한 긍정 경험 회상 유도</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                <Card title="특이사항 / 메모">
                  <div className="bg-[#FFF8E6] p-4 rounded-lg">
                    <p className="text-sm mb-2">
                      면접에 실패를 원인적으로 분석하여, 이번 상담에서는 비교적 적극적으로 표현한 모습이 있음. 상담자와의
                      관계 형성에 걸쳐 회복되다는 개인 자원의 관점에서 접근 필요.
                    </p>
                    <p className="text-sm">향후 비대면 형태의 직업 재활/상담 프로그램 우선 연결</p>
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                <Card title="다음 상담 계획">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon size={16} className="text-gray-400 mr-2" />
                      <p className="text-sm">2025. 05. 01(목) 오전 10시</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg">
                      <p className="text-sm pl-6">• 과제 수행 확인 및 피드백</p>
                      <p className="text-sm pl-6">• 경제활동 연계 기관 소개 및 정보 전달</p>
                      <p className="text-sm pl-6">• 자립 여정 시간화(이정표 만들기) 워크시트 적용 시도</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      )}

      {analysisComplete && (
        <div className="flex flex-row items-center justify-center gap-4">
          <Button variant="outline" size="lg">
            <Save size={18} className="mr-2" />
            임시 저장
          </Button>
          <Button variant="primary" size="lg">
            <Edit size={18} className="mr-2" />
            상담일지 작성 완료
          </Button>
        </div>
      )}
    </div>
  )
}