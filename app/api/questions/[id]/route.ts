import { deleteQuestion, getQuestionById, updateQuestion } from "@/lib/service/question.service";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await params)?.id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }
    const question = await getQuestionById(+(await params)?.id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const question = await updateQuestion(+(await params).id, data);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const deleted = await deleteQuestion(+(await params).id);
    if (!deleted) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
