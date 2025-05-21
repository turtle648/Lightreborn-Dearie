import { getPromotionNetworkDashboardDataByDistrict, getPromotionNetworkLatestData } from "@/apis/promotionNetworkApi";
import { getPromotionNetworkDashboardDataByType } from "@/apis/promotionNetworkApi";
import { create } from "zustand";

interface PromotionNetwork {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
} 

interface PromotionNetworkLatestData {
  id: string;
  address: string;
  latitude: number;
  longitude: number;  
  statusChangedAt: string;
  locationType: string;
  dongCode: string;
  dongName: string;
  placeName: string;
  promotionType: string;
  promotionContent: string;
  posted: boolean;
}

interface PromotionNetworkStore {
  promotionNetworkByType: PromotionNetwork[];
  promotionNetworkByDistrict: PromotionNetwork[];
  promotionNetworkLatestData: PromotionNetworkLatestData[];
  getPromotionNetworkDashboardDataByType: (dongCode: number | null) => Promise<void>;
  getPromotionNetworkDashboardDataByDistrict: (dongCode: number | null) => Promise<void>; 
  getPromotionNetworkLatestData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const usePromotionNetworkStore = create<PromotionNetworkStore>((set) => ({
  promotionNetworkByType: [],
  promotionNetworkByDistrict: [],
  isLoading: false,
  error: null,

  getPromotionNetworkDashboardDataByType: async (dongCode: number | null) => {
    // dongCode가 없으면 요청하지 않음
    if (!dongCode) {
      set({ error: "유효한 행정동 코드가 필요합니다" });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await getPromotionNetworkDashboardDataByType({ dongCode });
      console.log("getPromotionNetworkDashboardDataByType response : ", response);
      
      if (response?.data?.result?.promotionPerYouth1000) {
        set({
          promotionNetworkByType: response.data.result.promotionPerYouth1000,
          isLoading: false
        });
      } else {
        set({
          error: "데이터 형식이 올바르지 않습니다",
          isLoading: false
        });
      }
    } catch (error) {
      console.error("getPromotionNetworkDashboardDataByType error : ", error);
      set({
        error: "홍보물 유형별 데이터를 가져오는데 실패했습니다",
        isLoading: false
      });
    }
  },

  getPromotionNetworkDashboardDataByDistrict: async (dongCode: number | null) => {
    // dongCode가 없으면 요청하지 않음
    if (!dongCode) {
      set({ error: "유효한 행정동 코드가 필요합니다" });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      const response = await getPromotionNetworkDashboardDataByDistrict({ dongCode });
      console.log("getPromotionNetworkDashboardDataByDistrict response : ", response?.data);
      
      if (response?.data?.result?.promotionPerYouth1000) {
        set({
          promotionNetworkByDistrict: response.data.result.promotionPerYouth1000,
          isLoading: false
        });
      } else {
        set({
          error: "데이터 형식이 올바르지 않습니다",
          isLoading: false
        });
      }
      return response?.data;
    } catch (error) {
      console.error("getPromotionNetworkDashboardDataByDistrict error : ", error);
      set({
        error: "홍보물 설치 현황을 가져오는데 실패했습니다",
        isLoading: false
      });
    }
  },

  promotionNetworkLatestData: [],

  getPromotionNetworkLatestData: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getPromotionNetworkLatestData();
      console.log("getPromotionNetworkLatestData response : ", response);
      set({
        promotionNetworkLatestData: response.result,
        isLoading: false
      });
    } catch (error) {
      console.error("getPromotionNetworkLatestData error : ", error);
      set({
        error: "홍보물 최신 정보를 가져오는데 실패했습니다",
        isLoading: false
      });
    }
  }

}));