import { createQuestion, getQuestions } from "@/lib/service/question.service";
import { NextResponse } from "next/server";

export async function GET() {
  const questions = await getQuestions();
  return NextResponse.json(questions);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const question = await createQuestion(data);
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
