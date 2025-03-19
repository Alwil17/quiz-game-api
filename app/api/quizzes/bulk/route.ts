import { importBulkData } from "@/lib/service/quiz.service";
import { BulkQuizDto } from "@/lib/types/quiz";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data: BulkQuizDto[] = await request.json();
    const resp = await importBulkData(data);
    return NextResponse.json(resp, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
