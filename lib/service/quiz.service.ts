import { eq, ilike } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { categories, Category, NewQuiz, Quiz, quizzes, User, users } from '../db/schema';
import { getCategoryById } from './category.service';
import { OQuiz } from '../types/quiz';

function quizFactory() {
  return {
    id: quizzes.id,
    title: quizzes.title,
    description: quizzes.description,
    difficulty: quizzes.difficulty,
    categoryId: quizzes.categoryId,
    authorId: quizzes.authorId,
    category: {
      id: categories.id,
      name: categories.name,
      description: categories.description,
    },
    createdAt: quizzes.createdAt,
    updatedAt: quizzes.updatedAt,
  };
}

// Récupérer tous les quizzes
export async function getQuizzes(): Promise<any[]> {
    try {
      return await db.select(quizFactory()).from(quizzes).leftJoin(categories, eq(categories.id, quizzes.categoryId));
    } catch (error) {
      console.log("ERROR::QuizService.getQuizzes", error);
      return [];
    }
  }
  
  // Rechercher un quiz par titre
  export async function searchQuizByTitle(title: string): Promise<Quiz | null> {
    try {
      const quiz = <any>await db
        .select(quizFactory())
        .from(quizzes)
        .leftJoin(categories, eq(categories.id, quizzes.categoryId))
        .where(ilike(quizzes.title, title))
        .limit(1);
      return quiz[0];
    } catch (error) {
      console.log("ERROR::QuizService.searchQuizByTitle", error);
      return null;
    }
  }

  // Récupérer un quiz par ID
  export async function getQuizById(id: number): Promise<Quiz | null> {
    try {
      const quiz = <any>await db.select({
        id: quizzes.id,
        title: quizzes.title,
        description: quizzes.description,
        categoryId: quizzes.categoryId,
        authorId: quizzes.authorId,
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
        },
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
      })
      .from(quizzes)
      .leftJoin(categories, eq(categories.id, quizzes.categoryId))
      .where(eq(quizzes.id, id)).limit(1);
      return quiz[0];
    } catch (error) {
      console.log("ERROR::QuizService.getQuizById", error);
      return null;
    }
  }
  
  // Créer un nouveau quiz
  export async function createQuiz(data: NewQuiz): Promise<Quiz> {
    try {
        if (data.categoryId) {
            const category = getCategoryById(data.categoryId);
            if (!category) {
                throw new Error('Category not found');
            }
            const [quiz] = await db.insert(quizzes).values(data).returning();
            return quiz;
        }
        throw new Error('Category ID is required');
    } catch (error) {
      console.log("ERROR::QuizService.createQuiz", error);
      throw error;
    }
  }
  
  // Mettre à jour un quiz
  export async function updateQuiz(
    id: number,
    data: Partial<Quiz>
  ): Promise<Quiz | null> {
    try {
      const [quiz] = await db
        .update(quizzes)
        .set({ ...data })
        .where(eq(quizzes.id, id))
        .returning();
      return quiz;
    } catch (error) {
      console.log("ERROR::QuizService.updateQuiz", error);
      return null;
    }
  }
  
  // Supprimer un quiz
  export async function deleteQuiz(id: number): Promise<boolean> {
    try {
      const result = await db.delete(quizzes).where(eq(quizzes.id, id));
      return result.length > 0;
    } catch (error) {
      console.log("ERROR::QuizService.deleteQuiz", error);
      return false;
    }
  }
  
  // Récupérer les quizzes avec les informations de l'auteur et de la catégorie
  export async function getQuizzesWithDetails(): Promise<
    (Quiz & { author: User; category: Category })[]
  > {
    try {
      const quizzesWithDetails = await db
        .select()
        .from(quizzes)
        .innerJoin(users, eq(quizzes.authorId, users.id))
        .innerJoin(categories, eq(quizzes.categoryId, categories.id));
  
      return quizzesWithDetails.map((row) => ({
        ...row.Quiz,
        author: row.users,
        category: row.Category,
      }));
    } catch (error) {
      console.log("ERROR::QuizService.getQuizzesWithDetails", error);
      return [];
    }
  }
