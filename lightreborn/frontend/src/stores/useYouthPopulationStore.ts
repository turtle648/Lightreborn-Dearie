import { create } from "zustand";
import { getYouthPopulation, getYouthPopulationDistributionByDistrict, getYouthPopulationDistributionRatioByDistrict } from "@/apis/youthPopulationApi";

interface YouthPopulation {
  id: number;
  region: string;
  perPopulation: number;
}

interface YouthPopulationStore {
  youthPopulation: YouthPopulation[];
  getYouthPopulation: () => Promise<void>;
  youthRatio: number;
  getYouthRatio: (dongCode: string | null) => Promise<void>;
  youthGenderRatio: {male: number, female: number};
  getYouthGenderRatio: (dongCode: string | null) => Promise<void>;
  youthAloneHouseholdRatio: number;
  getYouthAloneHouseholdRatio: (dongCode: string | null) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useYouthPopulationStore = create<YouthPopulationStore>((set) => ({
  // 양산시 행정동별 전체 주민 중 청년 비율
  youthPopulation: [],
  youthRatio: 0, // 행정동별 청년 인구 비율 
  youthGenderRatio: {male: 0, female: 0}, // 행정동별 청년 성비 
  youthAloneHouseholdRatio: 0, // 행정동별 청년 1인 가구 비율 
  isLoading: false,
  error: null,
  
  getYouthPopulation: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getYouthPopulation();
      console.log("response.data : ", response.data);
      
      if (response?.data?.result?.ratioByAdministrativeDistrict?.regionData) {
        set({ 
          youthPopulation: response.data.result.ratioByAdministrativeDistrict.regionData,
          isLoading: false
        });
      } else {
        set({
          error: "데이터 형식이 올바르지 않습니다",
          isLoading: false
        });
      }
    } catch (error) {
      console.error("getYouthPopulation error : ", error);
      set({
        error: "청년 인구 데이터를 가져오는데 실패했습니다",
        isLoading: false
      });
    }
  },

  // 행정구역별 청년 인구 비율 조회 
  getYouthRatio: async (dongCode: string | null) => {
    // 코드가 0이거나 없으면 early return
    if (!dongCode) {
      console.error("유효하지 않은 행정동 코드입니다.");
      set({ error: "유효하지 않은 행정동 코드입니다" });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      const response = await getYouthPopulationDistributionByDistrict({ dongCode: Number(dongCode) });
      console.log("getYouthRatio response.data : ", response);
      
      // 옵셔널 체이닝 사용하여 안전하게 데이터 접근
      const ratio = response?.result?.youthPopulationRatio?.value
      
      if (ratio !== undefined) {
        set({ youthRatio: ratio, isLoading: false });
      } else {
        set({ 
          error: "청년 인구 비율 데이터를 찾을 수 없습니다",
          isLoading: false
        });
      }
    } catch (error) {
      console.error("getYouthRatio error : ", error);
      set({ 
        error: "청년 인구 비율 데이터를 가져오는데 실패했습니다",
        isLoading: false
      });
    }
  }, 

  // 행정구역별 청년 성비 조회 
  getYouthGenderRatio: async (dongCode: string | null) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getYouthPopulationDistributionRatioByDistrict({ dongCode: Number(dongCode) });
      console.log("getYouthGenderRatio response.data : ", response);
      
      const maleNum = response?.result?.youthSingleHouseholdRatio.male
      const femaleNum = response?.result?.youthSingleHouseholdRatio.female
      if (maleNum !== undefined && femaleNum !== undefined) {
        set({ youthGenderRatio: {male: maleNum, female: femaleNum}, isLoading: false });
      } else {
        set({ error: "청년 성비 데이터를 찾을 수 없습니다", isLoading: false });
      }
    } catch (error) {
      console.error("getYouthGenderRatio error : ", error);
      set({ error: "청년 성비 데이터를 가져오는데 실패했습니다", isLoading: false });
    }
  },

  // 행정구역별 청년 1인 가구 비율 조회 
  getYouthAloneHouseholdRatio: async (dongCode: string | null) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getYouthPopulationDistributionRatioByDistrict({ dongCode: Number(dongCode) });
      console.log("getYouthAloneHouseholdRatio response.data : ", response);
      
      const ratio = response?.result?.youthSingleHouseholdRatio?.value
      if (ratio !== undefined) {
        set({ youthAloneHouseholdRatio: ratio, isLoading: false });
      } else {
        set({ error: "청년 1인 가구 비율 데이터를 찾을 수 없습니다", isLoading: false });
      }
    } catch (error) {
      console.error("getYouthAloneHouseholdRatio error : ", error);
      set({ error: "청년 1인 가구 비율 데이터를 가져오는데 실패했습니다", isLoading: false });
    }
  }
}));