import {
  PostSurveyAnswerResponse,
  YouthSurveyQuestionDTO,
} from "@/types/response.survey";
import api from "./axiosClient";
import { PostSurveyRequestDTO } from "@/types/request.survey";

export const getSurveyQuestions = (): Promise<YouthSurveyQuestionDTO> => {
  return api.get("/survey/isolated-youth/questions").then((res) => {
    if (res.status === 200) {
      return res.data.result as YouthSurveyQuestionDTO;
    }
    throw new Error(
      "고립 은둔 청년 설문 조사 질문지 가져오는데 실패하였습니다."
    );
  });
};

export const postSurveyAnswer = (
  answer: PostSurveyRequestDTO
): Promise<PostSurveyAnswerResponse> => {
  return api.post("/survey/isolated-youth", answer).then((res) => {
    if (res.status === 200) {
      return res.data.result as PostSurveyAnswerResponse;
    }

    throw new Error(
      "고립 은둔 청년 설문 조사 질문 결과 전송에 문제가 발생하였습니다."
    );
  });
};
