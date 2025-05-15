'use client'

import { Card } from "@/components/common/Card"
import BarChart from "@/components/common/rechart/BarChart"


export default function TestPage() {

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      <BarChart 
        data={[
          { name: 'A', value: 10 },
          { name: 'B', value: 20 },
          { name: 'C', value: 30 },
        ]}
      />
      <Card title="테스트 카드">
        <div className="p-4">
          <p>테스트 카드 내용</p>
        </div>
      </Card>
    </div>
  )
} 


