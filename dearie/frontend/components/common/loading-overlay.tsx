"use client";

import { motion } from "framer-motion";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({
  message = "일기를 저장하고 있어요!",
}: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center max-w-xs w-full">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </motion.div>
  );
}
