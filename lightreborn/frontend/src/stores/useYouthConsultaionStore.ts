import { getConsultationComment, getConsultationDetail, getConsultationList, getConsultationListByYear, getCumulativeConsultationStatus, getIsolatedYouthList, getMonthlyConsultationStatus, getRecentConsultationData, getRegisteredYouthList, getRegisteredYouthListWithProcessStep, makeNewConsultation, updateConsultationComment, uploadSurveyResponseWordFile } from "@/apis/youthConsultationApi";
import { create } from "zustand";

interface MonthlyConsultationStatus {
  currentYear : number;
  currentMonthlyCount : Array<number>;
  previousYear : number;
  previousMonthlyCount : Array<number>;
}

interface ConsultationDetail {
  code: number;
  message: string;
  result: {
    counselingLog: {
      id: number;
      consultationDate: string;
      voiceFileUrl: string;
      fullScript: string;
      summarize: string;
      counselorKeyword: string;
      clientKeyword: string;
      memoKeyword: string;
      counselingProcess: string;
      isolatedYouth: {
        id: number;
        isolationLevel: string;
        economicLevel: string;
        economicActivityRecent: string;
        isolatedScore: number;
        surveyProcessStep: string;
        personalInfo: {
          id: number;
          name: string;
          phoneNumber: string;
          birthDate: string;
          emergencyContact: string;
          age: number;
        };
      };
      user: {
        id: number;
        userId: string;
        name: string;
        role: number;
      };
    };
  };
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

  consultationListByYear : Array<{id: number, clientId: number, clientName: string, consultantName: string, consultationDate: string, status: string}>;
  getConsultationListByYear : (year: number) => Promise<void>;

  registeredYouthList : Array<{id: number, name: string, age: number, status: string, recentDate: string, specialNote: string}>;
  getRegisteredYouthList : () => Promise<void>;

  registeredYouthListWithProcessStep : Array<{id: number, name: string, age: number, processStep: string}>;
  getRegisteredYouthListWithProcessStep : () => Promise<void>;

  makeNewConsultation : (youthId: number, date: string) => Promise<void>;

  consultationDetail : ConsultationDetail | null;
  getConsultationDetail : (counselingId: number) => Promise<void>;

  getConsultationComment : (file: File, counselingLogId: number) => Promise<void>;
  updateConsultationComment : (counselingId: number, summary: string, client: string, counselor: string, memos: string) => Promise<void>;

  cumulativeConsultationStatus : Array<{totalCount: number, nonRiskCount: number, atRiskCount: number, isolatedYouthCount: number, reclusiveYouthCount: number}>;
  getCumulativeConsultationStatus : () => Promise<void>;
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
      console.log("useYouthConsultationStore - getIsolatedYouthList response : ", response.result.content);
      set({ isolatedYouthList : response.result.content });
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
  },

  // [ConsultationManagement] 연도별 상담 일지 리스트 반환 
  consultationListByYear : [],
  getConsultationListByYear : async (year: number) => {
    try {
      const response = await getConsultationListByYear(year);
      console.log("useYouthConsultationStore - getConsultationListByYear response : ", response.result.counselingLogs);
      set({ consultationListByYear : response.result.counselingLogs });
    } catch (error) {
      console.error("getConsultationListByYear error : ", error);
    }
  },

  // [consultationManagement/makenew] 등록 청년 조회하기 
  registeredYouthList : [],
  getRegisteredYouthList : async () => {
    try {
      const response = await getRegisteredYouthList();
      console.log("useYouthConsultationStore - getRegisteredYouthList response : ", response.result.youthInfos);
      set({ registeredYouthList : response.result.youthInfos });
    } catch (error) {
      console.error("getRegisteredYouthList error : ", error);
    }
  },

  // [consultationManagement/] 등록 청년 상태 포함 조회하기 
  registeredYouthListWithProcessStep : [],
  getRegisteredYouthListWithProcessStep : async () => {
    try {
      const response = await getRegisteredYouthListWithProcessStep();
      console.log("useYouthConsultationStore - getRegisteredYouthListWithProcessStep response : ", response.result.content);
      set({ registeredYouthListWithProcessStep : response.result.content });
    } catch (error) {
      console.error("getRegisteredYouthListWithProcessStep error : ", error);
    }
  },

  // [consultationManagement/makenew] 상담 일정 추가하기 
  makeNewConsultation : async (youthId: number, date: string) => {
    try {
      const response = await makeNewConsultation(youthId, date);
      console.log("useYouthConsultationStore - makeNewConsultation response : ", response);
      return response;
    } catch (error) {
      console.error("makeNewConsultation error : ", error);
      throw new Error("makeNewConsultation error 발생했습니다.");
    }
  },

  // [consultationManagement/[counselingId]] 특정 상담 일지 상세정보 가져오기 
  consultationDetail : null,
  getConsultationDetail : async (counselingId: number) => {
    try {
      const response = await getConsultationDetail(counselingId);
      console.log("useYouthConsultationStore - getConsultationDetail response : ", response);
      set({ consultationDetail : response });
    } catch (error) {
      console.error("getConsultationDetail error : ", error);
    }
  },

  // [consultationManagement/[counselingId]/edit] 특정 상담 일지 AI 코멘트 호출 
  getConsultationComment : async (file: File, counselingLogId: number) => {
    try {
      const response = await getConsultationComment(file, counselingLogId);
      console.log("useYouthConsultationStore - getConsultationComment response : ", response);
      return response;
    } catch (error) {
      console.error("getConsultationComment error : ", error);
      throw new Error("getConsultationComment error 발생했습니다.");
    }
  },

  // [consultationManagement/[counselingId]/edit] 특정 상담 일지 AI 코멘트 수정 
  updateConsultationComment : async (counselingId: number, summary: string, client: string, counselor: string, memos: string) => {
    try {
      const response = await updateConsultationComment(counselingId, summary, client, counselor, memos);
      console.log("useYouthConsultationStore - updateConsultationComment response : ", response);
      return response;
    } catch (error) {
      console.error("updateConsultationComment error : ", error);
      throw new Error("updateConsultationComment error 발생했습니다.");
    }
  }, 

  // [YouthManagement] 누적 상담현황 조회 
  cumulativeConsultationStatus : [],
  getCumulativeConsultationStatus : async () => {
    try {
      const response = await getCumulativeConsultationStatus();
      console.log("useYouthConsultationStore - getCumulativeConsultationStatus response : ", response.result);
      set({ cumulativeConsultationStatus : response.result });
    } catch (error) {
      console.error("getCumulativeConsultationStatus error : ", error);
    }
  }

}));  



