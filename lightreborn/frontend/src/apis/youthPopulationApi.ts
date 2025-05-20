import { api } from "./index";

// 청년 인구 통합 데이터 조회 
export const getYouthPopulation = async () => {
  try {
    const response = await api.get("/youth-populations");
    console.log("getYouthPopulation response : ", response.data.result.ratioByAdministrativeDistrict.regionData);
    return response;
  } catch (error) {
    console.error("getYouthPopulation error : ", error);
    throw new Error("getYouthPopulation error 발생했습니다.");
  }
};

// // 청년 인구 분포 비율 - 청년 인구 통합 데이터 조회와 같은  
// export const getYouthPopulationDistribution = async () => {
//   try {
//     const response = await api.get("/youth-populations/distribution");
//     return response.data;
//   } catch (error) {
//     console.error("getYouthPopulationDistribution error : ", error);
//     throw new Error("getYouthPopulationDistribution error 발생했습니다.");
//   }
// };

// 행정동 내 인구 분포 비율 
export const getYouthPopulationDistributionByDistrict = async (data : {dongCode : number}) => {
  try {
    const response = await api.get(`/youth-populations/distribution/${data.dongCode}`);
    console.log("getYouthPopulationDistributionByDistrict response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getYouthPopulationDistributionByDistrict error : ", error);
    throw new Error("getYouthPopulationDistributionByDistrict error 발생했습니다.");
  }
};

// 행정동 내 청년 1인 가구 비율 
export const getYouthPopulationDistributionRatioByDistrict = async (data : {dongCode : number}) => {
  try {
    const response = await api.get(`/youth-populations/single-household-ratio/${data.dongCode}`);
    console.log("getYouthPopulationDistributionRatioByDistrict response : ", response.data);
    return response.data;
  } catch (error) {
    console.error("getYouthPopulationDistributionRatioByDistrict error : ", error);
    throw new Error("getYouthPopulationDistributionRatioByDistrict error 발생했습니다.");
  }
};

// 청년 인구 대시보드 데이터 추가 
export const addYouthPopulationDashboardData = async (data: { file: Blob, filename: string }) => {
  try {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("filename", data.filename);

    const response = await api.post("/youth-populations/data", formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("addYouthPopulationDashboardData error : ", error);
    throw new Error("addYouthPopulationDashboardData error 발생했습니다.");
  }
};
