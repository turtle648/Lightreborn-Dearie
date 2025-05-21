import { api } from "./index";

// 각 행정동의 청년인구당 홍보물 비율 
export const getPromotionNetworkDashboardData = async () => {
  const response = await api.get("/promotion-networks");
  return response.data;
};

// [BarChart] 행정동의 홍보물 유형 비율 
export const getPromotionNetworkDashboardDataByType = async (data : {dongCode : number}) => {
  try {
    const response = await api.get(`/promotion-networks/${data.dongCode}/ratio`);
    console.log("getPromotionNetworkDashboardDataByType response : ", response);
    return response.data;
  } catch (error) {
    console.error("getPromotionNetworkDashboardDataByType error : ", error);
    throw new Error("getPromotionNetworkDashboardDataByType error 발생했습니다.");
  }
};

// [Sheet] 특정 행정동의 홍보물 리스트 조회 
export const getPromotionNetworkDashboardDataByDistrict = async (data : {dongCode : number}) => {
  try {
    const response = await api.get(`/promotion-networks/${data.dongCode}/details`);
    console.log("getPromotionNetworkDashboardDataByDistrict response : ", response);
    return response.data;
  } catch (error) {
    console.error("getPromotionNetworkDashboardDataByDistrict error : ", error);
    throw new Error("getPromotionNetworkDashboardDataByDistrict error 발생했습니다.");
  }
};

// [Sheet] 행정동의 홍보물 상세정보 리스트 다운로드 
export const getPromotionNetworkDashboardDataByDistrictDetail = async (data : {dongCode : number}) => {
  try {
    const response = await api.get(`/promotion-networks/${data.dongCode}/file`);
    return response.data; // 파일 타입 response 가 나올 텐데 ? 
  } catch (error) {
    console.error("getPromotionNetworkDashboardDataByDistrictDetail error : ", error);
    throw new Error("getPromotionNetworkDashboardDataByDistrictDetail error 발생했습니다.");
  }
};

// 홍보물 네트워크 페이지 데이터 통합 조회 

// 행정동의 홍보물 비치장소 비율 (??) 

// 홍보물 대시보드 데이터 추가 
export const addPromotionNetworkDashboardData = async (data : {file : Blob, filename : string}) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("filename", data.filename);
  const response = await api.post("/promotion-networks/data", formData);
  return response.data;
};

// 홍보물 최신 정보 조회 
export const getPromotionNetworkLatestData = async () => {
  try {
    const response = await api.get("/promotion-networks/promotion-latest-data");
    return response.data;
  } catch (error) {
    console.error("getPromotionNetworkLatestData error : ", error);
    throw new Error("getPromotionNetworkLatestData error 발생했습니다.");
  }
};




