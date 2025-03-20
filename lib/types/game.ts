// GameSession types
import { GameSession } from "../db/schema";
import { OQuiz } from "./quiz";
import { OUser } from "./user";

export type CreateGameDto = Omit<GameSession, "id" | "createdAt">

export type GameSearchDTO = Partial<GameSession>;
export interface OGameSession extends Partial<GameSession> {
  quiz: OQuiz;
  user: OUser
}

export interface UpdateGameDto extends Pick<CreateGameDto, 'score'> {
  id: number;
}
