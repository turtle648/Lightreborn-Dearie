"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/ui/TopBar';
import SideBar from '@/components/ui/SideBar';
import useAuthStore from '@/stores/useAuthStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, isAuthenticated, getUserInfo } = useAuthStore();
  const router = useRouter();

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 사용자 정보 가져오기 (세션/토큰 검증)
        await getUserInfo();
        setIsLoading(false);
      } catch (error) {
        console.error('인증 확인 실패:', error);
        router.push('/login');
      }
    };

    if (!isLoggedIn && !isAuthenticated) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증된 사용자만 대시보드 레이아웃과 내용을 볼 수 있음
  return (
    <div className="flex flex-col h-screen">
      <TopBar onMenuClick={toggleSidebar} isMenuOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}