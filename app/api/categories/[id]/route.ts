import { getCategoryById, updateCategory, deleteCategory } from "@/lib/service/category.service";
import { UpdateCategoryDto } from "@/lib/types/category";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  
  if (!params?.id) {
    return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
  }
  const user = await getCategoryById(params?.id);
  if (!user) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  const { deletedAt, ...userData } = user;
  return NextResponse.json(userData);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const data: UpdateCategoryDto = await request.json();
    const user = await updateCategory(+params.id, data);
    if (!user) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
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
  const deleted = await deleteCategory(+params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
