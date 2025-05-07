import { api } from "./index";

// 협력기관 위치 대시보드 통합 데이터 
export const getWelfareCenterDashboardData = async () => {
  const response = await api.get("/api/dashboard/welfare-centers/summary");
  return response.data;
};

// 협력기관 위치 현황 
export const getWelfareCenterDashboardDataByDistrict = async () => {
  const response = await api.get("/api/dashboard/welfare-centers");
  return response.data;
};

// 행정동별 청년 인구 대비 협력기관 비율 
export const getWelfareCenterDashboardDataByDistrictRatio = async () => {
  const response = await api.get("/api/dashboard/welfare-centers/youth-ratio");
  return response.data;
};

// 특정 행정동의 협력기관 상세 현황 
export const getWelfareCenterDashboardDataByDistrictDetail = async (data : {dongCode : number}) => {
  const response = await api.get(`/api/dashboard/welfare-centers/${data.dongCode}/details`);
  return response.data;
};

// 전체 협력기관의 전체정보 
export const getWelfareCenterDashboardDataByAll = async () => {
  const response = await api.get("/api/dashboard/welfare-centers/files");
  return response.data;
};

// 협력기관 대시보드 데이터 추가 
export const addWelfareCenterDashboardData = async (data : {file : Blob, filename : string}) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("filename", data.filename);
  const response = await api.post("/api/dashboard/welfare-centers/data", formData);
  return response.data;
};

