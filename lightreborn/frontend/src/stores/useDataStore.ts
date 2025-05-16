import { updateYouthPopulationData } from "@/apis/data-input";
import { create } from "zustand";

interface DataStore {
  youthPopulationFile : File | null;
  promotionNetworkFile : File | null;
  welfareCenterFile : File | null;
  setYouthPopulationFile : (file: File) => void;
  setPromotionNetworkFile : (file: File) => void;
  setWelfareCenterFile : (file: File) => void;

}

const useDataStore = create<DataStore>((set) => ({

  youthPopulationFile : null, 
  setYouthPopulationFile : async (file: File) => {
    try {
      const response = await updateYouthPopulationData(file);
      set({ youthPopulationFile: response.data });
    } catch (error) {
      console.error("useDataStore.ts - setYouthPopulationFile Error:", error);
    }
  },

  promotionNetworkFile : null, 
  setPromotionNetworkFile : (file: File) => set({ promotionNetworkFile: file }),

  welfareCenterFile : null, 
  setWelfareCenterFile : (file: File) => set({ welfareCenterFile: file }),

}));

export default useDataStore;

