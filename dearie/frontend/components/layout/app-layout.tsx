import type { ReactNode } from "react"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { TopNavigation } from "@/components/layout/top-navigation"
import { LoadingSpinner } from "@/components/common/loading-spinner"

// 동적 임포트로 코드 스플리팅 적용
const BottomNavigation = dynamic(() => import("@/components/layout/bottom-navigation"), {
  loading: () => <div className="h-16"></div>,
  ssr: false,
})

interface AppLayoutProps {
  children: ReactNode
  showBack?: boolean
  title?: string
  rightAction?: ReactNode
  showBottomNav?: boolean
  transparentHeader?: boolean
  showFullWidthHeader?: boolean
  hideHeader?: boolean
}

export function AppLayout({
  children,
  showBack = false,
  title,
  rightAction,
  showBottomNav = true,
  transparentHeader = false,
  showFullWidthHeader = false,
  hideHeader = false,
}: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white sm:border-x sm:border-gray-200 sm:shadow-lg">
      {!hideHeader && (showBack || title || rightAction) && (
        <TopNavigation
          showBack={showBack}
          title={title}
          rightAction={rightAction}
          transparent={transparentHeader}
          fullWidth={showFullWidthHeader}
        />
      )}
      <main className="flex-1 overflow-y-auto pb-16" role="main">
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  )
}
