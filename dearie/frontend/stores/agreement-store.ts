"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AgreementDTO } from "@/types/response.survey";

interface AgreementStore {
  agreements: AgreementDTO[];
  setAgreements: (agreements: AgreementDTO[]) => void;

  surveyId: number | null;
  setSurveyId: (id: number) => void;

  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useAgreementStore = create<AgreementStore>()(
  persist(
    (set) => ({
      agreements: [],
      setAgreements: (agreements) => set({ agreements }),

      surveyId: null,
      setSurveyId: (id) => set({ surveyId: id }),

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "agreement-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
