import { getConsultationList, getIsolatedYouthList, getMonthlyConsultationStatus, getRecentConsultationData, uploadSurveyResponseWordFile } from "@/apis/youthConsultationApi";
import { create } from "zustand";

interface MonthlyConsultationStatus {
  currentYear : number;
  currentMonthlyCount : Array<number>;
  previousYear : number;
  previousMonthlyCount : Array<number>;
}

interface YouthConsultationStore {
  monthlyConsultationStatusFor2Years : MonthlyConsultationStatus;
  getMonthlyConsultationStatusFor2Years : () => Promise<void>;

  recentConsultationData : Array<{month: string, count: number}>;
  getRecentConsultationData : () => Promise<void>;

  uploadSurveyResponseWordFile : (formData: FormData) => Promise<void>;

  isolatedYouthList : Array<{id: number, name: string, age: number, status: string, recentDate: string, specialNote: string}>;
  getIsolatedYouthList : () => Promise<void>;

  consultationList : Array<{id: number, clientId: number, clientName: string, consultationDate: string, status: string}>;
  getConsultationList : () => Promise<void>;
}

export const useYouthConsultationStore = create<YouthConsultationStore>((set) => ({
  
  // [BarChart] 월별 상담 현황 데이터 
  monthlyConsultationStatusFor2Years : Object.create(null),
  getMonthlyConsultationStatusFor2Years : async () => {
    try {
      const response = await getMonthlyConsultationStatus();
      console.log("useYouthConsultationStore - getMonthlyConsultationStatusFor2Years response : ", response.result);
      set({ monthlyConsultationStatusFor2Years : response.result });
    } catch (error) {
      console.error("getMonthlyConsultationStatusFor2Years error : ", error);
    }
  }, 

  // [BarChart] 최근 3개월 등록 상담자 데이터 
  recentConsultationData : [],
  getRecentConsultationData : async () => {
    try {
      const response = await getRecentConsultationData();
      console.log("useYouthConsultationStore - getRecentConsultationData response : ", response.result.recentRegistrations);
      set({ recentConsultationData : response.result.recentRegistrations });
    } catch (error) {
      console.error("getRecentConsultationData error : ", error);
    }
  }, 

  // [YouthManagement] 설문 응답 워드 파일 업로드 
  uploadSurveyResponseWordFile : async (formData: FormData) => {
    try {
      const response = await uploadSurveyResponseWordFile(formData);
      console.log("useYouthConsultationStore - uploadSurveyResponseWordFile response : ", response);
      return response; // 딱히 반환값을 store에 저장할 필요 없는 경우, return response로 바로 반환하고 그걸 쓰자. 
    } catch (error) {
      console.error("uploadSurveyResponseWordFile error : ", error);
      throw new Error("uploadSurveyResponseWordFile error 발생했습니다.");
    }
  },

  // [YouthManagement] 은둔 고립 청년 리스트 반환 
  isolatedYouthList : [],
  getIsolatedYouthList : async () => {
    try {
      const response = await getIsolatedYouthList();
      console.log("useYouthConsultationStore - getIsolatedYouthList response : ", response.result);
      set({ isolatedYouthList : response.result });
    } catch (error) {
      console.error("getIsolatedYouthList error : ", error);
    }
  },

  // [ConsultationManagement] 상담일지 리스트 반환 
  consultationList : [],
  getConsultationList : async () => {
    try {
      const response = await getConsultationList();
      console.log("useYouthConsultationStore - getConsultationList response : ", response.result);
      set({ consultationList : response.result });
    } catch (error) {
      console.error("getConsultationList error : ", error);
    }
  }

}));  



