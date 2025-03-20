import { deleteAnswer, getAnswerById, updateAnswer } from "@/lib/service/answer.service";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await params)?.id) {
      return NextResponse.json({ error: "Answer ID is required" }, { status: 400 });
    }
    const answer = await getAnswerById(+(await params)?.id);
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }
    return NextResponse.json(answer);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const answer = await updateAnswer(+(await params).id, data);
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }
    return NextResponse.json(answer);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const deleted = await deleteAnswer(+(await params).id);
    if (!deleted) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
