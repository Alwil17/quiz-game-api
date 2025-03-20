import { eq } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { getCategoryById } from './category.service';
import { users, quizzes, User, Quiz, gameSessions as games, GameSession, NewGameSession } from '../db/schema';
import { OUser } from '../types/user';
import { getUserById } from './user.service';
import { getQuizById } from './quiz.service';

export function gameFactory() {
  return {
    id: games.id,
    score: games.score,
    quiz: {
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      difficulty: quizzes.difficulty,
    },
    user: {
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    },
    createdAt: games.createdAt,
    updatedAt: games.updatedAt,
  };
}

interface GroupedGameSessions {
  totalScore: number;
  avgScore?: number;
  user: OUser;
  games: GameSession[];
}

function groupAndSortSessions(sessions: any): GroupedGameSessions[] {
  // Grouping by user using Map
  const userMap = new Map<number, GroupedGameSessions>();

  for (const game of sessions) {
    const userId = game.user.id;
    const existing = userMap.get(userId);

    if (existing) {
      existing.games.push(game);
      existing.totalScore += game.score ?? 0;
    } else {
      userMap.set(userId, {
        totalScore: game.score,
        user: game.user,
        games: [game],
      });
    }
  }

  // Convert Map to array and sort by totalScore descending
  return Array.from(userMap.values()).map((group) => {
    return {
      avgScore: group.totalScore / group.games.length,
      ...group,
    };
  }).sort((a, b) => 
    b.avgScore - a.avgScore
  );
}



// Récupérer tous les games sessions et les regrouper par user et par ordre de score cummulé
export async function getGroupedGames(): Promise<any[]> {
  try {
    // const sessions = await db.select(gameFactory()).from(games)
    //   .innerJoin(users, eq(games.userId, users.id))
    //   .innerJoin(quizzes, eq(games.quizId, quizzes.id));
    return groupAndSortSessions(await getGames());
  } catch (error) {
    console.log("ERROR::GameSessionService.getGroupedGames", error);
    return [];
  }
}
// Récupérer tous les games
export async function getGames(): Promise<any[]> {
  try {
    // return getGamesWithDetails();
    return await db.select(gameFactory()).from(games)
      .innerJoin(users, eq(games.userId, users.id))
      .innerJoin(quizzes, eq(games.quizId, quizzes.id));
  } catch (error) {
    console.log("ERROR::GameSessionService.getGames", error);
    return [];
  }
}

  // Récupérer un game par ID
  export async function getGameById(id: number): Promise<GameSession | null> {
    try {
      const game = <any>await db.select(gameFactory())
      .from(games)
      .leftJoin(quizzes, eq(quizzes.id, games.quizId))
      .leftJoin(users, eq(users.id, games.userId))
      .where(eq(games.id, id)).limit(1);
      return game[0];
    } catch (error) {
      console.log("ERROR::GameSessionService.getGameById", error);
      return null;
    }
  }
  
  // Créer un nouveau game
  export async function createGame(data: NewGameSession): Promise<GameSession> {
    try {
      let user = null, quiz = null;
      if (data.userId) {
        user = getUserById(data.userId);
        if (!user) {
          throw new Error('User not found');
        }
      }
      if (data.quizId) {
        quiz = getQuizById(data.quizId);
        if (!quiz) {
          throw new Error('Quiz not found');
        }
      }
      const [game] = await db.insert(games).values(data).returning();
      return game;
    } catch (error) {
      console.log("ERROR::GameSessionService.createGame", error);
      throw error;
    }
  }
  
  // Mettre à jour le score d'une session de jeu
  export async function updateGame(
    id: number,
    data: Partial<GameSession>
  ): Promise<GameSession | null> {
    try {
      const [game] = await db
        .update(games)
        .set({ ...data })
        .where(eq(games.id, id))
        .returning();
      return game;
    } catch (error) {
      console.log("ERROR::GameSessionService.updateGame", error);
      return null;
    }
  }
  
  // Supprimer un game
  export async function deleteGame(id: number): Promise<boolean> {
    try {
      const result = await db.delete(games).where(eq(games.id, id));
      return result.length > 0;
    } catch (error) {
      console.log("ERROR::GameSessionService.deleteGame", error);
      return false;
    }
  }
  
  // Récupérer les games avec les informations de l'auteur et de la catégorie
  export async function getGamesWithDetails(): Promise<
    (GameSession & { user: User; quiz: Quiz })[]
  > {
    try {
      const gamesWithDetails = await db
        .select()
        .from(games)
        .innerJoin(users, eq(games.userId, users.id))
        .innerJoin(quizzes, eq(games.quizId, quizzes.id));
  
      return gamesWithDetails.map((row) => ({
        ...row.GameSession,
        user: row.users,
        quiz: row.Quiz,
      }));
    } catch (error) {
      console.log("ERROR::GameSessionService.getGamesWithDetails", error);
      return [];
    }
  }
