"use client"

import type React from "react"
import { colors } from "@/constants/colors"
import Button from "../common/Button"
import Image from "next/image"
import useAuthStore, { useHydration } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import logo from "@/assets/logo.png"
import userimage from "@/assets/user.svg"
import { useEffect, useState } from "react"

interface TopBarProps {
  onMenuClick: () => void
  isMenuOpen: boolean
}

export default function TopBar({ onMenuClick, isMenuOpen }: TopBarProps) {
  const isHydrated = useHydration();
  const { logout, user, getUserInfo, isLoggedIn, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 사용자 정보 확인
  useEffect(() => {
    // console.log("TopBar useEffect 실행:", { isHydrated, isLoggedIn, isAuthenticated, user });
    
    // 하이드레이션 완료 후 로그인된 상태이면 사용자 정보 확인
    if (isHydrated) {
      setIsLoading(true);
      
      if (isLoggedIn && isAuthenticated) {
        // 사용자 정보가 없거나 불완전하면 다시 요청
        if (!user || !user.id) {
          console.log("사용자 정보 다시 요청 중...");
          getUserInfo()
            .then((userData) => {
              console.log("사용자 정보 로드 완료:", userData);
            })
            .catch((error) => {
              console.error("사용자 정보 로드 실패:", error);
              // 로그인 페이지로 리다이렉트
              router.push("/login");
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          // console.log("이미 사용자 정보가 있습니다:", user);
          setIsLoading(false);
        }
      } else {
        console.log("로그인 상태가 아니므로 사용자 정보를 요청하지 않습니다.");
        setIsLoading(false);
      }
    }
  }, [isHydrated, getUserInfo, isLoggedIn, isAuthenticated, user, router]);

  // 상태값 디버깅
  // console.log("TopBar 렌더링:", { 
  //   user, 
  //   isLoggedIn, 
  //   isAuthenticated, 
  //   isHydrated, 
  //   isLoading 
  // });

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
        
        <div className="flex items-center cursor-pointer" onClick={handleLogo}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2">
            <Image src={logo} alt="logo" width={32} height={32} />
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <div className="w-8 h-8 rounded-full mr-2">
            <Image src={userimage} alt="profile image" width={32} height={32} className="rounded-full" />
          </div>
          <span className="text-sm" style={{ color: colors.text.primary }}>
            {isLoading ? '로딩 중...' : (user?.name || '로그인 필요')}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </div>
  )
}