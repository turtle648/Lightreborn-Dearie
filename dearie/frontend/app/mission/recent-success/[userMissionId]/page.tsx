"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMissionStore } from "@/stores/mission-store";
import { AppLayout } from "@/components/layout/app-layout";

export default function MissionDetailPage() {
  const { userMissionId } = useParams();
  const { missionDetail, fetchMissionDetail, detailLoading, detailError } = useMissionStore();
  const router = useRouter();

  useEffect(() => {
    if (userMissionId) {
      fetchMissionDetail(Number(userMissionId));
    }
  }, [userMissionId, fetchMissionDetail]);

  if (detailLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">로딩 중...</div>
      </AppLayout>
    );
  }

  if (detailError) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64 text-red-500">{detailError}</div>
      </AppLayout>
    );
  }

  if (!missionDetail) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64 text-gray-400">미션 정보를 찾을 수 없습니다.</div>
      </AppLayout>
    );
  }

  // MissionResultType별 분기
  const { resultType } = missionDetail;

  
}
