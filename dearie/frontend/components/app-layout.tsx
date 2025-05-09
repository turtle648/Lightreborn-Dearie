import type { ReactNode } from "react"
import { BottomNavigation } from "./bottom-navigation"
import { TopNavigation } from "./top-navigation"

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
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      {!hideHeader && (showBack || title || rightAction) && (
        <TopNavigation
          showBack={showBack}
          title={title}
          rightAction={rightAction}
          transparent={transparentHeader}
          fullWidth={showFullWidthHeader}
        />
      )}
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>
      {showBottomNav && <BottomNavigation />}
    </div>
  )
}
