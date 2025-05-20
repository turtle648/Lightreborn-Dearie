"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Save, Edit3 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { submitMissionCompletion } from "@/apis/mission-api";
import { useMissionStore } from "@/stores/mission-store";


export default function Page() {
  const [text, setText] = useState("");
  const [userMissionId, setUserMissionId] = useState<number | null>(null);
  const [missionId, setMissionId] = useState<number | null>(null);

  const router = useRouter();
  const missionContent = useMissionStore(state => state.missionContent ?? "오늘의 기록을 남겨볼까요?");

  // URL 매개변수 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const userMissionIdParam = url.searchParams.get("userMissionId");
      const missionIdParam = url.searchParams.get("missionId");
      
      setUserMissionId(userMissionIdParam ? Number(userMissionIdParam) : null);
      setMissionId(missionIdParam ? Number(missionIdParam) : null);
    }
  }, []);

  // 작성 완료 처리
  const completeTextMission = async () => {
    if (!text.trim() || !userMissionId || !missionId) {
      console.error("입력 또는 파라미터 누락");
      return;
    }

    try {
      await submitMissionCompletion(userMissionId, {
        missionId,
        missionExecutionType: "TEXT",
        textContent: text.trim(),
      });

      router.push(`/mission/recent-success/${userMissionId}?type=TEXT`);
    } catch (error) {
      console.error("글쓰기 미션 제출 실패", error);
    }
  };


  return (
    <AppLayout showBack title="글쓰기 미션" rightAction={null}>
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 mb-4">
          <div className="h-full border-none shadow-md overflow-hidden rounded-3xl bg-white flex flex-col justify-start items-stretch p-6">
            {/* 질문 헤더 */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-black">오늘의 기록</span>
            </div>
            {/* 질문 카드 */}
            <div className="mb-4">
              <div className="bg-primary/10 rounded-xl px-4 py-3 flex items-start gap-2">
                <Edit3 className="h-5 w-5 mt-1 text-primary shrink-0" />
                <p className="text-primary text-base font-medium leading-relaxed">
                  {missionContent}
                </p>
              </div>
            </div>

            {/* 텍스트 입력 */}
            <div className="flex-1 mb-6">
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="자유롭게 작성해보세요..."
                className="min-h-[200px] h-full resize-none rounded-xl border border-gray-200 focus:border-pink-300"
              />
            </div>

            {/* 작성 완료 버튼 */}
            <Button
              onClick={completeTextMission}
              className="w-full py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary/20 transition-colors"
              disabled={text.trim().length === 0}
            >
              <Save className="mr-2 h-5 w-5 text-primary" />
              작성 완료
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}