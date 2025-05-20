import { getPromotionNetworkData, getWelfareCenterData, getYouthPopulationData, updatePromotionNetworkData, updateWelfareCenterData, updateYouthPopulationData } from "@/apis/data-input";
import { create } from "zustand";

interface YouthPopulationData {
  id: number;
  dongCode: number;
  dongName: string;
  youthAll: number;
  youthMale: number;
  youthFemale: number;
  youthAloneAll: number;
  youthAloneMale: number;
  youthAloneFemale: number;
  }

interface PromotionNetworkData {
  id: number;
  dongName: string;
  promotionType: string;
  promotionPlaceType: string;
  promotionPlace: string;
  promotionContent: string;
  promotionStatus: string;
  latitude: number;
  longitude: number;
}

interface WelfareCenterData {
  id: number;
  dongName: string;
  welfareCenterType: string;
  welfareCenterName: string;
  welfareCenterPhone: string;
  welfareCenterAddress: string;
}

interface DataStore {
  youthPopulationData : YouthPopulationData[];
  getYouthPopulationData : () => Promise<void>;
  updateYouthPopulationData : (file: File) => Promise<void>;
  promotionNetworkData : PromotionNetworkData[];
  getPromotionNetworkData : () => Promise<void>;
  updatePromotionNetworkData : (file: File) => Promise<void>;
  welfareCenterData : WelfareCenterData[];
  getWelfareCenterData : () => Promise<void>;
  updateWelfareCenterData : (file: File) => Promise<void>;
}


export const useDataStore = create<DataStore>((set) => ({
// export const useDataStore = create<DataStore>((set) => ({

  youthPopulationData : [
    {id: 1, dongCode: 48330250, dongName: "중앙동", youthAll: 4238,  youthMale: 1475, youthFemale: 2763, youthAloneAll: 355, youthAloneMale: 204, youthAloneFemale: 151, updatedAt: "2025-05-01"},  
  ],

  getYouthPopulationData : async () => {
    // 도원 - API 
    try {
      const response = await getYouthPopulationData();
      console.log("useDataStore.getYouthPopulationData response : ", response.result);
      set({ youthPopulationData: response.result });
    } catch (error) {
      console.error("getYouthPopulationData error : ", error);
      throw new Error("getYouthPopulationData error 발생했습니다.");
    }
  },

  updateYouthPopulationData : async (file: File) => {
    try {
      const response = await updateYouthPopulationData(file);
      set((state) => ({ youthPopulationData: [...state.youthPopulationData, ...response.data] }));
      console.log("useDataStore.updateYouthPopulationData response : ", response.data);
    } catch (error) {
      console.error("useDataStore.updateYouthPopulationData error : ", error);
      throw new Error("useDataStore.updateYouthPopulationData error 발생했습니다.");
    }
  },

  promotionNetworkData : [
    {id: 1, address: "경상남도 양산시 중앙동로 90", latitude: 35.344254, longitude: 129.024555, promotionStatus: "X", promotionPlaceType: "pc방", dongCode: 48330250, dongName: "중앙동", promotionPlace: "월드PC", promotionType: "포스터", promotionContent: "은둔청년을 위한 상담 지원 프로그램 안내"},
  ],

  getPromotionNetworkData : async () => {
    try {
      const response = await getPromotionNetworkData();
      console.log("useDataStore.getPromotionNetworkData response : ", response.result);
      set({ promotionNetworkData: response.result });
    } catch (error) {
      console.error("getPromotionNetworkData error : ", error);
      throw new Error("getPromotionNetworkData error 발생했습니다.");
    }
  },  

  updatePromotionNetworkData : async (file: File) => {
    try {
      const response = await updatePromotionNetworkData(file);
      set((state) => ({ promotionNetworkData: [...state.promotionNetworkData, ...response.data] }));
      console.log("useDataStore.updatePromotionNetworkData response : ", response.data);
    } catch (error) {
      console.error("useDataStore.updatePromotionNetworkData error : ", error);
      throw new Error("useDataStore.updatePromotionNetworkData error 발생했습니다.");
    }
  },

  welfareCenterData : [
    {id: 1, dongCode: 48330130, dongName: "원동면", welfareCenterType: "장애인거주시설", welfareCenterName: "원동면 행정복지센터", welfareCenterPhone: "055-380-5555", welfareCenterAddress: "경상남도 양산시 원동면로 100"},
  ],

  getWelfareCenterData : async () => {
    try {
      const response = await getWelfareCenterData();
      console.log("useDataStore.getWelfareCenterData response : ", response.result);
      set({ welfareCenterData: response.result });
    } catch (error) {
      console.error("getWelfareCenterData error : ", error);
      throw new Error("getWelfareCenterData error 발생했습니다.");
    }
  },

  updateWelfareCenterData : async (file: File) => {
    try {
      const response = await updateWelfareCenterData(file);
      set((state) => ({ welfareCenterData: [...state.welfareCenterData, ...response.data] }));
      console.log("useDataStore.updateWelfareCenterData response : ", response.data);
    } catch (error) {
      console.error("useDataStore.updateWelfareCenterData error : ", error);
      throw new Error("useDataStore.updateWelfareCenterData error 발생했습니다.");
    }
  },

}));

export default useDataStore;

