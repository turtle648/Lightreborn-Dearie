import { api } from "./index";

// 청년 인구 통합 데이터 조회 
export const getYouthPopulation = async () => {
  const response = await api.get("api/dashboard/youth-populations");
  return response.data;
};

// 청년 인구 분포 비율 
export const getYouthPopulationDistribution = async () => {
  const response = await api.get("/api/dashboard/youth-populations/distribution");
  return response.data;
};

// 행정동 내 인구 분포 비율 
export const getYouthPopulationDistributionByDistrict = async (data : {dongCode : number}) => {
  const response = await api.get(`/api/dashboard/youth-populations/distribution/${data.dongCode}`);
  return response.data;
};

// 행정동 내 청년 1인 가구 비율 
export const getYouthPopulationDistributionRatioByDistrict = async (data : {dongCode : number}) => {
  const response = await api.get(`/api/dashboard/youth-populations/single-household-ratio/${data.dongCode}`);
  return response.data;
};

// 청년 인구 대시보드 데이터 추가 
export const addYouthPopulationDashboardData = async (data: { file: Blob, filename: string }) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("filename", data.filename);

  const response = await api.post("/api/dashboard/youth-populations/data", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
