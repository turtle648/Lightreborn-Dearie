"use client"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { colors } from "@/constants/colors"
import Image from "next/image"
import addfile from "@/assets/addfile.svg"
import Sheet from "@/components/common/Sheet"

// 진행 상태 유형 정의
type ProgressStatus = "온라인 자가척도 작성" | "상담 진행" | "내부 회의 진행";

export default function YouthManagement() {
  // 파일 드래그 드롭 상태
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // 파일 입력 ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 상태 필터링을 위한 선택된 진행 상태
  const [selectedStatus, setSelectedStatus] = useState<ProgressStatus | null>(null);
  
  // 신규 설문 등록 청년 데이터
  const newSurveyData = [
    {name: "이OO", age: 27, progress: "온라인 자가척도 작성"},
    {name: "김OO", age: 25, progress: "상담 진행"},
    {name: "박OO", age: 22, progress: "내부 회의 진행"},
    {name: "최OO", age: 29, progress: "온라인 자가척도 작성"},
    {name: "정OO", age: 26, progress: "상담 진행"},
  ];
  
  // 은둔고립청년 데이터
  const youthData = [
    {name: "이OO", age: 27, status: "고립 위험군", recentDate: "2025.06.17", specialNote: "고립위험군 변경"},
    {name: "김OO", age: 25, status: "고립 청년", recentDate: "2025.06.15", specialNote: "상담 예약 필요"},
    {name: "박OO", age: 22, status: "비위험군", recentDate: "2025.06.10", specialNote: "온든/고립지표 개선"},
    {name: "최OO", age: 29, status: "고립 위험군", recentDate: "2025.05.22", specialNote: "가족 상담 필요"},
    {name: "정OO", age: 26, status: "은둔 청년", recentDate: "2025.05.15", specialNote: "전화 상담 진행"},
  ];

  // 드래그 이벤트 핸들러
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // 파일 유형 검사 (예: .docx 파일만 허용)
      if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        setUploadedFile(file);
        // 여기서 파일 업로드 로직 구현
        console.log("파일 업로드됨:", file.name);
      } else {
        alert("워드(.doc, .docx) 파일만 업로드 가능합니다.");
      }
    }
  }, []);

  // 파일 선택 클릭 핸들러
  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        setUploadedFile(file);
        // 여기서 파일 업로드 로직 구현
        console.log("파일 업로드됨:", file.name);
      } else {
        alert("워드(.doc, .docx) 파일만 업로드 가능합니다.");
      }
    }
  };

  // 필터링된 신규 설문 데이터
  const filteredNewSurveyData = selectedStatus 
    ? newSurveyData.filter(item => item.progress === selectedStatus) 
    : newSurveyData;

  // 진행 상태 아이콘 렌더링 함수
  const renderProgressIcons = (progress: string) => {
    const statuses: ProgressStatus[] = ["온라인 자가척도 작성", "상담 진행", "내부 회의 진행"];
    const currentIndex = statuses.indexOf(progress as ProgressStatus);
    
    return (
      <div className="flex items-center">
        <div className="relative flex items-center w-full">
          {statuses.map((status, index) => {
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
                    {index === 0 ? "자가척도 작성" : index === 1 ? "상담 진행" : "내부 회의 진행"}
                  </span>
                </div>
                
                {/* 연결선 */}
                {/* {index < statuses.length - 1 && (
                  <div className="absolute h-1" style={{ 
                    left: `calc(${index * 33}% + 28px)`,  // 노드 너비(8px) + 오른쪽 여백(20px)
                    width: 'calc(33% - 36px)',            // 33% 너비에서 양쪽 노드 반경 제외
                    top: '14px',
                    backgroundColor: isActive ? '#3b82f6' : '#e5e7eb'
                  }}></div>
                )} */}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 상태 필터 버튼 렌더링
  const renderStatusFilters = () => {
    const statuses: ProgressStatus[] = ["온라인 자가척도 작성", "상담 진행", "내부 회의 진행"];
    
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
        {statuses.map((status, index) => (
          <button
            key={status}
            className={`px-3 py-1 text-sm rounded-md flex items-center ${
              selectedStatus === status ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedStatus(status)}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 ${
              selectedStatus === status ? "bg-white text-blue-500" : "bg-gray-300 text-gray-600"
            }`}>
              {index === 0 ? "✓" : index === 1 ? "📋" : "👥"}
            </span>
            {status === "온라인 자가척도 작성" ? "자가척도" : 
             status === "상담 진행" ? "상담 진행" : "내부 회의"}
          </button>
        ))}
      </div>
    );
  };

  // Sheet 컴포넌트 커스텀 컬럼 설정 
  const newSurveyColumns = [
    {key: "name", title: "이름", width: "15%"},
    {key: "age", title: "나이", width: "10%"},
    {
      key: "progress", 
      title: "은둔고립청년 발굴 절차 진행도",
      width: "75%",
      // 여기서 이 컬럼의 위치를 조정할 수 있나? 
      render: (value: unknown) => (
        <div className="py-2 relative" style={{ height: '60px' }}>
          {renderProgressIcons(value as string)}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        상담 대상자 관리
      </h1>

      <div className="grid grid-cols-1">
        <Card 
          title="원클릭 은둔고립청년 척도설문 추가하기"
        >
          <div
            className={`flex flex-col items-center justify-center ${
              isDragging ? "bg-blue-100 border-blue-400" : "bg-blue-50"
            } rounded-md p-10 m-5 gap-5 transition-colors cursor-pointer border-2 border-dashed ${
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
              accept=".doc,.docx" 
              onChange={handleFileChange}
            />
            <Image 
              src={addfile} 
              alt="원클릭 은둔고립청년 척도설문 추가하기"
              width={48}
              height={48}
            />
            {uploadedFile ? (
              <div className="flex flex-col items-center">
                <p className="text-md font-medium">파일이 선택되었습니다: {uploadedFile.name}</p>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 여기에 업로드 처리 로직 추가
                    alert("파일 업로드를 시작합니다.");
                  }}
                >
                  파일 업로드
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">새로운 척도설문 데이터 워드 파일을 이 곳에 드래그해주세요.</p>
                <p className="text-sm text-gray-500">신규 유저일 경우 청년 리스트에 추가하고 척도설문 점수를 추가합니다.</p>
                <p className="text-sm text-gray-500">데이터가 있는 청년의 파일일 경우 기존 청년의 정보를 업데이트합니다.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <Card title="신규 설문 등록 청년 리스트">
          {renderStatusFilters()}
          <Sheet 
            className="border-none shadow-none"
            title="진행 상태에 따른 청년 리스트"
            subTitle="은둔고립청년 판정 프로세스 진행도를 확인할 수 있습니다."
            data={filteredNewSurveyData}
            columns={newSurveyColumns}
            onRowClick={(record) => {
              console.log("행 클릭:", record);
              // 여기에 행 클릭 시 처리 로직 추가
            }}
          /> 
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <Sheet 
          title="은둔고립청년 리스트"
          subTitle="센터에 등록된 은둔고립청년 리스트입니다."
          columns={[
            {key: "name", title: "이름"},   
            {key: "age", title: "나이"},
            {
              key: "status", 
              title: "고립은둔 유형",
              render: (value: unknown) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === "은둔 청년" ? "bg-purple-100 text-purple-800" :
                  value === "고립 위험군" ? "bg-yellow-100 text-yellow-800" :
                  value === "고립 청년" ? "bg-orange-100 text-orange-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {value as string}
                </span>
              )
            },
            {key: "recentDate", title: "최근상담일자"},
            {key: "specialNote", title: "특이사항"},
          ]}
          data={youthData}
        />
      </div>
    </div>
  )
}