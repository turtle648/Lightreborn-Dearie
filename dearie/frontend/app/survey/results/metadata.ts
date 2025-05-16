export async function generateMetadata({
  params,
}: {
  params: { resultId: string };
}) {
  return {
    title: "고립/은둔 척도 결과",
    description: "당신의 고립/은둔 상태를 분석한 설문 결과를 확인해보세요.",
    openGraph: {
      title: "고립/은둔 척도 결과",
      description: "지금 내 고립/은둔 상태는 어떤지 확인해보세요.",
      url: `https://k12s309.p.ssafy.io/dearie/survey/results?resultId=${params.resultId}`,
      siteName: "Dearie",
      images: [
        {
          url: `https://k12s309.p.ssafy.io/dearie/images/survey-og.png`,
          width: 1200,
          height: 630,
          alt: "설문 결과 미리보기",
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "고립/은둔 척도 결과",
      description: "설문을 통해 고립/은둔 상태를 확인하세요.",
      images: [`https://k12s309.p.ssafy.io/dearie/images/survey-og.png`],
    },
  };
}
