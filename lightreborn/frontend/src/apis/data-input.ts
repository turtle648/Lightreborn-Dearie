import { api } from "./index";

// 조회 API 는 다른 곳에서 사용할 수 있게 제외
// 해당 파일에서는 data-input 에 대한 데이터 수정 API 만 정의
 
// export const getYouthPopulationData = async () => {
//   const response = await api.get("/data-input/youth-population");
//   return response.data;
// };

// export const getPromotionNetworkData = async () => {
//   const response = await api.get("/data-input/promotion-network");
//   return response.data;
// };

// export const getWelfareCenterData = async () => {
//   const response = await api.get("/data-input/welfare-center");
//   return response.data;
// };

export const updateYouthPopulationData = async (file : File) => {
  const formData = new FormData(); // FormData 객체 생성
  formData.append("file", file); // 파일 추가
  const response = await api.post("/data-input/youth-population", formData);
  return response.data;
};

export const updatePromotionNetworkData = async (file : File) => {
  const formData = new FormData(); // FormData 객체 생성
  formData.append("file", file); // 파일 추가
  const response = await api.post("/data-input/promotion-network", formData);
  return response.data;
};

export const updateWelfareCenterData = async (file : File) => {
  const formData = new FormData(); // FormData 객체 생성    
  formData.append("file", file); // 파일 추가
  const response = await api.post("/data-input/welfare-center", formData);
  return response.data;
};
