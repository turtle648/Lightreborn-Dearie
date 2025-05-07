"use client"

import React, { useState } from 'react';
import TopBar from '@/components/common/TopBar';
import SideBar from '@/components/common/SideBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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