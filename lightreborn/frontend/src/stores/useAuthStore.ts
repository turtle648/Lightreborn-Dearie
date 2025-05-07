import { create } from "zustand";
import { login, signup, getUserInfo, logout } from "@/apis/users";

interface User {
  id : string 
  role : string // 0: 관리자 , 1: 상담사 (?)
}

interface AuthStore {
  // isLoading: boolean // 필요할까 ? 일단 뺌
  isLoggedIn: boolean;
  isAuthenticated : boolean
  user: User | null;
  login: (data: { id: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: { id: string; password: string; role: number }) => Promise<void>;
  getUserInfo: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  isAuthenticated : false, 
  user: null,
  login: async (data) => {
    try {
      const response = await login(data);
      set({ isLoggedIn: true, user: response.result, isAuthenticated: true });
    } catch (error) {
      console.log("useAuthStore.login error : ", error);
    }
  },
  logout: async () => {
    try {
      await logout();
      set({ isLoggedIn: false, user: null, isAuthenticated: false });
    } catch (error) {
      console.log("useAuthStore.logout error : ", error);
    }
  }, 
  signup: async (data) => {
    try {
      const response = await signup(data);
      set({ isLoggedIn: true, user: response.user });
    } catch (error) {
      console.log("useAuthStore.signup error : ", error);
    }
  },
  getUserInfo: async () => {
    try {
      const response = await getUserInfo();
      set({ user: response.user });
    } catch (error) {
      console.log("useAuthStore.getUserInfo error : ", error);
    }
  },
}));

export default useAuthStore;  

