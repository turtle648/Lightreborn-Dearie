"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { RegisterForm } from "@/components/auth/register-form";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
            <p className="text-gray-600">Dearie와 함께 감정을 기록해보세요</p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="font-medium text-primary hover:text-primary/80"
              >
                로그인
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
