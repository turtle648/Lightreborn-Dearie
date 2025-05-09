"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    // Show skip button after a short delay
    const timer = setTimeout(() => setShowSkip(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="relative w-full max-w-md aspect-[3/4] overflow-hidden rounded-3xl">
          {/* Background night sky with stars */}
          <div className="absolute inset-0 bg-[#0a1a2a]">
            <div className="absolute inset-0 animate-twinkle">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-70"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 5}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Window frame */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
          >
            <div className="relative w-[85%] h-[60%] border-4 border-[#1a2a3a] rounded-md bg-[#0a1a2a] overflow-hidden">
              {/* Window panes */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="border-r-2 border-b-2 border-[#1a2a3a]"></div>
                <div className="border-b-2 border-[#1a2a3a]"></div>
                <div className="border-r-2 border-[#1a2a3a]"></div>
                <div></div>
              </div>

              {/* Night sky with stars and shooting star */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a2a] to-[#1a2a3a]">
                {/* Shooting star */}
                <motion.div
                  className="absolute w-[3px] h-[3px] bg-white rounded-full"
                  initial={{ top: "20%", left: "80%", opacity: 0 }}
                  animate={{
                    top: "40%",
                    left: "30%",
                    opacity: [0, 1, 0],
                    filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
                  }}
                  transition={{
                    delay: 2,
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 8,
                  }}
                >
                  <div className="absolute top-0 left-0 w-[50px] h-[1px] bg-gradient-to-r from-white to-transparent transform -rotate-45"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Curtains */}
          <motion.div
            className="absolute inset-0 flex justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            {/* Left curtain */}
            <motion.div
              className="h-full w-[25%] bg-gradient-to-r from-[#1a2a3a] to-[#1a2a3a]/50"
              initial={{ x: "-100%" }}
              animate={{ x: "-20%" }}
              transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
            />
            {/* Right curtain */}
            <motion.div
              className="h-full w-[25%] bg-gradient-to-l from-[#1a2a3a] to-[#1a2a3a]/50"
              initial={{ x: "100%" }}
              animate={{ x: "20%" }}
              transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
            />
          </motion.div>

          {/* Plants */}
          <motion.div
            className="absolute bottom-[20%] left-[50%] transform -translate-x-1/2 flex justify-center space-x-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            {/* Left plant (pine) */}
            <div className="relative w-16 h-20">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-md bg-[#3a2a1a]"></div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-[#1a3a2a]"></div>
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#1a3a2a]"></div>
              <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-[#1a3a2a]"></div>
            </div>

            {/* Right plant (leafy) */}
            <div className="relative w-16 h-20">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-md bg-[#3a2a1a]"></div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-10 h-10">
                <div className="absolute w-5 h-8 bg-[#2a4a3a] rounded-full transform -rotate-30 left-0"></div>
                <div className="absolute w-5 h-8 bg-[#2a4a3a] rounded-full transform rotate-30 right-0"></div>
                <div className="absolute w-5 h-8 bg-[#2a4a3a] rounded-full top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            className="absolute bottom-[10%] left-0 right-0 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <p className="text-white text-lg font-medium">오늘 하루도 수고하셨어요</p>
            <p className="text-white/70 text-sm mt-1">당신의 마음을 기록해보세요</p>
          </motion.div>
        </div>

        {/* Skip button */}
        <AnimatePresence>
          {showSkip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <Button
                onClick={onComplete}
                variant="ghost"
                className="text-white/70 hover:text-white flex items-center gap-2"
              >
                시작하기
                <ChevronDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
