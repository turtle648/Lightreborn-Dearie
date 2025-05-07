import { create } from "zustand";

interface MapStore {
  // 행정동 코드를 저장합니다 (예: "4833025300")
  selectedDongCode: string | null;
  setSelectedDongCode: (dongCode: string | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedDongCode: null,
  setSelectedDongCode: (dongCode) => set({ selectedDongCode: dongCode }),
}));

