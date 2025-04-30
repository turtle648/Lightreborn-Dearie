import axios from "axios";

// 인증 API 요청 = 쿠키 전송 필요  
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'api/dashboard',
  timeout : 10000, 
  headers : {
    'Content-Type' : 'application/json',
  }, 
  withCredentials : true, // 쿠키 전송 허용  - JWT 토큰 인증 방식에서 사용하는 쿠키 전달 방식 ( vs Bearer 토큰 방식)
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 에러 처리
      if (typeof window !== 'undefined') {
        // 현재 url 저장해서 로그인 후 리다이렉트할 수 있도록 저장 
        const redirectUrl = window.location.pathname;
        window.location.href = `/login?redirect=${redirectUrl}`;
      }
    }
    return Promise.reject(error);
  }
);

// 공공 API 요청  = 쿠키 전송 없이 요청  
export const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'api/dashboard',
  timeout : 10000, 
  headers : {
    'Content-Type' : 'application/json',
  }, 
});
