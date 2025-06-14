"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  BarChart2,
  MessageSquare,
  ThumbsUp,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SurveySelection() {
  const router = useRouter();
  const [showLockMessage, setShowLockMessage] = useState(false);

  const surveyTypes = [
    {
      id: "monthly",
      name: "고립/은둔 설문조사",
      path: "/survey/intro",
      icon: BarChart2,
      color: "bg-gradient-to-br from-primary/10 to-primary/30",
      iconColor: "text-primary",
      description: "고립 은둔 청년 척도 설문조사",
      locked: false,
    },
    {
      id: "satisfaction",
      name: "만족도 조사",
      path: "/survey/satisfaction",
      icon: ThumbsUp,
      color: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-500",
      description: "서비스 개선을 위한 의견을 남겨주세요",
      locked: true,
    },
    {
      id: "multiple-choice",
      name: "다중 선택 설문",
      path: "/survey/multiple-choice",
      icon: FileText,
      color: "bg-gradient-to-br from-amber-50 to-amber-100",
      iconColor: "text-amber-500",
      description: "간단한 선택형 질문에 답해주세요",
      locked: true,
    },
    {
      id: "feedback",
      name: "피드백 설문",
      path: "/survey/feedback",
      icon: MessageSquare,
      color: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-500",
      description: "앱 사용 경험에 대한 의견을 들려주세요",
      locked: true,
    },
  ];

  const handleSurveyClick = (survey: any) => {
    if (survey.locked) {
      // 잠금 처리된 설문은 클릭 시 메시지만 표시
      setShowLockMessage(true);
      setTimeout(() => setShowLockMessage(false), 3000);
    } else {
      // 잠금 해제된 설문은 해당 경로로 이동
      router.push(survey.path);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            참여 가능한 설문조사
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {showLockMessage && (
            <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm animate-fade-in">
              현재 고립/은둔 설문조사만 참여 가능합니다.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surveyTypes.map((survey, index) => {
              const Icon = survey.icon;
              return (
                <TooltipProvider key={survey.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index + 0.3, duration: 0.4 }}
                        whileHover={
                          !survey.locked
                            ? {
                                scale: 1.03,
                                boxShadow:
                                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                              }
                            : {}
                        }
                        whileTap={!survey.locked ? { scale: 0.98 } : {}}
                        onClick={() => handleSurveyClick(survey)}
                        className={`${
                          survey.color
                        } rounded-xl p-4 cursor-pointer border border-transparent 
                          ${
                            survey.locked
                              ? "opacity-70 grayscale cursor-not-allowed"
                              : "hover:border-primary/20"
                          } 
                          transition-all duration-300 relative`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2.5 rounded-full bg-white/80 ${
                              survey.locked ? "text-gray-400" : survey.iconColor
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 flex items-center">
                              {survey.name}
                              {survey.locked && (
                                <Lock className="h-4 w-4 ml-2 text-gray-500" />
                              )}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {survey.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    {survey.locked && (
                      <TooltipContent>
                        <p>현재 이용할 수 없는 설문조사입니다</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
