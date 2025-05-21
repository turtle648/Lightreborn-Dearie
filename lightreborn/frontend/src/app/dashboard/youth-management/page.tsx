"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/common/Card"
import { colors } from "@/constants/colors"
import Sheet from "@/components/common/Sheet"
import { useRouter } from "next/navigation"
import Input from "@/components/common/Input"
import { useYouthConsultationStore } from "@/stores/useYouthConsultaionStore"

// 단계 유형 정의
type ProcessStage = "SELF_DIAGNOSIS" | "COUNSELING" | "INTERNAL_REVIEW";
type IsolationLevel = "NON_RISK" | "AT_RISK" | "ISOLATED_YOUTH" | "RECLUSIVE_YOUTH";

export default function YouthManagement() {
  const router = useRouter();

  // 상태 필터링을 위한 선택된 진행 상태
  const [selectedStatus, setSelectedStatus] = useState<ProcessStage | null>(null);

  const { registeredYouthList, getRegisteredYouthList, isolatedYouthList, getIsolatedYouthList, uploadSurveyResponseWordFile } = useYouthConsultationStore();

  // 진행 중인 청년과 최종 판정된 청년을 분리하기 위한 상태
  const [processingYouthList, setProcessingYouthList] = useState<Array<{
    id: number,
    name: string, 
    age: number, 
    processStage: ProcessStage
  }>>([]);
  
  // 판정이 완료된 청년 데이터
  const [classifiedYouthList, setClassifiedYouthList] = useState<Array<{
    id: number, 
    name: string, 
    age: number, 
    status: string, 
    recentDate: string, 
    specialNote: string, 
    isolationLevel: IsolationLevel
  }>>([]);
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 파일 업로드 상태
  const [isUploading, setIsUploading] = useState(false);
  console.log("isUploading : ", isUploading);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 등록 청년 조회
        await getRegisteredYouthList();
        // 은둔 고립 청년 리스트 조회
        await getIsolatedYouthList();
        setIsLoading(false);
      } catch (error) {
        console.error("데이터 조회 오류:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getRegisteredYouthList, getIsolatedYouthList]);

  // isolatedYouthList와 registeredYouthList가 로드된 후 데이터 분류
  useEffect(() => {
    // 콘솔에 더 자세한 디버깅 정보 출력
    console.log("Raw registeredYouthList:", registeredYouthList);
    console.log("Raw isolatedYouthList:", isolatedYouthList);
    
    // 모든 청년 데이터 처리
    if (
      (isolatedYouthList && Array.isArray(isolatedYouthList)) ||
      (registeredYouthList && Array.isArray(registeredYouthList))
    ) {
      const processing: Array<{id: number, name: string, age: number, processStage: ProcessStage}> = [];
      const classified: Array<{id: number, name: string, age: number, status: string, recentDate: string, specialNote: string, isolationLevel: IsolationLevel}> = [];

      // 모든 청년 데이터 분류
      isolatedYouthList?.forEach(youth => {
        if (!youth) {
          console.log("isolatedYouthList에 데이터가 없습니다.");
          return;
        }
        
        console.log("Processing youth:", youth.name, "status:", youth.status);
        
        // 실제 필드 이름에 맞게 수정
        const processStep = youth.status || "SELF_DIAGNOSIS"; // status 필드 사용
        const isolationLevel = youth.status; // status 필드 사용
        
        // 아직 내부 회의까지 진행 중인 경우 (판정 전)
        if (["SELF_DIAGNOSIS", "COUNSELING", "INTERNAL_REVIEW"].includes(processStep)) {
          processing.push({
            id: youth.id,
            name: youth.name,
            age: youth.age,
            processStage: processStep as ProcessStage
          });
        } 
        // 판정이 완료된 경우 (모든 isolationLevel을 포함)
        else if (["NON_RISK", "AT_RISK"].includes(isolationLevel)) {
          let status;
          switch(isolationLevel) {
            case "NON_RISK":
              status = "비위험군";
              break;
            case "AT_RISK":
              status = "고립 위험군";
              break;
            case "ISOLATED_YOUTH":
              status = "고립 청년";
              break;
            case "RECLUSIVE_YOUTH":
              status = "은둔 청년";
              break;
            default:
              status = "미분류";
          }
          
          classified.push({
            id: youth.id,
            name: youth.name,
            age: youth.age,
            status: status,
            recentDate: youth.recentDate || "", // 실제 필드 이름 사용
            specialNote: youth.specialNote || "", // 실제 필드 이름 사용
            isolationLevel: isolationLevel as IsolationLevel
          });
        }
      });

      console.log("분류 결과 - 진행 중:", processing.length, "판정 완료:", classified.length);
      setProcessingYouthList(processing);
      setClassifiedYouthList(classified);
    }
  }, [isolatedYouthList, registeredYouthList]);

  // 필터링된 진행 중인 청년 데이터
  const filteredProcessingList = selectedStatus 
    ? processingYouthList.filter(item => item.processStage === selectedStatus) 
    : processingYouthList;

  // 진행 상태 아이콘 렌더링 함수
  const renderProgressIcons = (processStage: ProcessStage) => {
    const stages: ProcessStage[] = ["SELF_DIAGNOSIS", "COUNSELING", "INTERNAL_REVIEW"];
    const currentIndex = stages.indexOf(processStage);
    
    return (
      <div className="flex items-center">
        <div className="relative flex items-center w-full">
          {stages.map((stage, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={index} className="flex flex-col items-start" style={{ width: '33%' }}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive 
                      ? isCurrent 
                      ? "bg-blue-600 text-white ring-2 ring-blue-200" 
                      : "bg-blue-500 text-white" 
                      : "bg-gray-200 text-gray-500"
                    }`}
                    >
                    {index === 0 ? "✓" : index === 1 ? "📋" : "👥"}
                  </div>
                  <span className="mt-1 text-xs text-gray-500">
                    {index === 0 ? "자가척도 작성" : index === 1 ? "상담 진행" : "내부 회의"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 상태 필터 버튼 렌더링
  const renderStatusFilters = () => {
    const stages: ProcessStage[] = ["SELF_DIAGNOSIS", "COUNSELING", "INTERNAL_REVIEW"];
    const stageLabels = {
      "SELF_DIAGNOSIS": "자가척도 작성",
      "COUNSELING": "상담 진행",
      "INTERNAL_REVIEW": "내부 회의"
    };
    
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            selectedStatus === null ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setSelectedStatus(null)}
        >
          전체
        </button>
        {stages.map((stage, index) => (
          <button
            key={stage}
            className={`px-3 py-1 text-sm rounded-md flex items-center ${
              selectedStatus === stage ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedStatus(stage)}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 ${
              selectedStatus === stage ? "bg-white text-blue-500" : "bg-gray-300 text-gray-600"
            }`}>
              {index === 0 ? "✓" : index === 1 ? "📋" : "👥"}
            </span>
            {stageLabels[stage]}
          </button>
        ))}
      </div>
    );
  };

  // Sheet 컴포넌트 커스텀 컬럼 설정 
  const processingYouthColumns = [
    {key: "name", title: "이름", width: "15%"},
    {key: "age", title: "나이", width: "10%"},
    {
      key: "processStage", 
      title: "은둔고립청년 발굴 절차 진행도",
      width: "75%",
      render: (value: unknown) => (
        <div className="py-2 relative" style={{ height: '60px' }}>
          {renderProgressIcons(value as ProcessStage)}
        </div>
      )
    },
  ];

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    console.log("선택한 파일:", file.name);
    console.log("uploadFile : ", uploadedFile);
    
    // 파일이 선택되면 바로 업로드 시작
    if (file) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        await uploadSurveyResponseWordFile(formData);
        
        // 업로드 성공 후 목록 새로고침
        await getRegisteredYouthList();
        await getIsolatedYouthList();
        
        alert('설문 파일이 성공적으로 업로드되었습니다.');
        setIsUploading(false);
        setUploadedFile(null); // 업로드 후 파일 선택 상태 초기화
      } catch (error) {
        console.error("파일 업로드 오류:", error);
        alert('파일 업로드에 실패했습니다.');
        setIsUploading(false);
      }
    }
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
  };

  // 데이터 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
          상담 대상자 관리
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        상담 대상자 관리
      </h1>

      <div className="grid grid-cols-1">
        <Input 
          activeTab="youth-management"
          fileType="word" 
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          title="원클릭 은둔고립청년 척도설문 추가하기"
          description="새로운 척도설문 데이터 워드 파일을 이 곳에 드래그해주세요."
          maxFileSize={10}
          // disabled 속성 제거 (Input 컴포넌트에 없는 속성)
          // loading={isUploading}
        /> 
      </div>

      <div className="grid grid-cols-1">
        <Card title="진행 단계에 따른 청년 리스트">
          {renderStatusFilters()}
          <Sheet 
            className="border-none shadow-none"
            title="은둔고립청년 판정 진행 중"
            subTitle="아직 최종 판정되지 않은 청년 목록입니다. 은둔고립청년 판정 프로세스 진행도를 확인할 수 있습니다."
            data={filteredProcessingList}
            columns={processingYouthColumns}
            onRowClick={(record) => {
              console.log("행 클릭:", record);
              router.push(`/dashboard/youth-processing/${(record as { id: number }).id}`);
            }}
            // emptyText 속성 제거 (Sheet 컴포넌트에 없는 속성)
          /> 
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <Sheet 
          title="은둔고립청년 판정 완료 리스트"
          subTitle="판정 절차가 완료된 청년 리스트입니다."
          columns={[
            {key: "name", title: "이름"},   
            {key: "age", title: "나이"},
            {
              key: "status", 
              title: "고립은둔 유형",
              render: (value: unknown) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === "비위험군" ? "bg-green-100 text-green-800" :
                  value === "고립 위험군" ? "bg-yellow-100 text-yellow-800" :
                  value === "고립 청년" ? "bg-orange-100 text-orange-800" :
                  value === "은둔 청년" ? "bg-purple-100 text-purple-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {value as string}
                </span>
              )
            },
            {key: "recentDate", title: "최근상담일자"},
            {key: "specialNote", title: "특이사항"},
          ]}
          data={classifiedYouthList}
          onRowClick={(record) => {
            router.push(`/dashboard/youth-management/${(record as { id: number }).id}`);
            console.log("행 클릭:", record);
          }}
          // emptyText 속성 제거 (Sheet 컴포넌트에 없는 속성)
        />
      </div>
    </div>
  )
}