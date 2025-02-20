import { signIn, signUp } from "@/lib/service/auth";
import { createUser } from "@/lib/service/user";
import { CreateUserDto, LoginUserDTO } from "@/lib/types/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data: CreateUserDto = await request.json();
    const user = await signUp(data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}