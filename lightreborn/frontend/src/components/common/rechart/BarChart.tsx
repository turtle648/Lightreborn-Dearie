'use client'

import { colors } from '@/constants/colors'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, TooltipProps, Label } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

export interface BarChartItem {
  name: string
  value: number
  color?: string
}

interface BarChartProps {
  data: BarChartItem[]
  title?: string
  height?: number | string
  width?: number | string
  layout?: 'vertical' | 'horizontal'
  valueUnit?: string
  valueName?: string
  highlightedItem?: string
  defaultColor?: string
  highlightedColor?: string
  showTooltip?: boolean
  showLegend?: boolean
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  xAxisAngle?: number
  domain?: [number | string, number | string]
  dataKey?: string
  className?: string
  yAxisWidth?: number
  hideAxis?: boolean
  tooltipFormatter?: (value: number, name: string) => [string, string]
  labelFormatter?: (label: string) => string
  xAxisLabel?: string
  yAxisLabel?: string
  axisLabelStyle?: React.CSSProperties
  barSize?: number // 막대 크기를 직접 조절할 수 있는 옵션 추가
  barGap?: number  // 막대 간 간격을 조절할 수 있는 옵션 추가
}

// 커스텀 툴팁 컴포넌트 (이전과 동일)
const CustomTooltip = ({ 
  active, 
  payload, 
  valueName, 
  valueUnit,
  tooltipFormatter,
  labelFormatter
}: TooltipProps<ValueType, NameType> & { 
  valueName: string, 
  valueUnit: string,
  tooltipFormatter?: (value: number, name: string) => [string, string],
  labelFormatter?: (label: string) => string
}) => {
  if (active && payload && payload.length) {
    const [formattedValue, formattedName] = tooltipFormatter 
      ? tooltipFormatter(payload[0].value as number, valueName)
      : [`${payload[0].value}${valueUnit}`, valueName];
    
    const formattedLabel = labelFormatter 
      ? labelFormatter(payload[0].payload.name) 
      : payload[0].payload.name;

    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
        <p className="font-medium">{formattedLabel}</p>
        <p className="text-sm">
          {`${formattedName}: ${formattedValue}`}
        </p>
      </div>
    );
  }
  
  return null;
};

  export default function BarChart({
  data,
  title,
  height = 300,
  width = '100%',
  layout = 'horizontal',
  valueUnit = '',
  valueName = '값',
  highlightedItem,
  defaultColor = colors.chart.lightGray,
  highlightedColor = colors.chart.blue,
  showTooltip = true,
  showLegend = false,
  marginTop = 10, 
  marginRight = 10, 
  marginBottom = 50, 
  marginLeft = 10,
  xAxisAngle = 0,
  domain = [0, 'dataMax + 1'],
  dataKey = 'value',
  className = '',
  yAxisWidth = 50,
  tooltipFormatter,
  labelFormatter,
  xAxisLabel,
  yAxisLabel,
  axisLabelStyle = { fontSize: 12, fill: colors.text.secondary },
  // 기본 막대 크기 값 조정
  barSize = 65, // 명시적으로 지정할 때만 사용
  barGap = 0.2
}: BarChartProps) {
  // 값이 있는 데이터 항목만 필터링
  const validData = data.filter(item => item.value !== undefined && item.value !== null);
  
  // 각 항목의 색상 결정
  const getBarColor = (entry: BarChartItem) => {
    if (entry.color) return entry.color;
    if (highlightedItem && entry.name === highlightedItem) return highlightedColor;
    return defaultColor;
  };

  // 레이아웃에 따른 여백 조정 (단순화)
  const adjustedMargins = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: layout === 'vertical' ? Math.max(marginLeft, 20) : marginLeft, // 세로형일 때 최소 여백 보장
  };

  // 데이터 항목 수에 따른 적절한 막대 크기 자동 계산
  const calculateBarSize = () => {
    if (barSize) return barSize; // 명시적 지정 값이 있으면 사용
    
    // 데이터 항목 수에 따라 동적으로 계산
    const itemCount = validData.length;
    
    if (layout === 'horizontal') {
      // 가로 차트의 경우: 항목이 많을수록 얇게
      return itemCount <= 3 ? 40 : itemCount <= 6 ? 30 : itemCount <= 10 ? 20 : 15;
    } else {
      // 세로 차트의 경우: 모든 항목이 동일한 너비
      return 30; // 세로 차트의 기본 막대 너비
    }
  };

  // 계산된 막대 크기
  const computedBarSize = calculateBarSize();

  return (
    <div className={className}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={validData}
            layout={layout}
            margin={adjustedMargins}
            barCategoryGap={`${barGap * 100}%`} // 카테고리 간 간격 비율로 설정
          >
            {/* 가로형 바 차트의 X축 (카테고리 축) - 항상 표시 */}
            {layout === 'horizontal' && (
              <XAxis
                dataKey="name"
                tick={{ fontSize: 15 }}
                height={40}
                interval={0}
                axisLine={false}
                tickLine={false}
                angle={xAxisAngle}
                textAnchor="middle"
                tickMargin={10}
              >
                {xAxisLabel && (
                  <Label 
                    value={xAxisLabel} 
                    position="bottom" 
                    offset={15}
                    style={axisLabelStyle}
                  />
                )}
              </XAxis>
            )}
            
            {/* 가로형 바 차트의 Y축 (값 축) - 숨김 처리 */}
            {layout === 'horizontal' && (
              <YAxis
                hide // Y축 숨김
                domain={domain}
              />
            )}
            
            {/* 세로형 바 차트의 X축 (값 축) - 숨김 처리 */}
            {layout === 'vertical' && (
              <XAxis
                type="number"
                domain={domain}
                hide // X축 숨김
              />
            )}
            
            {/* 세로형 바 차트의 Y축 (카테고리 축) - 항상 표시 */}
            {layout === 'vertical' && (
              <YAxis
                dataKey="name"
                type="category"
                width={yAxisWidth}
                tick={{ fontSize: 12 }}
                tickMargin={5}
                axisLine={false}
                tickLine={false}
              >
                {yAxisLabel && (
                  <Label 
                    value={yAxisLabel} 
                    position="middle" 
                    angle={-90} 
                    offset={-10}
                    style={axisLabelStyle}
                  />
                )}
              </YAxis>
            )}
            
            {showTooltip && (
              <Tooltip
                content={
                  <CustomTooltip 
                    valueName={valueName} 
                    valueUnit={valueUnit} 
                    tooltipFormatter={tooltipFormatter}
                    labelFormatter={labelFormatter}
                  />
                }
                cursor={false}
                wrapperStyle={{ zIndex: 1000 }}
              />
            )}
            
            {showLegend && <Legend />}
            
            <Bar 
              dataKey={dataKey} 
              name={valueName}
              // 막대 크기 동적 계산
              barSize={computedBarSize}
            >
              {validData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry)}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

