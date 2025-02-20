import { getQuizById, updateQuiz, deleteQuiz } from "@/lib/service/quiz.service";
import { UpdateQuizDto } from "@/lib/types/quiz";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  
  if (!params?.id) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
  }
  const user = await getQuizById(params?.id);
  if (!user) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }
  const { deletedAt, ...userData } = user;
  return NextResponse.json(userData);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const data: UpdateQuizDto = await request.json();
    const user = await updateQuiz(+params.id, data);
    if (!user) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const deleted = await deleteQuiz(+params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
