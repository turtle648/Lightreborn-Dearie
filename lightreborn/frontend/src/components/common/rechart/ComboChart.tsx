'use client'

import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface ComboChartItem {
  name: string
  barValue: number
  lineValue: number
}

interface ComboChartProps {
  data: ComboChartItem[]
  title?: string
  height?: number | string
  width?: number | string
  barName?: string
  lineName?: string
  barColor?: string
  lineColor?: string
  showTooltip?: boolean
  showLegend?: boolean
  barYAxisDomain?: [number | string, number | string]
  lineYAxisDomain?: [number | string, number | string]
  className?: string
}

export default function ComboChart({
  data,
  title,
  height = 300,
  width = '100%',
  barName = '월별 건수',
  lineName = '전년 동월 건수',
  barColor = '#E8F1FF',
  lineColor = '#FFD465',
  showTooltip = true,
  showLegend = true,
  barYAxisDomain = [0, 'auto'],
  lineYAxisDomain = [0, 'auto'],
  className = '',
}: ComboChartProps) {
  return (
    <div className={className}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              domain={barYAxisDomain}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              hide
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={lineYAxisDomain}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              hide
            />
            {showTooltip && <Tooltip />}
            {showLegend && (
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                payload={[
                  { value: barName, type: 'rect', color: barColor },
                  { value: lineName, type: 'line', color: lineColor }
                ]}
              />
            )}
            <Bar
              yAxisId="left"
              dataKey="barValue"
              name={barName}
              fill={barColor}
              radius={[4, 4, 0, 0]}
              barSize={60}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="lineValue"
              name={lineName}
              stroke={lineColor}
              strokeWidth={5}
              dot={{ r: 4, fill: lineColor }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}