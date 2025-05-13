"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export interface ConsentItem {
  id: string;
  label: string;
  required: boolean;
}

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  submitButtonText: string;
  cancelButtonText?: string;
  consentItems: ConsentItem[];
}

export function ConsentModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitButtonText,
  cancelButtonText = "닫기",
  consentItems,
}: ConsentModalProps) {
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [allConsented, setAllConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 컴포넌트가 마운트될 때 동의 항목 초기화
  useEffect(() => {
    const initialConsents: Record<string, boolean> = {};
    consentItems.forEach((item) => {
      initialConsents[item.id] = false;
    });
    setConsents(initialConsents);
  }, [consentItems]);

  // 모든 필수 항목이 체크되었는지 확인
  useEffect(() => {
    const requiredItems = consentItems.filter((item) => item.required);
    const allRequiredChecked = requiredItems.every((item) => consents[item.id]);
    setAllConsented(allRequiredChecked);
  }, [consents, consentItems]);

  const handleConsentChange = (id: string, checked: boolean) => {
    setConsents((prev) => ({ ...prev, [id]: checked }));
  };

  const handleAllConsent = (checked: boolean) => {
    const newConsents: Record<string, boolean> = {};
    consentItems.forEach((item) => {
      newConsents[item.id] = checked;
    });
    setConsents(newConsents);
  };

  const handleSubmit = async () => {
    if (!allConsented) return;

    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full rounded-t-xl overflow-hidden shadow-xl h-[50vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 콘텐츠 */}
            <div className="p-5 w-full h-full flex flex-col">
              <h2 className="text-lg font-bold mb-4 text-center">{title}</h2>

              <div className="overflow-y-auto flex-1">
                {/* 전체 동의 옵션 */}
                {consentItems.length > 1 && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allConsent"
                        checked={allConsented}
                        onChange={(e) => handleAllConsent(e.target.checked)}
                        className="h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="allConsent"
                        className="ml-3 text-sm font-medium"
                      >
                        모두 동의
                      </label>
                    </div>
                  </div>
                )}

                {/* 개별 동의 항목 */}
                {consentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={consents[item.id] || false}
                        onChange={(e) =>
                          handleConsentChange(item.id, e.target.checked)
                        }
                        className="h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={item.id}
                        className="ml-3 text-sm text-blue-500"
                      >
                        {item.label}
                      </label>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>

              {/* 하단 버튼 */}
              <div className="mt-4">
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-medium"
                  onClick={handleSubmit}
                  disabled={!allConsented || isSubmitting}
                >
                  {isSubmitting ? "처리 중..." : submitButtonText}
                </Button>
                <div className="text-center mt-4">
                  <button onClick={onClose} className="text-gray-500 text-sm">
                    {cancelButtonText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
