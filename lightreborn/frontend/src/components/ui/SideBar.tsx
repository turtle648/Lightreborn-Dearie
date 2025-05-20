"use client"

import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { colors } from "@/constants/colors"
import { 
  Database, 
  UsersRound, 
  Network, 
  Building, 
  FileText, 
  Users, 
  Clipboard,
  ChevronDown,
  ChevronRight,
  ChartBarBigIcon
} from "lucide-react"

interface SidebarItem {
  title: string
  path: string
  icon: React.ReactNode
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  { 
    title: "청년 인구 분포 비율", 
    path: "/dashboard/youth-population",
    icon: <UsersRound size={16} />
  },
  { 
    title: "최적화 홍보 네트워크망", 
    path: "/dashboard/promotion-network",
    icon: <Network size={16} />
  },
  { 
    title: "협력기관 위치 최적화", 
    path: "/dashboard/welfare-center",
    icon: <Building size={16} />
  },
  { 
    title: "은둔고립 청년 상담 관리", 
    path: "/dashboard/youth-consultation",
    icon: <FileText size={16} />,
    children: [
      { 
        title: "상담 현황", 
        path: "/dashboard/youth-consultation",
        icon: <ChartBarBigIcon size={18} />
      },
      { 
        title: "상담 대상자 관리", 
        path: "/dashboard/youth-management",
        icon: <Users size={18} />
      },
      { 
        title: "상담 일지 관리", 
        path: "/dashboard/consultation-management",
        icon: <Clipboard size={18} />
      }
    ]
  }
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "/dashboard/youth-consultation": true // 기본적으로 상담 관리 메뉴는 펼쳐져 있도록 설정
  })

  const toggleExpand = (path: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }))
  }

  // 현재 경로가 하위 메뉴 중 하나인지 확인하는 함수
  const isChildActive = (children?: SidebarItem[]) => {
    if (!children) return false
    return children.some(child => pathname === child.path)
  }

  // 재귀적으로 메뉴 아이템을 렌더링하는 함수
  const renderMenuItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = pathname === item.path
    const isExpanded = expandedItems[item.path]
    const isChildItemActive = isChildActive(item.children)
    
    return (
      <li key={item.path}>
        {hasChildren ? (
          <div className="flex flex-col">
            <div
              className={`
                px-4 py-3 flex items-center justify-between cursor-pointer
                ${isActive || isChildItemActive ? "bg-[#E8F1FF]" : "hover:bg-gray-50"}
              `}
              style={{
                color: isActive || isChildItemActive ? colors.primary.main : colors.text.primary,
                backgroundColor: isActive || isChildItemActive ? colors.primary.light : "transparent",
                paddingLeft: `${depth * 12 + 16}px`
              }}
              onClick={() => toggleExpand(item.path)}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </div>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            
            {isExpanded && item.children && (
              <ul>
                {item.children.map(child => renderMenuItem(child, depth + 1))}
              </ul>
            )}
          </div>
        ) : (
          <Link href={item.path} onClick={onClose}>
            <div
              className={`
                px-4 py-3 flex items-center
                ${isActive ? "bg-[#E8F1FF]" : "hover:bg-gray-50"}
              `}
              style={{
                color: isActive ? colors.primary.main : colors.text.primary,
                backgroundColor: isActive ? colors.primary.light : "transparent",
                paddingLeft: `${depth * 12 + 16}px`
              }}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.title}</span>
            </div>
          </Link>
        )}
      </li>
    )
  }

  return (
    <>
      {/* 모바일용 오버레이 */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-1000"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div className={`
        fixed lg:relative
        lg:translate-x-0
        transition-transform duration-300 ease-in-out
        z-1000 lg:z-auto
        w-64 bg-white border-r flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `} 
      style={{ 
        borderColor: colors.table.border,
      }}>
        <nav className="flex flex-col overflow-y-auto py-2">
          <ul>
            {sidebarItems.map(item => renderMenuItem(item))}
          </ul>
          <div className="mt-auto">
            {/* 구분선 */}
            <div className="my-2 px-4"> 
              <div className="border-t border-gray-200"></div> 
            </div>
            <Link href="/dashboard/data-input" onClick={onClose}>
              <div className={`
                flex items-center px-4 py-3 gap-2 
                hover:bg-gray-50 transition-colors
              `} 
              style={{ 
                color: pathname === "/dashboard/data-input" ? colors.primary.main : colors.text.primary,
                backgroundColor: pathname === "/dashboard/data-input" ? colors.primary.light : "transparent",
              }}>
                <Database size={16} />
                <span className="font-medium">데이터 입력하기</span>
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}