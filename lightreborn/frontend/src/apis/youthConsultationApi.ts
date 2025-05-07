import { api } from "./index";

// 은둔고립 청년 상담 현황 
export const getYouthConsultationStatus = async () => {
  const response = await api.get("/api/dashboard/youth-consultation");
  return response.data;
};

// 월별 상담 건수 
export const getYouthConsultationMonthly = async () => {
  const response = await api.get("/api/dashboard/youth-consultation/monthly-count");
  return response.data;
};

// 은둔고립 청년 상담 리스트 
export const getYouthConsultationList = async () => {
  const response = await api.get("/api/dashboard/youth-consultation/files");
  return response.data;
};

// 은둔고립 청년 상담 일지 데이터 추가 
export const addYouthConsultationData = async (data : {file : Blob, filename : string}) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("filename", data.filename);
  const response = await api.post("/api/dashboard/youth-consultation/data", formData);
  return response.data;
};

// 은둔고립 청년 설문 데이터 추가 
export const addYouthConsultationSurveyData = async (data: {
  isolatedYouth: {
    name: string;
    sex: string;
    age: number;
    isolationLevel: string;
    economicLevel: string;
    economicActivityRecent: string;
    isolatedScore: number;
    processStep: string;
  };
  counselingLog: {
    welfareCenterAddress: string;
    consultationDate: string; // ISO 8601 형식의 날짜 문자열
    hangjungdongId: number;
  };
  surveyPersonalInfo: {
    name: string;
    phoneNumber: string;
    birthDate: string; // ISO 8601 형식의 날짜 문자열
    emergencyContact: string;
  };
  surveyAnswers: {
    surveyQuestionId: number;
    answerText: string | null;
    answerChoice: number | null;
  }[];
  file: Blob; // 파일 추가
  filename: string; // 파일 이름 추가
}) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data)); // JSON 문자열로 변환하여 추가
  formData.append("file", data.file);
  formData.append("filename", data.filename);

  const response = await api.post("/api/dashboard/youth-consultation/isolated-youth", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const surveyData = {
  isolatedYouth: {
    name: "홍길동",
    sex: "M",
    age: 24,
    isolationLevel: "고립",
    economicLevel: "저소득",
    economicActivityRecent: "N",
    isolatedScore: 85,
    processStep: "등록대기",
  },
  counselingLog: {
    welfareCenterAddress: "서울특별시 강남구 복지센터",
    consultationDate: "2025-04-30T10:00:00",
    hangjungdongId: 12345,
  },
  surveyPersonalInfo: {
    name: "홍길동",
    phoneNumber: "010-1234-5678",
    birthDate: "2000-01-01",
    emergencyContact: "010-9876-5432",
  },
  surveyAnswers: [
    {
      surveyQuestionId: 1,
      answerText: "혼자 지내는 것을 좋아합니다.",
      answerChoice: null,
    },
    {
      surveyQuestionId: 2,
      answerText: null,
      answerChoice: 3,
    },
    // 추가 답변들
  ],
  file: new Blob(), // 실제 파일 Blob 객체를 여기에 넣어야 합니다.
  filename: "survey_data.xlsx", // 파일 이름
};

addYouthConsultationSurveyData(surveyData)
  .then(response => {
    console.log("응답 데이터:", response);
  })
  .catch(error => {
    console.error("오류 발생:", error);
  });



