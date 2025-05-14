import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { login, signup, getUserInfo, logout } from "@/apis/users";

interface User {
  id: string;
  role: string;
}

interface AuthStore {
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  user: User | null;
  isHydrated: boolean; // 하이드레이션 상태 추적
  setHydrated: (state: boolean) => void;
  login: (data: { id: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: { id: string; password: string; role: number; name: string }) => Promise<void>;
  getUserInfo: () => Promise<User | void>;
}

// Next.js SSR과 호환되는 Storage 생성
const zustandStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      isAuthenticated: false,
      user: null,
      isHydrated: false,
      setHydrated: (state) => set({ isHydrated: state }),
      login: async (data) => {
        try {
          const response = await login(data);
          console.log("로그인 응답:", response);
          set({ isLoggedIn: true, user: response.result, isAuthenticated: true });
        } catch (error) {
          console.log("useAuthStore.login error : ", error);
          throw error;
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
          set({ isLoggedIn: true, user: response.user, isAuthenticated: true });
        } catch (error) {
          console.log("useAuthStore.signup error : ", error);
        }
      },
      getUserInfo: async () => {
        try {
          const response = await getUserInfo();
          console.log("사용자 정보 요청 응답:", response);
          
          // 응답 구조 확인 및 사용자 정보 설정
          const userData = response.result || response.user || response;
          
          if (userData && (userData.id || userData.userId)) {
            // 사용자 데이터 구조에 따라 적절히 설정
            const userInfo = {
              id: userData.id || userData.userId,
              role: userData.role || userData.userRole || 'user'
            };
            
            set({ 
              user: userInfo, 
              isLoggedIn: true, 
              isAuthenticated: true 
            });
            
            console.log("사용자 정보 설정 완료:", userInfo);
            return userInfo;
          } else {
            console.error("유효한 사용자 정보가 없습니다:", response);
            throw new Error("유효한 사용자 정보가 없습니다");
          }
        } catch (error) {
          console.log("useAuthStore.getUserInfo error : ", error);
          // 사용자 정보 요청 실패 시 상태 초기화
          set({ user: null, isLoggedIn: false, isAuthenticated: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          
          // 재수화 후 토큰이 있으면 사용자 정보 가져오기 시도
          if (state.isLoggedIn && state.isAuthenticated && !state.user) {
            state.getUserInfo().catch((error) => {
              console.error("Failed to get user info during rehydration:", error);
              // 에러 발생 시 처리 - 여기서는 set을 직접 사용할 수 없음
              // 대신 useAuthStore.setState를 사용
              useAuthStore.setState({ 
                isLoggedIn: false, 
                isAuthenticated: false, 
                user: null 
              });
            });
          }
        }
      },
    }
  )
);

// 하이드레이션 상태 확인을 위한 훅
export const useHydration = () => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  return isHydrated;
};

export default useAuthStore;