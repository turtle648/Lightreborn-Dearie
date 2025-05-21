import { api } from "./index";

// 월별 상담 현황 
export const getMonthlyConsultationStatus = async () => {
  try {
    const response = await api.get("/youth-consultation/yearly-consultations");
    console.log("getMonthlyConsultationStatus API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getMonthlyConsultationStatus error : ", error);
    throw new Error("getMonthlyConsultationStatus error 발생했습니다.");
  }
}

// 최근 3개월 등록 상담자 데이터 
export const getRecentConsultationData = async () => {
  try {
    const response = await api.get("/youth-consultation/summary");
    console.log("getRecentConsultationData API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getRecentConsultationData error : ", error);
    throw new Error("getRecentConsultationData error 발생했습니다.");
  }
}

// youth-management 

// 설문 응답 워드 파일 업로드 
export const uploadSurveyResponseWordFile = async (formData: FormData) => {
  try {
    const response = await api.post("/youth-consultation/isolated-youth", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("uploadSurveyResponseWordFile API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("uploadSurveyResponseWordFile error : ", error);
    throw new Error("uploadSurveyResponseWordFile error 발생했습니다.");
  }
}

// 은둔 고립 청년 리스트 반환 
export const getIsolatedYouthList = async (page = 0, size = 100) => {
  try {
    const response = await api.get(`/youth-consultation/isolated-youths?page=${page}&size=${size}`);
    console.log("getIsolatedYouthList API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getIsolatedYouthList error : ", error);
    throw new Error("getIsolatedYouthList error 발생했습니다.");
  }
}

// 상담일지 리스트 가져오기 (5개씩) 
export const getConsultationList = async (page = 0, size = 5) => {
  try {
    const response = await api.get(`/youth-consultation?page=${page}&size=${size}`);
    console.log("getConsultationList API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getConsultationList error : ", error);
    throw new Error("getConsultationList error 발생했습니다."); 
  }
}

// 연도별 상담 일지 리스트 가져오기 
export const getConsultationListByYear = async (year: number, page = 0, size = 500) => {
  try {
    const response = await api.post("/youth-consultation/statistics", { year, page, size });
    console.log("getConsultationListByYear API response : ", response.data);
    return response.data;
  } catch (error) { 
    console.error("getConsultationListByYear error : ", error);
    throw new Error("getConsultationListByYear error 발생했습니다.");
  }
}

// 등록 청년 조회하기 
export const getRegisteredYouthList = async (name?: string, pageNum: number = 0, sizeNum: number = 500) => {
  try {
    const response = await api.post("/youth-consultation/people", {
      params: {
        name: name, 
        pageNum: pageNum, 
        sizeNum: sizeNum,
      },
    });
    console.log("getRegisteredYouthList API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getRegisteredYouthList error : ", error);
    throw new Error("getRegisteredYouthList error 발생했습니다.");
  }
}

// 상담 일정 추가하기 
export const makeNewConsultation = async (youthId: number, date: string) => {
  try {
    const response = await api.post(`/youth-consultation/${youthId}/schedules`, { date });
    console.log("makeNewConsultation API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("makeNewConsultation error : ", error);
    throw new Error("makeNewConsultation error 발생했습니다.");
  }
}

// 특정 상담 일지 상세정보 가져오기 
export const getConsultationDetail = async (counselingId: number) => {
  try {
    const response = await api.get(`/youth-consultation/counseling/${counselingId}`);
    console.log("getConsultationDetail API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getConsultationDetail error : ", error);
    throw new Error("getConsultationDetail error 발생했습니다.");
  }
}

// 특정 상담일지 AI 코멘트 호출 
export const getConsultationComment = async (file: File, counselingLogId: number) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("counselingLogId", counselingLogId.toString());

    const response = await api.post(`/youth-consultation/data`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("getConsultationComment API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getConsultationComment error : ", error);
    throw new Error("getConsultationComment error 발생했습니다.");
  }
}

// 특정 상담일지 AI 코멘트 수정 
export const updateConsultationComment = async (counselingId: number, summary: string, client: string, counselor: string, memos: string) => {
  try {
    console.log("updateConsultationComment API request : ", {
      counselingId: counselingId,
      summary: summary,
      client: client, 
      counselor: counselor, 
      memos: memos,
    });
    const response = await api.patch(`/youth-consultation/counseling/${counselingId}`, {
      summary: summary,
      client: client, 
      counselor: counselor, 
      memos: memos,
    });
    console.log("updateConsultationComment API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("updateConsultationComment error : ", error);
    throw new Error("updateConsultationComment error 발생했습니다.");
  }
}

// 누적 상담현황 조회 
export const getCumulativeConsultationStatus = async () => {
  try {
    const response = await api.get("/youth-consultation/isolation-level");
    console.log("getCumulativeConsultationStatus API response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getCumulativeConsultationStatus error : ", error);
    throw new Error("getCumulativeConsultationStatus error 발생했습니다.");
  }
}
