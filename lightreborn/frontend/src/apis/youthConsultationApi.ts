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
export const getIsolatedYouthList = async (page = 0, size = 10) => {
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
