"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { useOfflineMode } from "@/hooks/use-offline-mode"
import { motion, AnimatePresence } from "framer-motion"

export function OfflineNotice() {
  const { isOffline, wasOffline, setWasOffline } = useOfflineMode()
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    // 오프라인에서 온라인으로 전환된 경우
    if (!isOffline && wasOffline) {
      setShowReconnected(true)
      const timer = setTimeout(() => {
        setShowReconnected(false)
        setWasOffline(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOffline, wasOffline, setWasOffline])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg max-w-md mx-auto">
            <div className="flex items-center">
              <WifiOff className="h-5 w-5 text-amber-500 mr-3" aria-hidden="true" />
              <div>
                <h3 className="font-medium text-amber-800">오프라인 모드</h3>
                <p className="text-sm text-amber-700 mt-1">인터넷 연결이 끊겼습니다. 일부 기능이 제한될 수 있습니다.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-md mx-auto">
            <div className="flex items-center">
              <Wifi className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" />
              <div>
                <h3 className="font-medium text-green-800">연결 복원됨</h3>
                <p className="text-sm text-green-700 mt-1">
                  인터넷 연결이 복원되었습니다. 모든 기능을 사용할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
