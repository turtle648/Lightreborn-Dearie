"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IntroductionScreen } from "@/components/introduction-screen";
import { ConsentModal, type ConsentItem } from "@/components/consent-modal";

export default function ConsultationIntroPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // 동의 항목 정의
  const consentItems: ConsentItem[] = [
    {
      id: "serviceTerms",
      label: "[필수] 서비스 이용 약관(토스)",
      required: true,
    },
    {
      id: "personalInfoUsage",
      label: "[필수] 개인정보 수집·이용 동의(토스)",
      required: true,
    },
    {
      id: "personalInfoProvision",
      label: "[필수] 이용 약관(공정거래위원회)",
      required: true,
    },
    {
      id: "personalInfoThirdParty",
      label: "[필수] 개인정보 수집·이용 동의(공정거래위원회)",
      required: true,
    },
    {
      id: "marketingConsent",
      label: "[필수] 개인정보 수집·이용 동의(휴대폰 인증)",
      required: true,
    },
  ];

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConsentSubmit = async () => {
    try {
      // 여기서 실제 API 호출을 통해 설문 결과와 동의 정보를 전송합니다
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/survey/consultation-complete");
    } catch (error) {
      console.error("동의 제출 중 오류 발생:", error);
    } finally {
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

      {/* 동의 모달 컴포넌트 - 부모 컴포넌트에서 관리 */}
      <ConsentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleConsentSubmit}
        title="전송을 위해선 동의가 필요해요"
        submitButtonText="동의하고 전송하기"
        consentItems={consentItems}
      />
    </>
  );
}
