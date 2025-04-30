import { api, publicApi } from "./index";

// 로그인 요청 
export const login = async (data : {id : string, password : string}) => {
  const response = await publicApi.post("/login", data);
  return response.data;
};

// 로그아웃 요청 
export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

// 토큰 재발급 요청 
// JWT 토큰은 보안을 위해 짧은 유효 기간(ex.1시간 이내)을 가진다. 
// 엑세스 토큰 만료 시 리프레시 토큰을 사용해 새로운 엑세스 토큰 발급하는 이유는 
// 엑세스 토큰이 만료되면 데이터베이스에서 토큰 정보를 삭제하고 새로운 토큰을 발급하기 위함인데 
// 이렇게 해도 JWT 토큰을 사용해 보안을 높이는 이유는 
// 리프레시 토큰이 탈취되면 엑세스 토큰을 재발급 할 수 없기 때문 
export const refreshToken = async () => {
  const response = await api.post("/refresh-token");
  return response.data;
};  

// 토큰 검증 요청 
// 민감한 작업 수행 전 추가 검증을 해야 하는 이유는 
// 토큰이 유효하지 않거나 만료되었을 때 예외 처리를 할 수 있기 때문 
export const verifyToken = async () => {
  const response = await api.post("/verify-token");
  return response.data;
};

// 토큰 삭제 요청 
export const deleteToken = async () => {
  const response = await api.post("/delete-token");
  return response.data;
};



