export enum AppState {
  HOME = 'HOME',
  SETUP_MODE_1 = 'SETUP_MODE_1',
  SETUP_MODE_2 = 'SETUP_MODE_2',
  LOADING_QUIZ = 'LOADING_QUIZ',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}

export type PracticeType = 'MCQ' | 'TRUE_FALSE' | 'SCENARIO';
export type PracticeFocus = 'CONCEPTS' | 'DIAGRAMS' | 'CALCULATIONS' | 'APPLICATIONS' | 'MISCONCEPTIONS';

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TRUE_FALSE'
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  topic?: string;
}

export interface Quiz {
  title: string;
  description: string;
  questions: Question[];
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  answers: {
    questionId: number;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
}

export interface UserAnswer {
  questionId: number;
  selectedOptionIndex: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}