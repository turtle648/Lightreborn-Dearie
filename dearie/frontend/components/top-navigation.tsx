"use client"

import type { ReactNode } from "react"
import { ArrowLeft, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TopNavigationProps {
  showBack?: boolean
  title?: string
  rightAction?: ReactNode
  transparent?: boolean
  fullWidth?: boolean
}

export function TopNavigation({
  showBack = false,
  title,
  rightAction,
  transparent = false,
  fullWidth = false,
}: TopNavigationProps) {
  const router = useRouter()

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex items-center justify-between h-16",
        transparent ? "bg-transparent" : "glass-effect",
        fullWidth ? "px-0" : "px-6",
      )}
    >
      <div className={cn("flex items-center", fullWidth ? "px-6" : "")}>
        {showBack && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2 rounded-full">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">뒤로 가기</span>
          </Button>
        )}
        {title && <h1 className="text-lg font-medium">{title}</h1>}
        {!showBack && !title && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className={cn("text-2xl font-bold", transparent ? "text-white drop-shadow-md" : "text-gradient")}>
              Dearie
            </h1>
          </motion.div>
        )}
      </div>
      {rightAction ? (
        <div className={cn(fullWidth ? "px-6" : "")}>{rightAction}</div>
      ) : (
        <div className={cn(fullWidth ? "px-6" : "")}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full",
              transparent
                ? "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                : "bg-white/80 shadow-sm text-gray-700",
            )}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  )
}
