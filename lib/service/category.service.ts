// category.service.ts

import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { Category, categories, NewCategory } from "../db/schema";

// Récupérer toutes les catégories
export async function getCategories(): Promise<Category[]> {
  try {
    return await db.select().from(categories);
  } catch (error) {
    console.log("ERROR::CategoryService.getCategories", error);
    return [];
  }
}

// Rechercher une catégorie par nom
export async function searchCategoryByName(
  name: string
): Promise<Category | null> {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);
    return category[0];
  } catch (error) {
    console.log("ERROR::CategoryService.searchCategoryByName", error);
    return null;
  }
}

// Récupérer une catégorie par ID
export async function getCategoryById(id: number): Promise<Category | null> {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return category[0];
  } catch (error) {
    console.log("ERROR::CategoryService.getCategoryById", error);
    return null;
  }
}

// Créer une nouvelle catégorie
export async function createCategory(data: NewCategory): Promise<Category> {
  try {
    const [category] = await db.insert(categories).values(data).returning();
    return category;
  } catch (error) {
    console.log("ERROR::CategoryService.createCategory", error);
    throw error;
  }
}

// Mettre à jour une catégorie
export async function updateCategory(
  id: number,
  data: Partial<Category>
): Promise<Category | null> {
  try {
    const [category] = await db
      .update(categories)
      .set({ ...data })
      .where(eq(categories.id, id))
      .returning();
    return category;
  } catch (error) {
    console.log("ERROR::CategoryService.updateCategory", error);
    return null;
  }
}

// Supprimer une catégorie
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.length > 0;
  } catch (error) {
    console.log("ERROR::CategoryService.deleteCategory", error);
    return false;
  }
}