import { getGameById, updateGame, deleteGame } from "@/lib/service/game.service";
import { UpdateGameDto } from "@/lib/types/game";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  
 try {
   if (!(await params)?.id) {
     return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
   }
   const game = await getGameById(+(await params)?.id);
   if (!game) {
     return NextResponse.json({ error: "Game not found" }, { status: 404 });
   }
   const { deletedAt, ...gameData } = game;
   return NextResponse.json(gameData);
 } catch (error) {
  return NextResponse.json(error, { status: 500 });
 }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data: UpdateGameDto = await request.json();
    const game = await updateGame(+(await params).id, data);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const deleted = await deleteGame(+(await params).id);
    if (!deleted) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
