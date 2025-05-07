import { api, publicApi } from "./index";

// 로그인 
export const login = async (data : {id : string, password : string}) => {
  try {
    const response = await publicApi.post("/auth/login", data);
    return response.data
  } catch (error) { // 에러 처리 
    console.error("users.ts/login error : ", error)
    throw new Error("users.ts/login error 발생했습니다.") // 사용자 메시지 전달용
  }
};

// 로그아웃 
export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// 회원가입 
export const signup = async (data : {id : string, password : string, role: number}) => {
  const response = await publicApi.post("/auth/signup", data);
  return response.data;
};

// 본인 정보 확인
export const getUserInfo = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};



