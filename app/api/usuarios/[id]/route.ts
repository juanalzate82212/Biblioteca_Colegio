import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await conn.query("DELETE FROM usuarios WHERE id = ?", [id]);
  return NextResponse.json({ message: "Usuario eliminado exitosamente" });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { nickname, tipo } = await request.json();
    await conn.query(
      "UPDATE usuarios SET nickname = ?, tipo = ? WHERE id = ?",
      [nickname, tipo, id],
    );
    return NextResponse.json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al actualizar el usuario" },
      { status: 500 },
    );
  }
}
