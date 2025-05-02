import { create } from "zustand";

interface WelfareCenter {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
}   

interface WelfareCenterStore {
  welfareCenter: WelfareCenter[];
}

export const useWelfareCenterStore = create<WelfareCenterStore>((_set) => ({
  welfareCenter: [],
}));    


