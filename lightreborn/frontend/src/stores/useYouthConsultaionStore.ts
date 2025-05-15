import { create } from "zustand";
import { getYouthConsultationPreSupport } from "@/apis/youthConsultationApi";

interface PreSupportYouthConsultation {
  id: string;
  name: string;
  description: string;
}  

interface YouthConsultationStore {
  preSupportYouthConsultation: PreSupportYouthConsultation[];
  getPreSupportYouthConsultation: (page?: number, size?: number, sort?: string) => Promise<void>;
}

export const useYouthConsultationStore = create<YouthConsultationStore>((set) => ({
  preSupportYouthConsultation: [],
  getPreSupportYouthConsultation: async (page = 0, size = 7, sort = "personalInfo.name.ASC") => {
    try {
      const response = await getYouthConsultationPreSupport(page, size, sort);
      console.log("response : ", response);
      set({ preSupportYouthConsultation: response.data });
    } catch (error) {
      console.error("useYouthConsultationStore.getPreSupportYouthConsultation error : ", error);
    }
  },


}));  



