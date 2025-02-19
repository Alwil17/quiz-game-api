import { getUserById, updateUser, deleteUser } from "@/lib/service/user";
import { UpdateUserDto } from "@/lib/types/user";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  
  if (!params?.id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  const user = await getUserById(params?.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { passwordHash, deletedAt, ...userData } = user;
  return NextResponse.json(userData);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const data: UpdateUserDto = await request.json();
    const user = await updateUser(+params.id, data);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const deleted = await deleteUser(+params.id);
  if (!deleted) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
