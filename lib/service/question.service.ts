import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { questions, Question, NewQuestion, answers, quizzes } from "../db/schema";
import { getQuizById } from "./quiz.service";

// Récupérer toutes les questions
export async function getQuestions(): Promise<Question[]> {
  try {
    return await db.select().from(questions);
  } catch (error) {
    console.log("ERROR::QuestionService.getQuestions", error);
    return [];
  }
}

// Récupérer les questions par quiz ID
export async function getQuestionsByQuizId(quizId: number): Promise<Question[]> {
  try {
    return await db.select().from(questions).where(eq(questions.quizId, quizId));
  } catch (error) {
    console.log("ERROR::QuestionService.getQuestionsByQuizId", error);
    return [];
  }
}

// Récupérer une question par ID
export async function getQuestionById(id: number): Promise<Question | null> {
  try {
    const question = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
    return question[0] || null;
  } catch (error) {
    console.log("ERROR::QuestionService.getQuestionById", error);
    return null;
  }
}

// Créer une nouvelle question
export async function createQuestion(data: NewQuestion): Promise<Question> {
  try {
    if (data.quizId) {
      const quiz = await getQuizById(data.quizId);
      if (!quiz) {
        throw new Error("Quiz not found");
      }
      const [question] = await db.insert(questions).values(data).returning();
      return question;
    }
    throw new Error("Quiz ID is required");
  } catch (error) {
    console.log("ERROR::QuestionService.createQuestion", error);
    throw error;
  }
}

// Mettre à jour une question
export async function updateQuestion(id: number, data: Partial<Question>): Promise<Question | null> {
  try {
    const [question] = await db
      .update(questions)
      .set({ ...data })
      .where(eq(questions.id, id))
      .returning();
    return question;
  } catch (error) {
    console.log("ERROR::QuestionService.updateQuestion", error);
    return null;
  }
}

// Supprimer une question
export async function deleteQuestion(id: number): Promise<boolean> {
  try {
    const result = await db.delete(questions).where(eq(questions.id, id));
    return result.length > 0;
  } catch (error) {
    console.log("ERROR::QuestionService.deleteQuestion", error);
    return false;
  }
}
