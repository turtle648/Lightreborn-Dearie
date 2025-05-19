"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IntroductionScreen } from "@/components/introduction-screen";
import { ConsentModal, type ConsentItem } from "@/components/consent-modal";
import { useAgreementStore } from "@/stores/agreement-store";
import { AgreementDTO } from "@/types/response.survey";
import { postAgreement, postSurveyResultToDashboard } from "@/apis/survey-api";

export default function ConsultationIntroPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 추가

  const { agreements, hasHydrated } = useAgreementStore();

  if (!hasHydrated) {
    return null; // 또는 <LoadingScreen />
  }

  if (agreements.length === 0) {
    return (
      <div className="text-center text-sm py-10 text-muted-foreground">
        설문 동의 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const consentItems: ConsentItem[] = agreements.map(
    (agreement: AgreementDTO) => ({
      id: `agreement-${agreement.agreementId}`,
      label: agreement.title,
      required: agreement.isRequired,
    })
  );

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConsentSubmit = async (consents: Record<string, boolean>) => {
    try {
      const { surveyId, agreements } = useAgreementStore.getState();

      if (!surveyId || agreements.length === 0) {
        console.warn("전송 불가: surveyId 또는 agreements 없음");
        return;
      }

      setIsSubmitting(true); // ✅ 로딩 시작

      const agreementPayload = agreements.map((agreement) => ({
        agreementId: agreement.agreementId,
        isAgreed: consents[`agreement-${agreement.agreementId}`] ?? false,
      }));

      const payload = {
        surveyId,
        agreements: agreementPayload,
      };

      const agreementSuccess = await postAgreement(payload);

      if (!agreementSuccess) {
        alert("동의 전송에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      const resultSuccess = await postSurveyResultToDashboard(surveyId); // ✅ 추가

      if (!resultSuccess) {
        alert("설문 결과 전송에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      router.push("/survey/consultation-complete");
    } catch (error) {
      console.error("동의 또는 결과 제출 중 오류 발생:", error);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <IntroductionScreen
        title="전문 상담사에게 전달할 설문 결과가 준비되었습니다"
        subtitle="웅상 사회 복지관"
        description={
          <>
            상담을 위해서 설문 결과 내용을
            <br />
            전송해야 합니다. 전송하시겠습니까?
          </>
        }
        imageSrc="/dearie/images/message.png"
        imageAlt="상담 선물"
        buttonText="1분 만에 전송하기"
        showBackButton={true}
        showShareButton={true}
        onButtonClick={handleOpenModal}
      />

      <ConsentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleConsentSubmit}
        title="전송을 위해선 동의가 필요해요"
        submitButtonText="동의하고 전송하기"
        consentItems={consentItems}
        agreements={agreements}
        isSubmitting={isSubmitting} // ✅ 전달
      />
    </>
  );
}
