import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ isbn: string }> },
) {
  const { isbn } = await params;
  await conn.query("DELETE FROM libros WHERE isbn = ?", [isbn]);
  return NextResponse.json({ message: "Libro eliminado exitosamente" });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ isbn: string }> },
) {
  try {
    const { isbn } = await params;
    const { titulo, editorial, genero, anio_publicacion, autor_cedula } =
      await request.json();
    await conn.query(
      "UPDATE libros SET titulo = ?, editorial = ?, genero = ?, anio_publicacion = ?, autor_cedula = ? WHERE isbn = ?",
      [titulo, editorial, genero, anio_publicacion, autor_cedula, isbn],
    );
    return NextResponse.json({ message: "Libro actualizado exitosamente" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al actualizar libro" },
      { status: 500 },
    );
  }
}
