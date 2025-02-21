import { getUserById, updateUser, deleteUser } from "@/lib/service/user.service";
import { UpdateUserDto } from "@/lib/types/user";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userID = +(await params).id;
  if (!userID) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  const user = await getUserById(userID);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { passwordHash, deletedAt, ...userData } = user;
  return NextResponse.json(userData);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const data: UpdateUserDto = await request.json();
    const user = await updateUser(+(await params).id, data);
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
  { params }: { params: Promise<{ id: string }> }
) {
  const deleted = await deleteUser(+(await params).id);
  if (!deleted) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
