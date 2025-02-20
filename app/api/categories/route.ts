import { createCategory, getCategories } from '@/lib/service/category.service';
import { CreateCategoryDto } from '@/lib/types/category';
import { NextResponse } from 'next/server';

export async function GET() {
  const quizzes = await getCategories();
  return NextResponse.json(quizzes);
}

export async function POST(request: Request) {
  try {
    const data: CreateCategoryDto = await request.json();
    const Category = await createCategory(data);
    return NextResponse.json(Category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}