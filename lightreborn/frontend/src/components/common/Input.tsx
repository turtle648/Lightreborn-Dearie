"use client"

import { useState, useRef } from "react"
import { File } from 'lucide-react'
import Button from "./Button"
import { Card } from "./Card"

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
  fileType: FileType
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  title?: string
  description?: string
  maxFileSize?: number // MB 단위
  className?: string
}

export default function Input({
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
  
  return (
    <div className={`mb-4 ${className}`}>
      <Card
        title={title}
        subTitle={description}
      >
        {selectedFile ? (
          // 파일이 선택된 경우
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
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
              <Button
                variant="text"
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-red-500"
              >
                삭제
              </Button>
            </div>
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
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}