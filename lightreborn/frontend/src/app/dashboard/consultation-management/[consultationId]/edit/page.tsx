"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { colors } from "@/constants/colors"
import { Calendar as File, Mic, Save, X, Loader, Trash2, ArrowLeft, Upload } from "lucide-react"
import { UserInfo } from "@/components/common/UserInfo"
import { ColorBox } from "@/components/common/ColorBox"
import { useParams, useRouter } from "next/navigation"
import { useYouthConsultationStore } from "@/stores/useYouthConsultaionStore"

interface AudioFile extends File {
  name: string;
}

interface AICommentResult {
  transcript?: string;
  summary: string;
  client: string;
  counselor: string;
  memos: string;
}

// API 응답 타입 정의
interface AICommentResponse {
  code?: number;
  message?: string;
  result: AICommentResult;
}

export default function ConsultationEditPage() {
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
  
  // AI 코멘트 관련 상태
  const [summaryText, setSummaryText] = useState<string>("")
  const [clientKeywords, setClientKeywords] = useState<string>("")
  const [counselorKeywords, setCounselorKeywords] = useState<string>("")
  const [memoText, setMemoText] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  
  // API 상담 정보 불러오기
  const { 
    consultationDetail, 
    getConsultationDetail, 
    getConsultationComment,
    updateConsultationComment 
  } = useYouthConsultationStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultationDetail = async () => {
      try {
        setIsLoading(true);
        await getConsultationDetail(Number(consultationId));
        setIsLoading(false);
      } catch (err) {
        setError('상담 정보를 불러오는 데 실패했습니다.');
        setIsLoading(false);
        console.error('상담 정보 로딩 에러:', err);
      }
    };
  
    fetchConsultationDetail();
  }, [consultationId, getConsultationDetail]);
  
  // 녹음 시간 업데이트 함수
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1500)
    }
    
    return () => clearInterval(interval)
  }, [isRecording])
  
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
    const validFileTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/x-m4a']
    if (!validFileTypes.includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다. mp3, wav, m4a 형식만 업로드 가능합니다.')
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
  const startAnalysis = async () => {
    if (!audioFile) {
      alert('분석할 파일이 없습니다. 파일을 업로드하거나 녹음해주세요.')
      return
    }
    
    // 고립 청년 ID 가져오기
    if (!consultationDetail || !consultationDetail.result.counselingLog.isolatedYouth.id) {
      alert('상담 대상자 정보를 불러올 수 없습니다.')
      return
    }

    const counselingLogId = Number(consultationId)
    
    try {
      setIsAnalyzing(true)
      setAnalysisProgress(0)
      
      // 가상의 진행 상태 업데이트 (실제로는 서버에서 진행 상태를 받을 수 있음)
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 5
        })
      }, 300)
      
      // AI 코멘트 분석 요청
      try {
        // getConsultationComment의 반환값을 명시적으로 타입 캐스팅
        const response = await getConsultationComment(audioFile, counselingLogId) as unknown as AICommentResponse;
        
        // 분석이 완료되면 결과를 상태에 설정
        if (response && response.result) {
          setSummaryText(response.result.summary || "")
          setClientKeywords(response.result.client || "")
          setCounselorKeywords(response.result.counselor || "")
          setMemoText(response.result.memos || "")
        }
      } catch (apiError) {
        console.error("API 에러:", apiError);
        // API 에러 처리
        // 개발 중에는 테스트 데이터를 사용할 수 있습니다
        console.log("테스트 데이터 사용 중...");
        
        // 테스트 데이터로 폼 채우기
        setSummaryText("내담자는 최근 사회적 관계 형성에 어려움을 겪고 있으며, 불안과 우울 증상을 호소했습니다. 특히 가족 내 갈등이 지속되는 상황에서 집에만 머무르는 시간이 증가했으며, 적절한 사회적 기술 부족으로 또래 관계 형성에 어려움을 겪고 있습니다.");
        setClientKeywords("불안, 우울, 가족갈등, 사회적고립, 자존감 저하");
        setCounselorKeywords("경청, 공감, 심리지지, 사회기술훈련 제안, 자원연계 안내");
        setMemoText("다음 상담에서는 구체적인 사회활동 참여 방안과 가족 갈등 해결 전략에 대해 논의할 예정입니다. 지역 청년 자조모임 정보 공유가 필요합니다.");
      }
      
      // 진행 상태 완료 처리
      clearInterval(interval)
      setAnalysisProgress(100)
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
      }, 500)
    } catch (error) {
      console.error("AI 분석 실패:", error)
      alert('AI 분석에 실패했습니다. 다시 시도해주세요.')
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  // 텍스트 입력 핸들러
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummaryText(e.target.value)
  }
  
  const handleClientKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClientKeywords(e.target.value)
  }
  
  const handleCounselorKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCounselorKeywords(e.target.value)
  }
  
  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemoText(e.target.value)
  }
  
  // 저장하고 상세 페이지로 이동
  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateConsultationComment(
        Number(consultationId),
        summaryText,
        clientKeywords,
        counselorKeywords,
        memoText
      )
      alert("상담 일지가 저장되었습니다.")
      router.push(`/dashboard/consultation-management/${consultationId}`)
    } catch (error) {
      console.error("상담 일지 저장 실패:", error)
      alert("상담 일지 저장에 실패했습니다.")
      setIsSaving(false)
    }
  }
  
  // 다른 파일 업로드
  const handleUploadNew = () => {
    if (confirm("새 파일을 업로드하면 현재 분석 결과가 사라집니다. 계속하시겠습니까?")) {
      setAudioFile(null)
      setAnalysisComplete(false)
      setAnalysisProgress(0)
    }
  }
  
  // 삭제 기능
  const handleDelete = () => {
    if (confirm("정말로 이 상담 일지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // 실제 애플리케이션에서는 여기서 API 호출로 데이터 삭제
      alert("상담 일지가 삭제되었습니다.")
      router.push('/dashboard/consultation-management')
    }
  }
  
  // 목록으로 돌아가기
  const handleBack = () => {
    if (analysisComplete && !confirm("변경 사항이 저장되지 않습니다. 정말로 나가시겠습니까?")) {
      return;
    }
    router.push(`/dashboard/consultation-management/${consultationId}`)
  }
  
  // 날짜 포맷팅 함수
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // API 데이터 또는 기본 데이터 사용
  const displayData = consultationDetail ? {
    type: "정기상담",
    date: consultationDetail.result.counselingLog.consultationDate,
    client: {
      name: consultationDetail.result.counselingLog.isolatedYouth.personalInfo.name,
      id: consultationDetail.result.counselingLog.id.toString(),
      age: consultationDetail.result.counselingLog.isolatedYouth.personalInfo.age,
      score: consultationDetail.result.counselingLog.isolatedYouth.isolatedScore,
      riskLevel: consultationDetail.result.counselingLog.isolatedYouth.isolationLevel === "RECLUSIVE_YOUTH" ? "고립 위험군" : "일반"
    }
  } : {
    type: "정기상담",
    date: "2025-06-27",
    client: {
      name: "이OO",
      id: consultationId || "0137",
      age: 27,
      score: 58,
      riskLevel: "고립 위험군"
    }
  };

  if (isLoading) {
    return <div className="p-6">데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="text" 
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft size={18} className="mr-2" />
            돌아가기
          </Button>
          <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
            상담일지 수정하기
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-50"
            onClick={handleDelete}
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
                <p className="text-xl font-medium text-[#6B9AFF]">{displayData.type}</p>
              </div>
              <div className="bg-gray-50 p-4 w-full col-span-2 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-1">상담일시</h3>
                <p className="text-xl font-medium text-[#6B9AFF]">
                  {new Date(displayData.date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })} {new Date(displayData.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="상담대상자 정보">
          <div 
            className="p-6 flex flex-row gap-4 justify-between"
            onClick={() => router.push(`/dashboard/youth-management/${displayData.client.id}`)}
          >
            <UserInfo 
              name={displayData.client.name}
              id={displayData.client.id}
              age={displayData.client.age}
            />
            <ColorBox 
              scoreText={`${displayData.client.score}점`}
              color="#FFCACA"
              title={displayData.client.riskLevel}
            />
          </div>
        </Card>
      </div>
      
      {!analysisComplete && (
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
                      disabled={isAnalyzing}
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
                        accept=".mp3,.wav,.m4a"
                        onChange={handleFileChange}
                      />
                      <File size={24} className="text-blue-500 mb-2" />
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">상담 녹음 파일을 이 곳에 드래그하거나 클릭하여 추가하세요.</p>
                        <p className="text-xs text-gray-400">(mp3, wav, m4a 형식 지원)</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex flex-col items-center w-full mt-10">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-5">
                    <Loader className="animate-spin mb-4" size={32} />
                    <div className="w-1/2 bg-gray-200 rounded-full h-2.5 mb-4">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">AI가 상담 녹음을 분석 중입니다... {analysisProgress}%</p>
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
            </div>
          </Card>
        </div>
      )}
      
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
                <div className="flex flex-col mt-6 gap-6">
                  <Card title="상담 주요 내용 요약">
                    <div className="space-y-4 p-4"> 
                      <textarea
                        className="w-full p-3 rounded-lg min-h-[200px]"
                        value={summaryText}
                        onChange={handleSummaryChange}
                        placeholder="상담 내용 요약을 입력하세요..."
                      />
                    </div>
                  </Card>

                  <Card title="특이사항 / 메모">
                    <div className="p-4">
                      <textarea
                        className="w-full p-3 rounded-lg min-h-[150px] bg-[#FFF8E6]"
                        value={memoText}
                        onChange={handleMemoChange}
                        placeholder="특이사항 및 메모를 입력하세요..."
                      />
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col mt-6 gap-6">
                  <Card title="대화자 발언 주요 키워드">
                    <div className="p-4">
                      <textarea
                        className="w-full p-3 rounded-lg min-h-[150px] bg-[#FFF8E6]"
                        value={clientKeywords}
                        onChange={handleClientKeywordsChange}
                        placeholder="내담자의 주요 키워드를 입력하세요... (쉼표로 구분)"
                      />
                    </div>
                  </Card>
                  <Card title="상담자의 주요 개입 내용">
                    <div className="p-4">
                      <textarea
                        className="w-full p-3 rounded-lg min-h-[150px]"
                        value={counselorKeywords}
                        onChange={handleCounselorKeywordsChange}
                        placeholder="상담자의 주요 개입 내용을 입력하세요... (쉼표로 구분)"
                      />
                    </div>
                  </Card>
                </div>
              )}

              {/* 다른 파일 업로드 버튼 */}
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleUploadNew}
                >
                  <Upload size={18} />
                  다른 파일 업로드
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {analysisComplete && (
        <div className="flex flex-row items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleBack}
          >
            <div className="flex flex-cols items-center">
              <X size={18} className="mr-2 flex" />
              <span className="flex">취소</span>
            </div>
          </Button>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <div className="flex flex-cols items-center">
              {isSaving ? <Loader className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
              상담일지 저장
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}