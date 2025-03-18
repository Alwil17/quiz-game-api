import { Category, Quiz } from "../db/schema";

export interface CreateQuizDto extends Omit<Quiz, "id" | "createdAt"> {
  password: string;
}

export type QuizSearchDTO = Partial<Quiz>;
export interface OQuiz extends Partial<Quiz> {
  category: Category;
}

export type UpdateQuizDto = Partial<CreateQuizDto>;
