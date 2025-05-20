"use client"

import Input from "@/components/common/Input"
import Sheet from "@/components/common/Sheet"
import { colors } from "@/constants/colors"
import { useDataStore } from "@/stores/useDataStore"
import { useEffect, useState } from "react"

export default function DataInput() {

  const [activeTab, setActiveTab] = useState<"youth-population" | "promotion-network" | "welfare-center" >("youth-population")

  const { 
    youthPopulationData , getYouthPopulationData, 
    promotionNetworkData, getPromotionNetworkData, 
    welfareCenterData, getWelfareCenterData 
  } = useDataStore();

  // 표 데이터 채우기 
  useEffect(() => {
    getYouthPopulationData();
    getPromotionNetworkData();
    getWelfareCenterData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);


  console.log("youthPopulationData : ", youthPopulationData)
  console.log("promotionNetworkData : ", promotionNetworkData)
  console.log("welfareCenterData : ", welfareCenterData)

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
          <Input 
            activeTab={activeTab}
            fileType="spreadsheet"
            title="청년 인구 통계 파일 업로드"
            description="청년 인구 통계 파일을 업로드해주세요."
            maxFileSize={10}
          />
        ) : activeTab === "promotion-network" ? (
          <Input 
            activeTab={activeTab}
            fileType="spreadsheet"
            title="청년 홍보 네트워크 파일 업로드"
            description="청년 홍보 네트워크 파일을 업로드해주세요."
            maxFileSize={10}
          />
        ) : (
          <Input 
            activeTab={activeTab}
            fileType="spreadsheet"
            title="복지센터 정보 파일 업로드"
            description="복지센터 정보 파일을 업로드해주세요."
            maxFileSize={10}
          />
        )}
      {activeTab === "youth-population" ? (
        <Sheet 
          title="청년 인구 통계 확인"
          columns={[
            {key: "dongName", title: "행정동"},
            {key: "youthPopulation", title: "전체 청년인구"},
            {key: "maleYouth", title: "청년 남자"},
            {key: "femaleYouth", title: "청년 여자"},
            {key: "youthOnePersonHousehold", title: "전체 청년 1인가구"},
            {key: "maleOnePersonHousehold", title: "청년 남자 1인가구"},
            {key: "femaleOnePersonHousehold", title: "청년 여자 1인가구"},
          ]}
          data={youthPopulationData}
          pagination={{
            currentPage,
            pageSize : 5,
            totalItems: youthPopulationData.length,
            onChange: (page) => setCurrentPage(page),
          }}
        />
            
      ) : activeTab === "promotion-network" ? (
        <Sheet 
          title="청년 홍보 네트워크 확인"
          columns={[
            {key: "placeName", title: "장소명"},
            {key: "locationType", title: "홍보물 장소 유형"},
            {key: "promotionType", title: "홍보물 유형"},
            {key: "promotionContent", title: "홍보물 내용"},
            {key: "posted", title: "게시 상태"},
            {key: "dongName", title: "행정동"},
            {key: "address", title: "주소"},
          ]}
          data={promotionNetworkData}
          pagination={{
            currentPage,
            pageSize : 12,
            totalItems: promotionNetworkData.length,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      ) : (
        <Sheet 
          title="복지센터 정보 확인"
          columns={[
            {key: "hangjungName", title: "행정동"},
            {key: "organizationType", title: "기관 유형"},
            {key: "organizationName", title: "기관 이름"},
            {key: "callNumber", title: "전화번호"},
            {key: "address", title: "주소"},
          ]}
          data={welfareCenterData}
          pagination={{
            currentPage,
            pageSize : 5,
            totalItems: welfareCenterData.length,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      )}
      </div>  
    </div>
  )
}
