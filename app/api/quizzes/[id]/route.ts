import { getQuizById, updateQuiz, deleteQuiz } from "@/lib/service/quiz.service";
import { UpdateQuizDto } from "@/lib/types/quiz";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  
 try {
   if (!(await params)?.id) {
     return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
   }
   const user = await getQuizById(+(await params)?.id);
   if (!user) {
     return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
   }
   const { deletedAt, ...userData } = user;
   return NextResponse.json(userData);
 } catch (error) {
  return NextResponse.json(error, { status: 500 });
 }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data: UpdateQuizDto = await request.json();
    const user = await updateQuiz(+(await params).id, data);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const deleted = await deleteQuiz(+(await params).id);
    if (!deleted) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
