import { createQuiz, getQuizzes } from '@/lib/service/quiz.service';
import { CreateQuizDto } from '@/lib/types/quiz';
import { NextResponse } from 'next/server';

export async function GET() {
  const quizzes = await getQuizzes();
  return NextResponse.json(quizzes);
}

export async function POST(request: Request) {
  try {
    const data: CreateQuizDto = await request.json();
    const Quiz = await createQuiz(data);
    return NextResponse.json(Quiz, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}