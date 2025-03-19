import { getGroupedGames } from "@/lib/service/game.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const games = await getGroupedGames();
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
