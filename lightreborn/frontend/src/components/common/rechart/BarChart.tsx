'use client'

import { colors } from '@/constants/colors'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

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
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  xAxisAngle?: number
  domain?: [number | string, number | string]
  dataKey?: string
}

export const BarChart = ({
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
  marginTop = 20,
  marginRight = 10,
  marginBottom = 40,
  marginLeft = 10,
  xAxisAngle = -45,
  domain = [0, 'dataMax + 1'],
  dataKey = 'value'
}: BarChartProps) => {

  console.log('data',   data)
  return (
    <div>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            layout={layout}
            margin={{
              top: marginTop,
              right: marginRight,
              left: marginLeft,
              bottom: marginBottom
            }}
          >
            {layout === 'horizontal' ? (
              <>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  height={40}
                  interval={0}
                  angle={xAxisAngle}
                  textAnchor="end"
                />
                <YAxis 
                  tickFormatter={(value) => `${value}${valueUnit}`}
                  domain={domain}
                />
              </>
            ) : (
              <>
                <XAxis 
                  type="number" 
                  domain={domain} 
                  tickFormatter={(value) => `${value}${valueUnit}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={70}
                  tick={{ fontSize: 12 }}
                />
              </>
            )}
            {showTooltip && (
              <Tooltip 
                formatter={(value) => [`${value}${valueUnit}`, valueName]}
                labelFormatter={(label) => `${label}`}
              />
            )}
            <Bar dataKey={dataKey} name={valueName}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.color || 
                    (highlightedItem && entry.name === highlightedItem
                      ? highlightedColor
                      : defaultColor)
                  }
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChart