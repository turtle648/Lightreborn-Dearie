"use client"

import { useState } from "react"
import Button from "@/components/common/Button"
import { signup } from "@/apis/users"
import { useRouter } from "next/navigation"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    name: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    // 모든 필드가 입력되었는지 확인
    if (!formData.id || !formData.password || !formData.confirmPassword || !formData.name) {
      setError("모든 항목을 입력해주세요.")
      return false
    }

    // 비밀번호 일치 여부 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return false
    }

    // 비밀번호 길이 검증 (옵션)
    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 폼 유효성 검증
    if (!validateForm()) return
    
    setError("")
    setIsLoading(true)
    
    try {
      // 회원가입 API 호출
      await signup({ 
        id: formData.id, 
        password: formData.password, 
        name: formData.name,
        role: 1 
      })
      
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
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="id"
            placeholder="아이디를 입력하세요"
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AFF]"
            value={formData.id}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <input
            type="text"
            name="name"
            placeholder="이름을 입력하세요"
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AFF]"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AFF]"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호를 확인하세요"
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AFF]"
            value={formData.confirmPassword}
            onChange={handleChange}
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
          variant="primary" 
          fullWidth={true} 
          size="lg" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "처리 중..." : "가입하기"}
        </Button>
      </form>
      
      <div className="text-center">
        <button 
          onClick={() => router.push("/login")}
          className="text-[#6B9AFF] hover:underline"
          disabled={isLoading}
        >
          이미 계정이 있으신가요? 로그인하기
        </button>
      </div>
    </div>
  )
}