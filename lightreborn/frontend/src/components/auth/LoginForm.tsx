"use client"

import type React from "react"
import Button from "@/components/common/Button"
import { useState } from "react";
import useAuthStore from "@/stores/useAuthStore";
import { signup } from "@/apis/users";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuthStore()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ id, password })
    router.push("/dashboard/youth-population")
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    signup({ id, password, role: 1 })
    router.push("/login")
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-center">다시 빛 대시보드</h2>

      <form className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AFF]"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AFF]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button variant="outline" fullWidth={true} size="lg" onClick={handleSubmit}>
          로그인
        </Button>

      </form>
        <Button variant="outline" fullWidth={true} size="lg" onClick={handleSignup}>
          회원가입
        </Button>
    </div>
  )
}
