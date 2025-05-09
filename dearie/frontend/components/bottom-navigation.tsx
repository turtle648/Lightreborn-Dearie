"use client"

import { Home, BookOpen, Sparkles, User, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "홈",
      href: "/home",
      icon: Home,
    },
    {
      name: "미션",
      href: "/mission",
      icon: Sparkles,
    },
    {
      name: "작성",
      href: "/diary/new",
      icon: Plus,
      primary: true,
    },
    {
      name: "일기",
      href: "/diary",
      icon: BookOpen,
    },
    {
      name: "마이",
      href: "/mypage",
      icon: User,
    },
  ]

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="fixed bottom-4 left-0 right-0 z-10 max-w-md mx-auto px-4"
    >
      <div className="glass-effect rounded-2xl shadow-lg">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex-1">
              <div
                className={cn(
                  "flex flex-col items-center justify-center h-full",
                  pathname === item.href ? "text-primary" : "text-gray-500",
                )}
              >
                {item.primary ? (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-soft text-white shadow-lg shadow-primary/20 -mt-6">
                    <item.icon className="h-6 w-6" />
                  </div>
                ) : (
                  <>
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs mt-1 font-medium">{item.name}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
