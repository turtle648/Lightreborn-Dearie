"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronRight, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { submitMissionCompletion } from "@/apis/mission-api";
import type { DailyMissionResponseDTO } from "@/types/mission";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMissionStore } from "@/stores/mission-store";


interface MissionItemProps {
  mission: DailyMissionResponseDTO;
}

interface IconComponentProps {
  executionType: string;
  className?: string;
}

const executionTypeToIcon = {
  MUSIC: "Music",
  WALK: "Footprints",
  IMAGE: "Image",
  TEXT: "Text",
} as const;

const IconComponent = ({ executionType, className }: IconComponentProps) => {
  const iconName = executionTypeToIcon[executionType as keyof typeof executionTypeToIcon];
  const RawIcon = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;

  // 2) 혹시 undefined 일 때 대비
  if (!RawIcon) {
    return null;
  }

  // 3) 이제 JSX 로 안전하게 렌더링
  return <RawIcon className={className} />;
};

export function MissionItem({ mission }: MissionItemProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAction = async () => {
    if (isUpdating || mission.isCompleted) return;

    setIsUpdating(true);
    useMissionStore.getState().setMissionContent(mission.content);

    const query = new URLSearchParams({
      userMissionId: mission.id.toString(),
      missionId: mission.missionId.toString(),
    });
    if (mission.requiredObjectLabel) {
      query.set("label", mission.requiredObjectLabel);
    }
    router.push(`/mission/${mission.missionExecutionType.toLowerCase()}?${query.toString()}`);
    
    setIsUpdating(false);
    
  };

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={mission.isCompleted ? "bg-primary/10 shadow-md" : "bg-white shadow-md"}>
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            {/* 미션 정보 */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <IconComponent executionType={mission.missionExecutionType} className={`w-6 h-6 ${
                  mission.missionExecutionType === "TEXT" ? "text-blue-500" :
                  mission.missionExecutionType === "IMAGE" ? "text-green-500" :
                  mission.missionExecutionType === "MUSIC" ? "text-purple-500" :
                  "text-yellow-500"
                }`} />
                 {mission.missionTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {mission.content}
              </p>
              <Badge variant="outline" className="text-xs rounded-full">
                {mission.missionType === "STATIC" ? "마음챙김" : "활동"}
              </Badge>
            </div>

            {/* 액션 버튼 */}
            <div>
              <Button
                size="sm"
                variant={mission.isCompleted ? "outline" : "default"}
                className={`rounded-full ${
                  mission.isCompleted ? "text-gray-500 border-gray-300" : ""
                }`}
                onClick={handleAction}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  "처리 중..."
                ) : mission.isCompleted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    완료
                  </>
                ) : (
                  <>
                    시작하기
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
