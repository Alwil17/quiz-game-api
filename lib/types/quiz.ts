import { Category, Quiz } from "../db/schema";

export type CreateQuizDto = Omit<Quiz, "id" | "createdAt">

export type QuizSearchDTO = Partial<Quiz>;
export interface OQuiz extends Partial<Quiz> {
  category: Category;
}

export type UpdateQuizDto = Partial<CreateQuizDto>;

export interface BulkQuizDto {
  name: string;
  description?: string;
  quizzes: {
    title: string;
    difficulty: "easy" | "medium" | "hard";
    questions: {
      text: string;
      type: "MCQ" | "True/False";
      level: "easy" | "medium" | "hard",
      answers: {
        id: number;
        text: string;
        isCorrect: boolean;
      }[];
    }[];
  }[];
}
