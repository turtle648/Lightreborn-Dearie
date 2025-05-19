export interface PostSurveyAnswer {
  questionId: number;
  optionId: number | null;
  answerText: string;
}

export interface PostSurveyRequestDTO {
  answers: PostSurveyAnswer[];
}

export interface PostSurveyWithOutSignUp {
  personalInfo: UserInfo;
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

export interface UserInfo {
  name: string;
  gender: string;
  birthDate: string;
  age: number;
  phoneNumber: string;
  emergencyContact: string;
}
