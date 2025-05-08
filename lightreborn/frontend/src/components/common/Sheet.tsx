'use client'

import { ReactNode } from 'react'
import { Card } from './Card'
import Button from './Button'

export interface SheetProps {
  title: string
  subTitle?: string
  headerRight?: ReactNode
  subHeaderRight?: ReactNode
  children: ReactNode
  onDownload?: () => void
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  loadingMessage?: string
  className?: string
}

/**
 * Sheet 컴포넌트 - 테이블, 차트 또는 기타 콘텐츠를 담는 컨테이너
 * Card 컴포넌트를 확장하며, 다운로드 버튼, 로딩 및 빈 상태 메시지 등의 기능을 추가합니다.
 */
export const Sheet = ({
  title,
  subTitle,
  headerRight,
  subHeaderRight,
  children,
  onDownload,
  isLoading = false,
  isEmpty = false,
  emptyMessage = '데이터가 없습니다.',
  loadingMessage = '데이터를 불러오는 중입니다...',
  className = '',
}: SheetProps) => {
  // 기본 다운로드 버튼을 제공하거나 사용자 정의 headerRight을 사용
  const headerRightContent = headerRight || (onDownload ? (
    <Button variant="primary" size="sm" onClick={onDownload}>
      다운로드
    </Button>
  ) : null)

  return (
    <Card
      title={title}
      subTitle={subTitle}
      headerRight={headerRightContent}
      subHeaderRight={subHeaderRight}
      className={className}
    >
      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-lg text-gray-500">{loadingMessage}</p>
        </div>
      ) : isEmpty ? (
        // 빈 상태
        <div className="flex items-center justify-center py-10">
          <p className="text-lg text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        // 일반 상태
        children
      )}
    </Card>
  )
}

export default Sheet
