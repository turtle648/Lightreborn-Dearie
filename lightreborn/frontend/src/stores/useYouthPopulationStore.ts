import { create } from "zustand";

interface YouthPopulation {
  id: string;
  name: string;
  description: string;
}  

interface YouthPopulationStore {
  youthPopulation: YouthPopulation[];
}

export const useYouthPopulationStore = create<YouthPopulationStore>(() => ({
  youthPopulation: [],
}));    
