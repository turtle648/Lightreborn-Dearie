import { api } from "./index";

// 조회 API 는 다른 곳에서 사용할 수 있게 제외
// 해당 파일에서는 data-input 에 대한 데이터 수정 API 만 정의
 
// 청년인구 파일 업로드 
export const updateYouthPopulationData = async (file : File) => {
  const formData = new FormData(); // FormData 객체 생성
  formData.append("file", file); // 파일 추가
  const response = await api.post("/youth-populations/data", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 청년 인구 최신 정보 조회
export const getYouthPopulationData = async () => {
  const response = await api.get("/youth-populations/youthPopulationLatestData");
  return response.data;
};

// 홍보 네트워크 파일 업로드 
export const updatePromotionNetworkData = async (file : File) => {
  const formData = new FormData(); // FormData 객체 생성
  formData.append("file", file); // 파일 추가
  const response = await api.post("/promotion-networks/data", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 홍보 네트워크 최신 정보 조회
export const getPromotionNetworkData = async () => {
  const response = await api.get("/promotion-networks/promotion-latest-data");
  return response.data;
};

// 복지센터 파일 업로드 
export const updateWelfareCenterData = async (file : File) => {
  const formData = new FormData(); // FormData 객체 생성    
  formData.append("file", file); // 파일 추가
  const response = await api.post("/welfare-centers/data", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 복지센터 최신 정보 조회
export const getWelfareCenterData = async () => {
  const response = await api.get("/welfare-centers/welfareCenterLatestData");
  return response.data;
};


