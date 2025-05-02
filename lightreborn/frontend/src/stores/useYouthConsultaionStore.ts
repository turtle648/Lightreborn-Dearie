import { create } from "zustand";

interface YouthConsultation {
  id: string;
  name: string;
  description: string;
}  

interface YouthConsultationStore {
  youthConsultation: YouthConsultation[];
}

export const useYouthConsultationStore = create<YouthConsultationStore>((_set) => ({
  youthConsultation: [],
}));  



