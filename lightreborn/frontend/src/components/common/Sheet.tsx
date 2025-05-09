'use client'

import { ReactNode, useState, useEffect } from 'react'
import { Card } from './Card'
import Button from './Button'
import BarChart, { BarChartItem } from './rechart/BarChart'
import Image from 'next/image'
import downloadIcon from '@/assets/download.svg'

// 테이블 데이터 타입
export interface TableColumn<T = any> {
  key: string
  title: string
  render?: (value: any, record: T, index: number) => ReactNode
  width?: string | number
}

export type SheetViewType = 'table' | 'chart' | 'custom'

export interface SheetProps<T = any> {
  // 기본 속성
  title: string
  subTitle?: string
  headerRight?: ReactNode
  subHeaderRight?: ReactNode
  children?: ReactNode
  onDownload?: () => void
  downloadDisabled?: boolean
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  loadingMessage?: string
  className?: string
  contentClassName?: string
  footerContent?: ReactNode
  
  // 데이터 관련 속성
  viewType?: SheetViewType
  data?: T[]
  columns?: TableColumn<T>[]
  chartConfig?: {
    layout?: 'vertical' | 'horizontal'
    height?: number
    valueUnit?: string
    valueName?: string
    barSize?: number
    tooltipFormatter?: (value: number, name: string) => [string, string]
    // 행이름을 데이터 객체에서 가져오는 필드
    nameKey?: string
    // 값을 데이터 객체에서 가져오는 필드
    valueKey?: string
    // 강조할 항목 (행 이름과 일치해야 함)
    highlightItem?: string
    // 강조 색상
    highlightColor?: string
    // 기본 색상
    defaultColor?: string
    // 색상을 데이터 객체에서 가져오는 필드
    colorKey?: string
  }
  pagination?: {
    pageSize?: number
    currentPage?: number
    totalItems?: number
    onChange?: (page: number) => void
  }
  rowKey?: string | ((record: T) => string)
  onRowClick?: (record: T, index: number) => void
  // 데이터 필터링 및 가공 콜백
  dataTransform?: (data: T[]) => T[]
}

/**
 * Sheet 컴포넌트 - 테이블, 차트 또는 기타 콘텐츠를 담는 컨테이너
 * 데이터 관리 및 표시 기능을 포함합니다.
 */
export default function Sheet<T extends Record<string, any>>({
  // 기본 속성
  title,
  subTitle,
  headerRight,
  subHeaderRight,
  children,
  onDownload,
  downloadDisabled = false,
  isLoading = false,
  isEmpty: isEmptyProp = false,
  emptyMessage = '데이터가 없습니다.',
  loadingMessage = '데이터를 불러오는 중입니다...',
  className = '',
  contentClassName = '',
  footerContent,
  
  // 데이터 관련 속성
  viewType = 'custom',
  data = [],
  columns = [],
  chartConfig,
  pagination,
  rowKey = 'id',
  onRowClick,
  dataTransform,
}: SheetProps<T>) {
  // 데이터 변환 처리
  const [processedData, setProcessedData] = useState<T[]>([])
  
  useEffect(() => {
    // 데이터 변환 함수가 있으면 적용
    const transformed = dataTransform ? dataTransform(data) : data
    setProcessedData(transformed)
  }, [data, dataTransform])
  
  // 데이터 상태 계산
  const isEmpty = isEmptyProp || processedData.length === 0
  
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
  ) : null)
  
  // 행 키 생성 함수
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return record[rowKey]?.toString() || index.toString()
  }
  
  // 테이블 렌더링
  const renderTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={column.key || index}
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedData.map((record, index) => (
              <tr 
                key={getRowKey(record, index)}
                onClick={onRowClick ? () => onRowClick(record, index) : undefined}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
              >
                {columns.map((column, colIndex) => (
                  <td key={`${getRowKey(record, index)}-${column.key || colIndex}`} className="px-6 py-4 whitespace-nowrap">
                    {column.render 
                      ? column.render(record[column.key], record, index)
                      : record[column.key]
                    }
                  </td>
                ))}
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
  
  // 차트 데이터 변환 및 렌더링
  const renderChart = () => {
    if (!chartConfig) return null
    
    const {
      layout = 'horizontal',
      height = 300,
      valueUnit = '',
      valueName = '값',
      barSize,
      tooltipFormatter,
      nameKey = 'name',
      valueKey = 'value',
      highlightItem,
      highlightColor = '#6B9AFF',
      defaultColor = '#F5F5F5',
      colorKey
    } = chartConfig
    
    // 데이터를 BarChart 컴포넌트에 맞게 변환
    const chartData: BarChartItem[] = processedData.map(item => ({
      name: item[nameKey]?.toString() || '',
      value: Number(item[valueKey]) || 0,
      color: colorKey && item[colorKey] 
        ? item[colorKey] 
        : (highlightItem && item[nameKey] === highlightItem ? highlightColor : defaultColor)
    }))
    
    return (
      <BarChart
        data={chartData}
        height={height}
        layout={layout}
        valueUnit={valueUnit}
        valueName={valueName}
        tooltipFormatter={tooltipFormatter}
        barSize={barSize}
        defaultColor={defaultColor}
        highlightColor={highlightColor}
        highlightedItem={highlightItem}
      />
    )
  }
  
  // 콘텐츠 렌더링
  const renderContent = () => {
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
    
    if (viewType === 'table') {
      return renderTable()
    }
    
    if (viewType === 'chart') {
      return renderChart()
    }
    
    // 기본 (custom): children 사용
    return children
  }

  return (
    <Card
      title={title}
      subTitle={subTitle}
      headerRight={headerRightContent}
      subHeaderRight={subHeaderRight}
      className={className}
    >
      {/* 콘텐츠 영역 */}
      <div className={contentClassName}>
        {renderContent()}
      </div>

      {/* 푸터 영역 (선택적) */}
      {footerContent && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          {footerContent}
        </div>
      )}
    </Card>
  )
}

