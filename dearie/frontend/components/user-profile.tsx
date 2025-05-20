"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";

export function UserProfile() {
  const { profile, isLoading, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading || !profile) {
    return (
      <div className="p-6 text-sm text-gray-500">프로필 불러오는 중...</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-lg overflow-hidden">
        <div className="h-24 bg-gradient-soft"></div>
        <CardContent className="p-6 -mt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                <AvatarImage src={profile.profileImage} />
                <AvatarFallback>
                  {profile.nickname || profile.name}
                </AvatarFallback>
              </Avatar>
              <div className="mt-8">
                <h2 className="text-2xl font-bold">{profile.name}님</h2>
                <p className="text-sm text-gray-500">
                  오늘까지 {profile.userActivity.consecutiveCount}일 연속으로
                  일기를 작성했어요
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/80 shadow-sm"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <p className="text-2xl font-bold text-primary">
                {profile.userActivity.diaryCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">작성한 일기</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <p className="text-2xl font-bold text-primary">
                {profile.userActivity.completeMissionCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">완료한 미션</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <p className="text-2xl font-bold text-primary">
                {profile.userActivity.consecutiveCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">연속 작성일</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
