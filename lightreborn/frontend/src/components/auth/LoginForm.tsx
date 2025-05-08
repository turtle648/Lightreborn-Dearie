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
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      await login({ id, password })
      // 로그인 성공 시에만 페이지 이동
      router.push("/dashboard/youth-population")
    } catch (error) {
      // 로그인 실패 시 에러 메시지 표시
      console.error("로그인 실패:", error)
      setError("아이디 또는 비밀번호가 올바르지 않습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      await signup({ id, password, role: 1 })
      // 회원가입 성공 시 로그인 페이지로 이동
      router.push("/login")
    } catch (error) {
      console.error("회원가입 실패:", error)
      setError("회원가입에 실패했습니다. 다시 시도해 주세요.")
    } finally {
      setIsLoading(false)
    }
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
            disabled={isLoading}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AFF]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="text-red-500 text-sm py-1">
            {error}
          </div>
        )}

        <Button 
          variant="outline" 
          fullWidth={true} 
          size="lg" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>
      
      <Button 
        variant="outline" 
        fullWidth={true} 
        size="lg" 
        onClick={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? "처리 중..." : "회원가입"}
      </Button>
    </div>
  )
}