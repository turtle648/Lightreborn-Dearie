import { create } from "zustand";

interface PromotionNetwork {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
} 

interface PromotionNetworkStore {
  promotionNetwork: PromotionNetwork[];
}

export const usePromotionNetworkStore = create<PromotionNetworkStore>((set) => ({
  promotionNetwork: [],
}));    
