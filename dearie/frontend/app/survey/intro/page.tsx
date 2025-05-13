"use client";

import { useRouter } from "next/navigation";
import { IntroductionScreen } from "@/components/introduction-screen";

export default function ConsultationIntroPage() {
  const router = useRouter();

  const handleConsentSubmit = async () => {
    try {
      router.push("/survey");
    } catch (error) {
      console.error("동의 제출 중 오류 발생:", error);
    }
  };

  return (
    <>
      <IntroductionScreen
        title="자가 점검 설문이 준비되었어요"
        subtitle="고립 은둔 척도 설문"
        description={
          <>
            지금 나의 고립·은둔 정도를 확인해보세요.
            <br />
            간단한 설문으로 스스로를 점검할 수 있습니다.
          </>
        }
        imageSrc="/dearie/images/survey.png"
        imageAlt="상담 시작"
        buttonText="지금 하러 가기"
        showBackButton={true}
        showShareButton={true}
        onButtonClick={handleConsentSubmit}
      />
    </>
  );
}
