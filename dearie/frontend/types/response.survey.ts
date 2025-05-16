export interface YouthSurveyQuestionDTO {
  questions: QuestionDTO[];
  agreements: AgreementDTO[];
}

export interface QuestionDTO {
  questionId: number;
  code: string;
  description: string;
  options: OptionDTO[];
}

export interface OptionDTO {
  optionId: number;
  optionText: string;
}

export interface AgreementDTO {
  agreementId: number;
  title: string;
  purpose: string;
  items: string;
  retentionPeriod: string;
  isRequired: boolean;
}

export interface PostSurveyAnswerResponse {
  id: number;
  createdAt: Date;
  surveyResult: string;
  totalScore: number;
}
