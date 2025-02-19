import { signIn } from "@/lib/service/auth";
import { createUser } from "@/lib/service/user";
import { CreateUserDto, LoginUserDTO } from "@/lib/types/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data: LoginUserDTO = await request.json();
    const user = await signIn(data);
    if (!user) {
        return NextResponse.json(
            { error: 'Invalid email or password. Please try again.' },
            { status: 409 }
        );
    }
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid email or password. Please try again.' },
      { status: 409 }
    );
  }
}
