"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { colors } from "@/constants/colors"

interface SidebarItem {
  title: string
  path: string
  icon?: React.ReactNode
}

const sidebarItems: SidebarItem[] = [
  { title: "청년 인구 분포 비율", path: "/dashboard/youth-population" },
  { title: "최적화 홍보 네트워크망", path: "/dashboard/promotion-network" },
  { title: "협력기관 위치 최적화", path: "/dashboard/welfare-center" },
  { title: "은둔고립 청년 상담 관리", path: "/dashboard/youth-consultation" },
  { title: "상담 대상자 관리", path: "/dashboard/youth-management" },
  { title: "상담 일지 관리", path: "/dashboard/consultation-management" },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* 모바일용 오버레이 */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div className={`
        fixed lg:relative
        lg:translate-x-0
        transition-transform duration-300 ease-in-out
        z-40 lg:z-auto
        w-64 bg-white h-screen border-r flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ borderColor: colors.table.border }}>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.path
              return (
                <li key={index}>
                  <Link href={item.path} onClick={onClose}>
                    <div
                      className={`px-4 py-3 flex items-center ${isActive ? "bg-[#E8F1FF]" : "hover:bg-gray-50"}`}
                      style={{
                        color: isActive ? colors.primary.main : colors.text.primary,
                        backgroundColor: isActive ? colors.primary.light : "transparent",
                      }}
                    >
                      {item.icon && <span className="mr-3">{item.icon}</span>}
                      <span>{item.title}</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}