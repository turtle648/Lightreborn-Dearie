export interface PostSurveyAnswer {
  questionId: number;
  optionId: number | null;
  answerText: string;
}

export interface PostSurveyRequestDTO {
  answers: PostSurveyAnswer[];
}
