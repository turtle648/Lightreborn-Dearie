"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/common/Card";
import Input from "@/components/common/Input";
import Sheet from "@/components/common/Sheet";
import { useYouthConsultationStore } from "@/stores/useYouthConsultaionStore";
import { colors } from "@/constants/colors";

// 타입 정의
type ProcessStage = "SELF_DIAGNOSIS" | "COUNSELING" | "INTERNAL_REVIEW" | "FINAL_SELECTION";
type IsolationLevel = "NON_RISK" | "AT_RISK";

// 라벨 정의
const stageLabels: Record<ProcessStage, string> = {
  SELF_DIAGNOSIS: "자가척도 작성",
  COUNSELING: "상담 진행",
  INTERNAL_REVIEW: "내부 회의",
  FINAL_SELECTION: "최종 판정",
};

const isolationLabels: Record<IsolationLevel, string> = {
  NON_RISK: "비위험군",
  AT_RISK: "고립 위험군",
};

const processingStages: ProcessStage[] = ["SELF_DIAGNOSIS", "COUNSELING", "INTERNAL_REVIEW"];

export default function YouthManagement() {
  const router = useRouter();
  const { registeredYouthListWithProcessStep, getRegisteredYouthListWithProcessStep } = useYouthConsultationStore();

  const [processStepList, setProcessStepList] = useState<Array<{ id: number; name: string; age: number; processStep: string }> | null>(null);
  const [selectedStage, setSelectedStage] = useState<ProcessStage | null>(null);

  // 1. 초기 마운트 시 데이터 요청
  useEffect(() => {
    getRegisteredYouthListWithProcessStep();
  }, [getRegisteredYouthListWithProcessStep]);

  // 2. store 값이 바뀌면 상태에 반영
  useEffect(() => {
    if (Array.isArray(registeredYouthListWithProcessStep)) {
      setProcessStepList(registeredYouthListWithProcessStep);
    }
  }, [registeredYouthListWithProcessStep]);

  if (!Array.isArray(processStepList)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">상담 대상자 관리</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const processingYouthList = processStepList.filter((youth) =>
    processingStages.includes(youth.processStep as ProcessStage)
  );

  const classifiedYouthList = processStepList
    .filter((youth) => youth.processStep === "FINAL_SELECTION")
    .map((youth) => {
      const isolationLevel: IsolationLevel = Math.random() > 0.5 ? "NON_RISK" : "AT_RISK";
      return {
        ...youth,
        isolationLevel,
        status: isolationLabels[isolationLevel],
        recentDate: "2025-05-01",
        specialNote: "특이사항 없음",
      };
    });

  const filteredProcessingList = selectedStage
    ? processingYouthList.filter((youth) => youth.processStep === selectedStage)
    : processingYouthList;

  const renderProgressIcons = (stage: ProcessStage) => {
    const currentIndex = processingStages.indexOf(stage);
    return (
      <div className="flex items-center w-full">
        {processingStages.map((s, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={s} className="flex flex-col items-start" style={{ width: "33%" }}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? isCurrent
                        ? "bg-blue-600 text-white ring-2 ring-blue-200"
                        : "bg-blue-400 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index === 0 ? "✓" : index === 1 ? "✓" : "✓"}
                </div>
                <span className="mt-1 text-xs text-gray-500">{stageLabels[s]}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStageFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className={`px-3 py-1 text-sm rounded-md ${
          selectedStage === null ? "bg-blue-500 text-white" : "bg-gray-100"
        }`}
        onClick={() => setSelectedStage(null)}
      >
        전체
      </button>
      {processingStages.map((stage, index) => (
        <button
          key={stage}
          className={`px-3 py-1 text-sm rounded-md flex items-center ${
            selectedStage === stage ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedStage(stage)}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 ${
              selectedStage === stage ? "bg-white text-blue-500" : "bg-gray-300 text-gray-600"
            }`}
          >
            {index === 0 ? "✓" : index === 1 ? "✓" : "✓"}
          </span>
          {stageLabels[stage]}
        </button>
      ))}
    </div>
  );

  // const handleSubmitFile = async (file: File) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     await uploadSurveyResponseWordFile(formData);
  //   } catch (error) {
  //     console.error("uploadSurveyResponseWordFile error : ", error);
  //   }
  // };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        상담 대상자 관리
      </h1>

      <div className="grid grid-cols-1">
        <Input
          activeTab="youth-management"
          fileType="word"
          title="원클릭 은둔고립청년 척도설문 추가하기"
          description="새로운 척도설문 데이터 워드 파일을 이 곳에 드래그해주세요."
          maxFileSize={10}
        />
      </div>

      <div className="grid grid-cols-1">
        <Card title="진행 단계에 따른 청년 리스트">
          {renderStageFilters()}
          <Sheet
            className="border-none shadow-none"
            title="은둔고립청년 판정 진행 중"
            subTitle="최종 판정 이전 단계에 있는 청년 목록입니다."
            data={filteredProcessingList}
            columns={[
              { key: "name", title: "이름", width: "15%" },
              { key: "age", title: "나이", width: "10%" },
              {
                key: "processStep",
                title: "은둔고립청년 발굴 절차 진행도",
                width: "75%",
                render: (value: unknown) => (
                  <div className="py-2 relative" style={{ height: "60px" }}>
                    {renderProgressIcons(value as ProcessStage)}
                  </div>
                ),
              },
            ]}
            onRowClick={(record) =>
              router.push(`/dashboard/youth-processing/${(record as { id: number }).id}`)
            }
          />
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <Sheet
          title="은둔고립청년 판정 완료 리스트"
          subTitle="판정이 완료된 청년 목록입니다."
          data={classifiedYouthList}
          columns={[
            { key: "name", title: "이름" },
            { key: "age", title: "나이" },
            {
              key: "status",
              title: "고립은둔 유형",
              render: (value: unknown) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === "비위험군"
                      ? "bg-green-100 text-green-800"
                      : value === "고립 위험군"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {value as string}
                </span>
              ),
            },
            { key: "recentDate", title: "최근상담일자" },
            { key: "specialNote", title: "특이사항" },
          ]}
          onRowClick={(record) =>
            router.push(`/dashboard/youth-management/${(record as { id: number }).id}`)
          }
        />
      </div>
    </div>
  );
}
