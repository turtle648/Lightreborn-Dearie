"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { AgreementDTO } from "@/types/response.survey";

export interface ConsentItem {
  id: string;
  label: string;
  required: boolean;
}

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (consents: Record<string, boolean>) => void;
  title: string;
  submitButtonText: string;
  cancelButtonText?: string;
  consentItems: ConsentItem[];
  agreements: AgreementDTO[];
  isSubmitting: boolean; // ✅ 외부 로딩 상태 prop
}

export function ConsentModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitButtonText,
  cancelButtonText = "닫기",
  consentItems,
  agreements,
  isSubmitting,
}: ConsentModalProps) {
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [allConsented, setAllConsented] = useState(false);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    consentItems.forEach((item) => {
      initial[item.id] = false;
    });
    setConsents(initial);
    setIsAllChecked(false);
  }, [consentItems]);

  useEffect(() => {
    const requiredItems = consentItems.filter((item) => item.required);
    const allChecked = requiredItems.every((item) => consents[item.id]);
    setAllConsented(allChecked);
  }, [consents, consentItems]);

  const handleConsentChange = (id: string, checked: boolean) => {
    setConsents((prev) => ({ ...prev, [id]: checked }));
    setIsAllChecked(false);
  };

  const handleAllConsent = (checked: boolean) => {
    const updated: Record<string, boolean> = {};
    consentItems.forEach((item) => {
      updated[item.id] = checked;
    });
    setConsents(updated);
    setIsAllChecked(checked);
  };

  const handleSubmit = async () => {
    if (!allConsented || isSubmitting) return;
    await onSubmit(consents);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
            className="relative bg-white w-full rounded-t-xl overflow-hidden shadow-xl h-[50vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ 전송 중 로딩 오버레이 */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
              </div>
            )}

            <div className="p-5 w-full h-full flex flex-col">
              <h2 className="text-lg font-bold mb-4 text-center">{title}</h2>

              <div className="overflow-y-auto flex-1">
                {consentItems.length > 1 && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allConsent"
                        checked={isAllChecked}
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

                {consentItems.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const agreement = agreements.find(
                    (a) => `agreement-${a.agreementId}` === item.id
                  );

                  return (
                    <div key={item.id} className="py-3 border-b">
                      <div className="flex items-center justify-between">
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
                        {agreement && (
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="text-sm text-gray-500"
                          >
                            <ChevronRight
                              className={`h-5 w-5 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {isExpanded && agreement && (
                        <div className="mt-2 ml-7 text-xs text-muted-foreground space-y-1 bg-muted/20 p-3 rounded-md">
                          <div>
                            <strong>목적:</strong> {agreement.purpose}
                          </div>
                          <div>
                            <strong>수집 항목:</strong> {agreement.items}
                          </div>
                          <div>
                            <strong>보관 기간:</strong>{" "}
                            {agreement.retentionPeriod}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 버튼 영역 */}
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
