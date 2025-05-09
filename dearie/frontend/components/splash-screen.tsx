"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function SplashScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      router.push("/home")
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-white via-primary-light/10 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative w-32 h-32 mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8d5cb" />
                <stop offset="100%" stopColor="#e89a84" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path
              d="M20,20 L80,20 C85,20 90,25 90,30 L90,80 C90,85 85,90 80,90 L20,90 C15,90 10,85 10,80 L10,30 C10,25 15,20 20,20 Z"
              fill="url(#bookGradient)"
              filter="url(#glow)"
              opacity="0.9"
            />
            <path d="M50,20 L50,90 C40,85 30,85 20,90 L20,20 C30,25 40,25 50,20 Z" fill="#f8d5cb" />
            <path d="M50,20 L50,90 C60,85 70,85 80,90 L80,20 C70,25 60,25 50,20 Z" fill="#f1b29f" />
            <path
              d="M50,20 C60,25 70,25 80,20 M50,35 C60,40 70,40 80,35 M50,50 C60,55 70,55 80,50 M50,65 C60,70 70,70 80,65 M50,80 C60,85 70,85 80,80"
              stroke="#e89a84"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M50,20 C40,25 30,25 20,20 M50,35 C40,40 30,40 20,35 M50,50 C40,55 30,55 20,50 M50,65 C40,70 30,70 20,65 M50,80 C40,85 30,85 20,80"
              stroke="#f8d5cb"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="text-5xl font-bold text-gradient"
        >
          Dearie
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-gray-500 mt-2 text-center"
        >
          당신의 마음을 기록하세요
        </motion.p>
      </motion.div>
    </div>
  )
}
