import { api } from "./index";

// 협력기관 위치 대시보드 통합 데이터 
export const getWelfareCenterDashboardData = async () => {
  try {
    const response = await api.get("/welfare-centers/summary");
    console.log("welfareCenterApi - getWelfareCenterDashboardData response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getWelfareCenterDashboardData error : ", error);
    throw new Error("getWelfareCenterDashboardData error 발생했습니다.");
  }
};

// 협력기관 위치 현황 
export const getWelfareCenterDashboardDataByDistrict = async () => {
  const response = await api.get("/welfare-centers");
  return response.data;
};

// 행정동별 청년 인구 대비 협력기관 비율 
export const getWelfareCenterDashboardDataByDistrictRatio = async () => {
  const response = await api.get("/welfare-centers/youth-ratio");
  return response.data;
};

// 특정 행정동의 협력기관 상세 현황 
export const getWelfareCenterDashboardDataByDistrictDetail = async (data : {dongCode : number}) => {
  const response = await api.get(`/welfare-centers/${data.dongCode}/details`);
  return response.data;
};

// 전체 협력기관의 전체정보 
export const getWelfareCenterDashboardDataByAll = async () => {
  const response = await api.get("/welfare-centers/files");
  return response.data;
};

// 협력기관 대시보드 데이터 추가 
export const addWelfareCenterDashboardData = async (data : {file : Blob, filename : string}) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("filename", data.filename);
  const response = await api.post("/welfare-centers/data", formData);
  return response.data;
};

// 전체 협력기관 엑셀 다운로드 
export const downloadWelfareCenterExcel = async () => {
  try { 
    const response = await api.get("/welfare-centers/files", {
      responseType : "blob" // 바이너리 데이터를 blob형식으로 받기 위한
    });
    return response.data;
  } catch (error) {
    console.error("downloadWelfareCenterExcel error : ", error);
    throw new Error("downloadWelfareCenterExcel error 발생했습니다.");
  }
};
