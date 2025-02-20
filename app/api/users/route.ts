import { NextResponse } from 'next/server';
import { CreateUserDto } from '@/lib/types/user';
import { getUsers, createUser } from '@/lib/service/user.service';

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const data: CreateUserDto = await request.json();
    const user = await createUser(data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}