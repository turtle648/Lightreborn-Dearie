"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ConsultationIntroPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consents, setConsents] = useState({
    allConsent: false,
    serviceTerms: false,
    personalInfoUsage: false,
    personalInfoProvision: false,
    personalInfoThirdParty: false,
    marketingConsent: false,
  });

  const handleBack = () => {
    router.back();
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAllConsent = (checked: boolean) => {
    setConsents({
      allConsent: checked,
      serviceTerms: checked,
      personalInfoUsage: checked,
      personalInfoProvision: checked,
      personalInfoThirdParty: checked,
      marketingConsent: checked,
    });
  };

  const handleConsentChange = (name: string, checked: boolean) => {
    const newConsents = { ...consents, [name]: checked };

    // 모든 항목이 체크되었는지 확인하여 allConsent 상태 업데이트
    const allChecked =
      newConsents.serviceTerms &&
      newConsents.personalInfoUsage &&
      newConsents.personalInfoProvision &&
      newConsents.personalInfoThirdParty &&
      newConsents.marketingConsent;

    setConsents({ ...newConsents, allConsent: allChecked });
  };

  const handleSubmit = () => {
    // 모든 필수 항목이 체크되었는지 확인
    const requiredConsentsChecked =
      consents.serviceTerms &&
      consents.personalInfoUsage &&
      consents.personalInfoProvision &&
      consents.personalInfoThirdParty &&
      consents.marketingConsent;

    if (!requiredConsentsChecked) return;

    setIsSubmitting(true);

    // 여기서 실제 API 호출을 통해 설문 결과와 동의 정보를 전송합니다
    setTimeout(() => {
      setIsSubmitting(false);
      setShowModal(false);
      router.push("/survey/consultation-complete");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 border-b">
        <button onClick={handleBack} aria-label="뒤로 가기">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="text-sm">공유하기</span>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center px-6 pt-10 pb-6">
        {/* 이미지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-48 h-48 mb-10"
        >
          <Image
            src="/consultation-gift.png"
            alt="상담 선물"
            width={192}
            height={192}
            className="object-contain"
          />
        </motion.div>

        {/* 텍스트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-auto"
        >
          <p className="text-gray-500 text-sm mb-2">나무아이티를 🌟</p>
          <h1 className="text-2xl font-bold mb-4">
            전문 상담사에게 부처님의 날
            <br />
            설문이 도착했어요
          </h1>
          <p className="text-gray-600 text-sm">
            상담을 위해서 설문 결과 내용을
            <br />
            전송해야 합니다. 전송하시겠습니까?
          </p>
        </motion.div>

        {/* 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full mt-6"
        >
          <Button
            onClick={handleOpenModal}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-md text-base"
          >
            1분 만에 차단하기
          </Button>
        </motion.div>

        {/* 하단 아이콘 */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="w-10 h-10 relative">
            <Image
              src="/professional-consultation-icon-pastel-blue.png"
              alt="전문 상담"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="w-10 h-10 relative">
            <Image
              src="/mental-health-support-icon-pastel-pink.png"
              alt="정신 건강 지원"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="w-10 h-10 relative">
            <Image
              src="/personalized-advice-icon-pastel-purple.png"
              alt="맞춤형 조언"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
      </main>

      {/* 개인정보 동의 모달 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={handleCloseModal}
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
                <h2 className="text-lg font-bold mb-4 text-center">
                  광고 전화를 차단하려면 동의가 필요해요
                </h2>

                <div className="overflow-y-auto flex-1">
                  {/* 서비스 이용 약관 */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="serviceTerms"
                        checked={consents.serviceTerms}
                        onChange={(e) =>
                          handleConsentChange("serviceTerms", e.target.checked)
                        }
                        className="h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="serviceTerms"
                        className="ml-3 text-sm text-blue-500"
                      >
                        [필수] 서비스 이용 약관(토스)
                      </label>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* 개인정보 수집 이용 동의 */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="personalInfoUsage"
                        checked={consents.personalInfoUsage}
                        onChange={(e) =>
                          handleConsentChange(
                            "personalInfoUsage",
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="personalInfoUsage"
                        className="ml-3 text-sm text-blue-500"
                      >
                        [필수] 개인정보 수집·이용 동의(토스)
                      </label>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* 이용 약관 */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="personalInfoProvision"
                        checked={consents.personalInfoProvision}
                        onChange={(e) =>
                          handleConsentChange(
                            "personalInfoProvision",
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="personalInfoProvision"
                        className="ml-3 text-sm text-blue-500"
                      >
                        [필수] 이용 약관(공정거래위원회)
                      </label>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* 개인정보 수집 이용 동의 (공정거래위원회) */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="personalInfoThirdParty"
                        checked={consents.personalInfoThirdParty}
                        onChange={(e) =>
                          handleConsentChange(
                            "personalInfoThirdParty",
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="personalInfoThirdParty"
                        className="ml-3 text-sm text-blue-500"
                      >
                        [필수] 개인정보 수집·이용 동의(공정거래위원회)
                      </label>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* 개인정보 수집 이용 동의 (휴대폰 인증) */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="marketingConsent"
                        checked={consents.marketingConsent}
                        onChange={(e) =>
                          handleConsentChange(
                            "marketingConsent",
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="marketingConsent"
                        className="ml-3 text-sm text-blue-500"
                      >
                        [필수] 개인정보 수집·이용 동의(휴대폰 인증)
                      </label>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="mt-4">
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-medium"
                    onClick={handleSubmit}
                    disabled={!consents.allConsent || isSubmitting}
                  >
                    {isSubmitting ? "처리 중..." : "동의하고 차단하기"}
                  </Button>
                  <div className="text-center mt-4">
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-500 text-sm"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
