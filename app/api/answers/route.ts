import { createAnswer, getAnswers } from "@/lib/service/answer.service";
import { NextResponse } from "next/server";

export async function GET() {
  const answers = await getAnswers();
  return NextResponse.json(answers);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const answer = await createAnswer(data);
    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
