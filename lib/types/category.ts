import { Category } from "../db/schema";

export type CreateCategoryDto = Omit<Category, "id" | "createdAt">

export type CategorySearchDTO = Partial<Category>;

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
