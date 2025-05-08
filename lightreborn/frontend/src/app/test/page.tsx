'use client'

import BarChart from "@/components/common/rechart/BarChart"

export default function TestPage() {
  return (
    <div>
      <BarChart 
        data={[
          { name: 'A', value: 10 },
          { name: 'B', value: 20 },
          { name: 'C', value: 30 },
        ]}
      />
    </div>
  )
} 


