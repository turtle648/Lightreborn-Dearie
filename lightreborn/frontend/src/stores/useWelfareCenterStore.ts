import { downloadWelfareCenterExcel, getWelfareCenterDashboardData } from "@/apis/welfareCenterApi";
import { create } from "zustand";

interface WelfareCenterData {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
}   

interface WelfareCenterLocationData {
  id: number;
  organizationName: string;
  latitude: number;
  longitude: number;
  dongName: string;
  address: string;
}

interface WelfareCenterExportDetailData {
  id: number;
  organizationName: string;
  type : string;
  address : string;
  phoneNumber : string;
}

interface WelfareCenterPer10000Data {
  regionCode : number 
  regionName: string
  regionValue : number 
}

interface WelfareCenterStore {
  welfareCenterData : WelfareCenterData[];
  welfareCenterLocationData : WelfareCenterLocationData[];
  welfareCenterExportDetailData : WelfareCenterExportDetailData[];
  welfareCenterPer10000Data : WelfareCenterPer10000Data[];
  isLoading : boolean;
  error : string | null;
  getWelfareCenterData : () => Promise<void>;
  downloadFile : File | null;
  downloadWelfareCenterExcel : () => Promise<void>;
}

export const useWelfareCenterStore = create<WelfareCenterStore>((set) => ({
  welfareCenterData : [],
  welfareCenterLocationData : [], // Marker  
  welfareCenterExportDetailData : [],  // Sheet 
  welfareCenterPer10000Data : [], // 10000명당 협력기관 수
  isLoading : false,
  error : null,
  downloadFile : null,

  getWelfareCenterData : async () => {
    try {
      set({ isLoading : true, error : null });
      const response = await getWelfareCenterDashboardData();
      console.log("useWelfareCenterStore - getWelfareCenterData response : ", response.result);
      set({ 
        welfareCenterData : response.result.details, 
        welfareCenterLocationData : response.result.locations,
        welfareCenterExportDetailData : response.result.exportDetails,
        welfareCenterPer10000Data: response.result.perRegionStats,
        isLoading : false 
      });
    } catch (error) {
      console.error("getWelfareCenterData error : ", error);
      set({ error : "협력기관 데이터를 가져오는데 실패했습니다.", isLoading : false });
    }
  },

  downloadWelfareCenterExcel : async () => {
    try {
      const response = await downloadWelfareCenterExcel();
      console.log("useWelfareCenterStore - downloadWelfareCenterExcel response : ", response.data);
      set({ downloadFile : response.data });
    } catch (error) {
      console.error("downloadWelfareCenterExcel error : ", error);
    }
  } 
}));    


