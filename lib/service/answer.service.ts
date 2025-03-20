import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { answers, Answer, NewAnswer, questions } from "../db/schema";
import { getQuestionById } from "./question.service";

// Récupérer toutes les réponses
export async function getAnswers(): Promise<Answer[]> {
  try {
    return await db.select().from(answers);
  } catch (error) {
    console.log("ERROR::AnswerService.getAnswers", error);
    return [];
  }
}

// Récupérer les réponses par question ID
export async function getAnswersByQuestionId(questionId: number): Promise<Answer[]> {
  try {
    return await db.select().from(answers).where(eq(answers.questionId, questionId));
  } catch (error) {
    console.log("ERROR::AnswerService.getAnswersByQuestionId", error);
    return [];
  }
}

// Récupérer une réponse par ID
export async function getAnswerById(id: number): Promise<Answer | null> {
  try {
    const answer = await db.select().from(answers).where(eq(answers.id, id)).limit(1);
    return answer[0] || null;
  } catch (error) {
    console.log("ERROR::AnswerService.getAnswerById", error);
    return null;
  }
}

// Créer une nouvelle réponse
export async function createAnswer(data: NewAnswer): Promise<Answer> {
  try {
    if (data.questionId) {
      const question = await getQuestionById(data.questionId);
      if (!question) {
        throw new Error("Question not found");
      }
      const [answer] = await db.insert(answers).values(data).returning();
      return answer;
    }
    throw new Error("Question ID is required");
  } catch (error) {
    console.log("ERROR::AnswerService.createAnswer", error);
    throw error;
  }
}

// Mettre à jour une réponse
export async function updateAnswer(id: number, data: Partial<Answer>): Promise<Answer | null> {
  try {
    const [answer] = await db
      .update(answers)
      .set({ ...data })
      .where(eq(answers.id, id))
      .returning();
    return answer;
  } catch (error) {
    console.log("ERROR::AnswerService.updateAnswer", error);
    return null;
  }
}

// Supprimer une réponse
export async function deleteAnswer(id: number): Promise<boolean> {
  try {
    const result = await db.delete(answers).where(eq(answers.id, id));
    return result.length > 0;
  } catch (error) {
    console.log("ERROR::AnswerService.deleteAnswer", error);
    return false;
  }
}
