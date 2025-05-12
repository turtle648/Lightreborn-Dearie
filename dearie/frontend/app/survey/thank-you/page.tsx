"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();

  const handleFinish = () => {
    router.push("/mypage");
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-md flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="w-full">
          <CardHeader className="text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-2xl">설문이 완료되었습니다</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              소중한 의견을 제공해 주셔서 감사합니다. 다음 달 리포트에
              반영하겠습니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFinish} className="w-full">
              월간 리포트로 돌아가기
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
