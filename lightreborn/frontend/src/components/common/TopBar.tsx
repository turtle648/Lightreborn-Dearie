"use client"

import type React from "react"
import { colors } from "@/constants/colors"
import Button from "./Button"
import Image from "next/image"
import useAuthStore from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import logo from "@/assets/logo.png"

interface TopBarProps {
  onMenuClick: () => void
  isMenuOpen: boolean
}

export default function TopBar({ onMenuClick, isMenuOpen }: TopBarProps) {
  const { logout } = useAuthStore()
  const router = useRouter()
  const { user } = useAuthStore()

  const handleLogo = () => {
    router.push("/dashboard/youth-population")
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div
      className="flex justify-between items-center px-6 py-3 bg-white border-b"
      style={{ borderColor: colors.table.border }}
    >
      <div className="flex items-center">
        {/* 햄버거 버튼 - 모바일에서만 표시 */}
        <button
          className="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
          onClick={onMenuClick}
        >
          <span className="sr-only">메뉴 열기</span>
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        {/* 로고 */}
        <div className="flex items-center cursor-pointer" onClick={handleLogo}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2">
            <Image src={logo} alt="logo" width={32} height={32} />
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <div className="w-8 h-8 rounded-full mr-2">
            <Image src={logo} alt="profile image" width={32} height={32} className="rounded-full" />
          </div>
          <span className="text-sm" style={{ color: colors.text.primary }}>
            {user?.id}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </div>
  )
}