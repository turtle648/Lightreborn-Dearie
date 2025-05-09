'use client'

import { colors } from '@/constants/colors'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export interface DoughnutChartItem {
  name: string
  value: number
  color: string
}

interface DoughnutChartProps {
  data: DoughnutChartItem[] | null
  titleText: string
  valueText: string
  size?: number
  borderWidth?: number
  showTooltip?: boolean
  emptyColor?: string
  centerText?: boolean
  className?: string
}

export default function DoughnutChart({
  data,
  titleText,
  valueText,
  size = 180,
  borderWidth = 16,
  showTooltip = true,
  emptyColor = colors.chart.lightGray,
  centerText = true,
  className = ''
}: DoughnutChartProps) {
  if (!data) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: size,
            height: size,
            border: `${borderWidth}px solid ${emptyColor}`
          }}
        >
          <div className="text-center">
            <p className="font-bold">{titleText || '지역 선택'}</p>
            <p className="text-2xl font-bold">-</p>
          </div>
        </div>
      </div>
    )
  }
  
  const outerRadius = size / 2
  const innerRadius = outerRadius - borderWidth
  
  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {showTooltip && (
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                itemStyle={{ color: colors.text.primary }}
              />
            )}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* 가운데 텍스트 오버레이 */}
        {centerText && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <p className="font-bold">{titleText}</p>
              <p className="text-2xl font-bold">{valueText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

