import { getQuestionsByQuizId } from "@/lib/service/question.service";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await params)?.id) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
    }
    const questions = await getQuestionsByQuizId(+(await params)?.id);
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
