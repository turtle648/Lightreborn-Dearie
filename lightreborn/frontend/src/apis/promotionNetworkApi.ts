import { api } from "./index";

// 홍보 네트워크망 대시보드 통합 데이터 
export const getPromotionNetworkDashboardData = async () => {
  const response = await api.get("/promotion-networks");
  return response.data;
};

// 행정동 별 청년인구 대비 홍보 현황 
export const getPromotionNetworkDashboardDataByDistrict = async (data : {dongCode : number}) => {
  const response = await api.get(`/promotion-networks/${data.dongCode}`);
  return response.data;
};

// 행정동 내 홍보 상세 현황 
export const getPromotionNetworkDashboardDataByDistrictDetail = async (data : {dongCode : number}) => {
  const response = await api.get(`/promotion-networks/${data.dongCode}/details`);
  return response.data;
};

// 홍보물 설치 전체 현황 
export const getPromotionNetworkDashboardDataByXlsx = async () => {
  const response = await api.get("/promotion-networks/files");
  return response.data;
};

// 홍보물 대시보드 데이터 추가 
export const addPromotionNetworkDashboardData = async (data : {file : Blob, filename : string}) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("filename", data.filename);
  const response = await api.post("/promotion-networks/data", formData);
  return response.data;
};




