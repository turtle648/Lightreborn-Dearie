export interface PostSurveyAnswer {
  questionId: number;
  optionId: number | null;
  answerText: string;
}

export interface PostSurveyRequestDTO {
  answers: PostSurveyAnswer[];
}

export interface PostAgreementDTO {
  agreementId: number;
  isAgreed: boolean;
}

export interface PostAgreementRequestDTO {
  surveyId: number;
  agreements: PostAgreementDTO[];
}
