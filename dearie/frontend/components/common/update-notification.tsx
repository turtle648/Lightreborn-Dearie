"use client"

import { Button } from "@/components/ui/button"
import { usePWALifecycle } from "@/hooks/use-pwa-lifecycle"
import { RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function UpdateNotification() {
  const { isUpdateAvailable, updateServiceWorker } = usePWALifecycle()

  if (!isUpdateAvailable) return null

  return (
    <AnimatePresence>
      {isUpdateAvailable && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 left-0 right-0 z-50 mx-auto max-w-md px-4"
          role="alert"
          aria-live="polite"
        >
          <div className="glass-effect rounded-2xl p-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium mb-1">앱 업데이트 가능</h3>
                <p className="text-sm text-gray-600">
                  Dearie 앱의 새 버전이 있습니다. 최신 기능과 개선사항을 적용하려면 업데이트하세요.
                </p>
              </div>
              <div className="flex items-center ml-4">
                <Button
                  onClick={updateServiceWorker}
                  className="rounded-full bg-gradient-soft text-white"
                  aria-label="앱 업데이트하기"
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  업데이트
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
