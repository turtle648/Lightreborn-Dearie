import axiosInstance from '@/lib/axios'

export interface EmotionScores {
  [emotion: string]: number
}

export interface ReportSummaryResponse {
  summary: string
  comment: string
  emotionScores: EmotionScores
  recommendations?: string[]
  needSurvey?: boolean
}

export const fetchReportSummary = async (userId: number, date: string): Promise<ReportSummaryResponse> => {
  try {
    console.log('리포트 조회 시도:', { userId, date });
    
    // 리포트 조회 시도
    const response = await axiosInstance.get<ReportSummaryResponse>(`/my-reports/summary`, {
      params: {
        userId,
        date,
      },
    })
    console.log('리포트 조회 성공:', response.data);
    return response.data
  } catch (error: any) {
    console.error('리포트 조회 중 상세 오류:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      error: error.response?.data
    });

    // if (error.response?.status === 404) {
    //   console.log('리포트가 없어 자동으로 생성합니다...')
    //   // 리포트가 없으면 자동으로 생성 시도
    //   try {
    //     const report = await analyzeReport(userId, date)
    //     console.log('리포트 자동 생성 성공:', report);
    //     return report;
    //   } catch (analyzeError: any) {
    //     console.error('리포트 자동 생성 실패:', {
    //       status: analyzeError.response?.status,
    //       message: analyzeError.response?.data?.message || analyzeError.message,
    //       error: analyzeError.response?.data
    //     });
    //     throw new Error('리포트 생성에 실패했습니다. 잠시 후 다시 시도해주세요.')
    //   }
    // }
    throw error
  }
}

export const analyzeReport = async (userId: number, date: string): Promise<ReportSummaryResponse> => {
  try {
    console.log('리포트 생성 시도:', { userId, date });
    
    const response = await axiosInstance.post<ReportSummaryResponse>(`/my-reports/analyze`, null, {
      params: {
        userId,
        date,
      },
    })
    console.log('리포트 생성 성공:', response.data);
    return response.data
  } catch (error: any) {
    console.error('리포트 생성 중 상세 오류:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      error: error.response?.data
    });
    throw error
  }
}