import { getAnswersByQuestionId } from "@/lib/service/answer.service";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await params)?.id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }
    const answers = await getAnswersByQuestionId(+(await params)?.id);
    return NextResponse.json(answers);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
