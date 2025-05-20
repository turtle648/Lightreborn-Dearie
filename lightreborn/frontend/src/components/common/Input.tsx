"use client"

import { useState, useRef } from "react"
import { File, Check, AlertCircle } from 'lucide-react'
import Button from "./Button"
import { Card } from "./Card"
import { updatePromotionNetworkData, updateWelfareCenterData, updateYouthPopulationData } from "@/apis/data-input"
import { useYouthConsultationStore } from "@/stores/useYouthConsultaionStore"


// 파일 유형 정의
export type FileType = 'spreadsheet' | 'word'

// 파일 타입별 설정
const fileTypeConfig = {
  spreadsheet: {
    accept: '.xlsx,.xls,.csv',
    text: '엑셀 또는 CSV 파일을 이 곳에 드래그하거나 클릭하여 추가하세요.',
    fileTypeText: '(xlsx, xls, csv 형식 지원)',
    icon: 'spreadsheet'
  },
  word: {
    accept: '.doc,.docx',
    text: '워드 파일을 이 곳에 드래그하거나 클릭하여 추가하세요.',
    fileTypeText: '(doc, docx 형식 지원)',
    icon: 'word'
  }
}

interface InputProps {
  activeTab: string
  fileType: FileType
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  title?: string
  description?: string
  maxFileSize?: number // MB 단위
  className?: string
}

export default function Input({
  activeTab,
  fileType = 'spreadsheet',
  onFileSelect,
  onFileRemove,
  title,
  description,
  maxFileSize = 10, // 기본 10MB
  className = ''
}: InputProps) {

  // 상태 관리
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  
  // 파일 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 파일 드래그 이벤트 핸들러
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)
    setUploadSuccess(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }
  
  // 파일 선택 클릭 핸들러
  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  // 파일 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setUploadSuccess(false)
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0])
    }
  }
  
  // 파일 선택 처리
  const handleFileSelection = (file: File) => {
    // 파일 타입 검증
    const acceptTypes = fileTypeConfig[fileType].accept.split(',')
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!acceptTypes.includes(fileExtension)) {
      setError(`지원되지 않는 파일 형식입니다. ${fileTypeConfig[fileType].fileTypeText} 파일만 업로드 가능합니다.`)
      return
    }
    
    // 파일 크기 검증 (MB 단위)
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`파일 크기는 ${maxFileSize}MB 이하여야 합니다.`)
      return
    }
    
    setSelectedFile(file)
    if (onFileSelect) {
      onFileSelect(file)
    }
  }
  
  // 파일 제거 핸들러
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadSuccess(false)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onFileRemove) {
      onFileRemove()
    }
  }
  
  // 파일 아이콘 선택
  const getFileIcon = () => {
    // 선택된 파일이 있다면 파일 확장자에 따라 아이콘 결정
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()
      
      if (fileExtension === 'csv') {
        return (
          <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        return (
          <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      } else if (fileExtension === 'doc' || fileExtension === 'docx') {
        return (
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 15L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 18L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      }
    }
    
    // 선택된 파일이 없다면 파일 타입에 따라 기본 아이콘 표시
    switch (fileTypeConfig[fileType].icon) {
      case 'spreadsheet':
        return (
          <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'word':
        return (
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 15L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 18L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        return <File size={32} className="text-blue-500" />
    }
  }

  const { uploadSurveyResponseWordFile } = useYouthConsultationStore();

  const handleSubmitFile = async (file: File) => {
    if (!file) {
      setError("파일을 선택해주세요.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setUploadSuccess(false);
    
    try {
      let response;
      console.log("input.tsx - handleSubmitFile 실행 - activeTab:", activeTab, "selectedFile:", file);
      
      if (activeTab === "youth-population") {
        response = await updateYouthPopulationData(file);
      } else if (activeTab === "promotion-network") {
        response = await updatePromotionNetworkData(file);
      } else if (activeTab === "welfare-center") {
        response = await updateWelfareCenterData(file);
      } else if (activeTab === "youth-management") {
        const formData = new FormData();
        formData.append("file", file);
        response = await uploadSurveyResponseWordFile(formData);
      } else {
        throw new Error("유효하지 않은 activeTab 값입니다.");
      }
      
      // 성공 처리
      setUploadSuccess(true);
      setUploadMessage(response.message || "파일이 성공적으로 업로드되었습니다.");
      console.log("input.tsx - handleSubmitFile 실행 - response : ", response)

      // // 파일 선택 상태 초기화 (선택적)
      // setSelectedFile(null);
      // if (fileInputRef.current) {
      //   fileInputRef.current.value = '';
      // }
      
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      
      // 오류 메시지 설정
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("파일 업로드 중 오류가 발생했습니다.");
      }
      setUploadSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 다른 파일 업로드하기 핸들러
  const handleUploadAnotherFile = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <Card
        title={title}
        subTitle={description}
      >
        {selectedFile ? (
          // 파일이 선택된 경우
          <div className="flex flex-col gap-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getFileIcon()}
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600 truncate" style={{ maxWidth: '200px' }}>
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isLoading && !uploadSuccess && (
                <Button
                  variant="text"
                  onClick={handleRemoveFile}
                  className="text-gray-500 hover:text-red-500"
                >
                  삭제
                </Button>
              )}
            </div>
            
            {uploadSuccess ? (
              // 업로드 성공 시 표시
              <div className="mt-2">
                <div className="flex items-center text-green-600 mb-4">
                  <Check className="w-5 h-5 mr-2" />
                  <p className="text-sm font-medium">{uploadMessage}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleUploadAnotherFile}
                  className="w-full"
                >
                  다른 파일 업로드하기
                </Button>
              </div>
            ) : (
              // 업로드 버튼 (로딩 중이거나 성공하지 않은 경우)
              <Button
                variant="primary"
                onClick={() => handleSubmitFile(selectedFile)}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    업로드 중...
                  </span>
                ) : (
                  "파일 업로드하기"
                )}
              </Button>
            )}
          </div>
        ) : (
          // 파일이 선택되지 않은 경우 (드롭 영역)
          <div
            className={`flex flex-col items-center justify-center ${
              isDragging ? "bg-blue-100 border-blue-400" : "bg-blue-50"
            } rounded-md p-6 gap-3 transition-colors cursor-pointer border-2 border-dashed ${
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
              accept={fileTypeConfig[fileType].accept}
              onChange={handleFileChange}
            />
            
            {getFileIcon()}
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">{fileTypeConfig[fileType].text}</p>
              <p className="text-xs text-gray-400">{fileTypeConfig[fileType].fileTypeText}</p>
            </div>
          </div>
        )}
      </Card>
      
      {error && (
        <div className="flex items-center text-red-500 mt-2">
          <AlertCircle className="w-4 h-4 mr-1" />
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  )
}