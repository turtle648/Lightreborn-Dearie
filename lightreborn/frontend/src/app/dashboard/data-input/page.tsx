"use client"

import Input from "@/components/common/Input"
import Sheet from "@/components/common/Sheet"
import { colors } from "@/constants/colors"
import { useState } from "react"

export default function DataInput() {

  const [activeTab, setActiveTab] = useState<"youth-population" | "promotion-network" | "welfare-center" >("youth-population")

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        데이터 입력하기
      </h1>
      <div className="p-6 space-y-6">
        <div className="flex flex-row gap-4 border-b border-blue-200 mb-6">
          <button
            className={`px-4 py-2 ${activeTab === "youth-population" ? "border-b-2 border-[#6B9AFF] text-[#6B9AFF] font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("youth-population")}
          >
            청년 인구 통계 수정
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "promotion-network" ? "border-b-2 border-[#6B9AFF] text-[#6B9AFF] font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("promotion-network")}
          >
            청년 홍보 네트워크 수정
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "welfare-center" ? "border-b-2 border-[#6B9AFF] text-[#6B9AFF] font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("welfare-center")}
          >
            복지센터 정보 수정
          </button>
        </div>
        {activeTab === "youth-population" ? (
          <Sheet 
            title="청년 인구 통계 확인"
            columns={[
              // {key: "id", title: "ID"},
              {key: "dongId", title: "행정동"},
              {key: "cityzenAll", title: "전체 인구"},
              {key: "youthAll", title: "전체 청년인구"},
              {key: "youthRate", title: "청년인구 비율"},
              {key: "youthMale", title: "청년 남자"},
              {key: "youthFemale", title: "청년 여자"},
              {key: "youthMaleRate", title: "청년 남자 비율"},
              {key: "youthFemaleRate", title: "청년 여자 비율"},
            ]}
            data={[
              {id: 1, dongId: "동면", cityzenAll: 10000, youthAll: 1000, youthRate: 10, youthMale: 500, youthFemale: 500, youthMaleRate: 50, youthFemaleRate: 50},  
              {id: 2, dongId: "물금읍", cityzenAll: 10000, youthAll: 1000, youthRate: 10, youthMale: 500, youthFemale: 500, youthMaleRate: 50, youthFemaleRate: 50},  
              {id: 3, dongId: "월곡동", cityzenAll: 10000, youthAll: 1000, youthRate: 10, youthMale: 500, youthFemale: 500, youthMaleRate: 50, youthFemaleRate: 50},
              {id: 4, dongId: "화곡동", cityzenAll: 10000, youthAll: 1000, youthRate: 10, youthMale: 500, youthFemale: 500, youthMaleRate: 50, youthFemaleRate: 50},
              {id: 5, dongId: "이곡동", cityzenAll: 10000, youthAll: 1000, youthRate: 10, youthMale: 500, youthFemale: 500, youthMaleRate: 50, youthFemaleRate: 50},
              {id: 6, dongId: "...", cityzenAll: 0, youthAll: 0, youthRate: 0, youthMale: 0, youthFemale: 0, youthMaleRate: 0, youthFemaleRate: 0},
            ]}
          />
              
        ) : activeTab === "promotion-network" ? (
          <Sheet 
            title="청년 홍보 네트워크 확인"
            columns={[
              {key: "id", title: "ID"},
            ]}
            data={[
              {id: 1, title: "청년 홍보 네트워크 파일 업로드"}
            ]}
          />
        ) : (
          <Sheet 
            title="복지센터 정보 확인"
            columns={[
              {key: "id", title: "ID"},
            ]}
            data={[
              {id: 1, title: "복지센터 정보 파일 업로드"}
            ]}
          />
        )}
        {activeTab === "youth-population" ? (
          <Input 
            fileType="spreadsheet"
            onFileSelect={() => {}}
            onFileRemove={() => {}}
            title="청년 인구 통계 파일 업로드"
            description="청년 인구 통계 파일을 업로드해주세요."
            maxFileSize={10}
          />

          // <Input />
        ) : activeTab === "promotion-network" ? (
          <Input 
            fileType="spreadsheet"
            onFileSelect={() => {}}
            onFileRemove={() => {}}
            title="청년 홍보 네트워크 파일 업로드"
            description="청년 홍보 네트워크 파일을 업로드해주세요."
            maxFileSize={10}
          />
          // <Input />
        ) : (
          <Input 
            fileType="word"
            onFileSelect={() => {}}
            onFileRemove={() => {}}
            title="복지센터 정보 파일 업로드"
            description="복지센터 정보 파일을 업로드해주세요."
            maxFileSize={10}
          />
          // <Input />
        )}
      </div>  
    </div>
  )
}
