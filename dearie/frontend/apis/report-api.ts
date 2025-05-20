import axiosInstance from '@/lib/axios';

export interface EmotionScores {
  [emotion: string]: number;
}

export interface ReportSummaryResponse {
  summary: string;
  comment: string;
  emotionScores: EmotionScores;
  needSurvey: boolean;
  recommendations?: string[];
}

export const fetchReportSummary = async (userId: number, date: string): Promise<ReportSummaryResponse> => {
  const response = await axiosInstance.get<ReportSummaryResponse>('/my-reports/summary', {
    params: {
      userId,
      date,
    },
  });
  return response.data;
};

export const analyzeReport = async (userId: number, date: string): Promise<ReportSummaryResponse> => {
  const response = await axiosInstance.post<ReportSummaryResponse>(
    '/my-reports/analyze',
    {}, // POST body 비움
    {
      params: {
        userId,
        date,
      },
    }
  );
  return response.data;
};

// export interface EmotionScores {
//   [emotion: string]: number;
// }

// export interface ReportSummaryResponse {
//   summary: string;
//   comment: string;
//   emotionScores: EmotionScores;
//   needSurvey: boolean;
// }

// // 실제 API 호출 주석 처리! 더미 데이터만 반환
// export const fetchReportSummary = async (userId: number, date: string): Promise<ReportSummaryResponse> => {
//   // await axiosInstance.get ... << 이 부분 완전히 삭제!
//   return {
//     summary: "이번 주는 불안이 많았어요.",
//     comment: "마음을 잘 돌봐주세요.",
//     emotionScores: { 기쁨: 20, 슬픔: 10, 분노: 5, 불안: 50, 평온: 15 },
//     needSurvey: true,
//   };
// };