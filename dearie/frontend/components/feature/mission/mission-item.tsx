"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronRight, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { updateMissionStatus } from "@/apis/mission-api";
import type { DailyMissionResponseDTO } from "@/types/mission";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MissionItemProps {
  mission: DailyMissionResponseDTO;
}

interface IconComponentProps {
  icon: keyof typeof LucideIcons;
  className?: string;
}

const IconComponent = ({ icon, className }: IconComponentProps) => {
  // 1) LucideReact 에서 가져온 심볼을 LucideIcon 타입으로 캐스트
  const RawIcon = LucideIcons[icon] as LucideIcon;

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
    try {
      await updateMissionStatus(mission.id, true);
      router.push(mission.route);
    } catch (e) {
      console.error("미션 상태 업데이트 오류", e);
    } finally {
      setIsUpdating(false);
    }
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
                <IconComponent icon={mission.icon as keyof typeof LucideIcons} className={`w-6 h-6 ${mission.color}`} />
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
