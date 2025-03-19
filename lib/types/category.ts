import { Category } from "../db/schema";

export interface CreateCategoryDto extends Omit<Category, "id" | "createdAt"> {
  password: string;
}

export type CategorySearchDTO = Partial<Category>;

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
