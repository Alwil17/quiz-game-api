import { Category, Quiz } from "../db/schema";

export type CreateQuizDto = Omit<Quiz, "id" | "createdAt">

export type QuizSearchDTO = Partial<Quiz>;
export interface OQuiz extends Partial<Quiz> {
  category: Category;
}

export type UpdateQuizDto = Partial<CreateQuizDto>;
