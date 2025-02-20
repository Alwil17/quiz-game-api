import { Quiz } from "../db/schema";

export interface CreateQuizDto extends Omit<Quiz, "id" | "createdAt"> {
  password: string;
}

export type QuizSearchDTO = Partial<Quiz>;

export type UpdateQuizDto = Partial<CreateQuizDto>;
