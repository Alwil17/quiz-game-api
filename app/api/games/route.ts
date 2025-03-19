import { createGame, getGames } from '@/lib/service/game.service';
import { CreateGameDto } from '@/lib/types/game';
import { NextResponse } from 'next/server';

export async function GET() {
  const games = await getGames();
  return NextResponse.json(games);
}

export async function POST(request: Request) {
  try {
    const data: CreateGameDto = await request.json();
    const gameSession = await createGame(data);
    return NextResponse.json(gameSession, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}