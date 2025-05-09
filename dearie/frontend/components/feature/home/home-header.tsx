"use client"

import { motion } from "framer-motion"

export function HomeHeader() {
  return (
    <div className="relative pt-6 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold">안녕하세요,</h2>
        <p className="text-3xl font-bold text-gray-700">오늘 하루는 어떠셨나요?</p>
      </motion.div>
    </div>
  )
}
