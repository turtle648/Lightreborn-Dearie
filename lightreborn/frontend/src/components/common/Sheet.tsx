'use client'

import { ReactNode } from 'react'
import { Card } from './Card'
import Button from './Button'
import Image from 'next/image'
import downloadIcon from '@/assets/download.svg'

// 테이블 데이터 타입
export interface TableColumn {
  key: string
  title: string
  render?: (value: unknown, record: unknown, index: number) => ReactNode
  width?: string | number
}

export interface SheetProps {
  // 기본 속성
  title: string
  subTitle?: string
  headerRight?: ReactNode
  subHeaderRight?: ReactNode
  onDownload?: () => void
  downloadDisabled?: boolean
  isLoading?: boolean
  emptyMessage?: string
  loadingMessage?: string
  className?: string
  footerContent?: ReactNode
  
  // 테이블 관련 속성
  data?: unknown[]
  columns?: TableColumn[]
  pagination?: {
    pageSize?: number
    currentPage?: number
    totalItems?: number
    onChange?: (page: number) => void
  }
  rowKey?: string | ((record: unknown) => string)
  onRowClick?: (record: unknown, index: number) => void
  dataTransform?: (data: unknown[]) => unknown[]
}

/**
 * Sheet 컴포넌트 - 테이블 데이터를 표시하는 컨테이너
 */
export default function Sheet({
  // 기본 속성
  title,
  subTitle,
  headerRight,
  subHeaderRight,
  onDownload,
  downloadDisabled = false,
  isLoading = false,
  emptyMessage = '데이터가 없습니다.',
  loadingMessage = '데이터를 불러오는 중입니다...',
  className = '',
  footerContent,
  
  // 테이블 관련 속성
  data = [],
  columns = [],
  pagination,
  rowKey = 'id',
  onRowClick,
  dataTransform,
}: SheetProps) {
  // 데이터 처리 - 내부 상태 없이 직접 변환
  const tableData = dataTransform ? dataTransform(data) : data;
  
  // 데이터 상태 계산
  const isEmpty = tableData.length === 0;
  
  // 기본 다운로드 버튼을 제공하거나 사용자 정의 headerRight을 사용
  const headerRightContent = headerRight || (onDownload ? (
    <Button 
      variant="secondary"
      size="sm"
      onClick={onDownload}
      disabled={downloadDisabled || isEmpty}
    >
      <Image src={downloadIcon} alt="download" width={24} height={24} />
    </Button>
  ) : null);
  
  // 행 키 생성 함수
  const getRowKey = (record: unknown, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return (record as Record<string, unknown>)[rowKey as string]?.toString() || index.toString()
  }
  
  // 테이블 렌더링
  const renderTable = () => {
    console.log("[Sheet] Rendering table. Data length:", tableData.length);
    console.log("[Sheet] Actual data:", tableData);
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-10">
          <p className="text-lg text-gray-500">{loadingMessage}</p>
        </div>
      )
    }
    
    if (isEmpty) {
      return (
        <div className="flex items-center justify-center py-10">
          <p className="text-lg text-gray-500">{emptyMessage}</p>
        </div>
      )
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={column.key || index}
                  className="px-6 py-3 bg-blue-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((record, index) => (
              <tr 
                key={getRowKey(record, index)}
                onClick={onRowClick ? () => onRowClick(record, index) : undefined}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
              >
                {columns.map((column, colIndex) => {
                  const typeRecord = record as Record<string, unknown>;
                  const cellValue = typeRecord[column.key as string];
                  
                  return (
                    <td key={`${getRowKey(record, index)}-${column.key || colIndex}`} className="px-6 py-4 whitespace-nowrap">
                      {column.render 
                        ? column.render(cellValue, typeRecord, index)
                        : (
                            cellValue === null || cellValue === undefined 
                              ? ''
                              : String(cellValue)
                          )
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 페이지네이션 */}
        {pagination && pagination.totalItems && pagination.totalItems > 0 && (
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                총 <span className="font-medium">{pagination.totalItems}</span> 항목
              </p>
            </div>
            {/* 페이지네이션 컨트롤은 여기에 추가 가능 */}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card
      title={title}
      subTitle={subTitle}
      headerRight={headerRightContent}
      subHeaderRight={subHeaderRight}
      className={className}
    >
      {/* 테이블 렌더링 */}
      {renderTable()}

      {/* 푸터 영역 (선택적) */}
      {footerContent && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          {footerContent}
        </div>
      )}
    </Card>
  )
}