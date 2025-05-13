"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ConsultationCompletePage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/mypage");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6"
        >
          <Check className="h-10 w-10 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-2">상담 신청 완료</h1>
          <p className="text-gray-600 mb-8">
            설문 결과가 성공적으로 전송되었습니다.
            <br />
            상담사가 빠른 시일 내에 연락드릴 예정입니다.
          </p>

          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4"
            onClick={handleComplete}
          >
            확인
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
