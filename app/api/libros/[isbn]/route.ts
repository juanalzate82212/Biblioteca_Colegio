import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: { isbn: string } }) {
    await conn.query("DELETE FROM libros WHERE isbn = ?", [params.isbn]);
    return NextResponse.json({ message: "Libro eliminado exitosamente" });
}

export async function PUT(request: Request, { params }: { params: { isbn: string } }) {
    const { titulo, editorial, genero, anio_publicacion, autor_cedula } = await request.json();
    await conn.query(
        "UPDATE libros SET titulo = ?, editorial = ?, genero = ?, anio_publicacion = ?, autor_cedula = ? WHERE isbn = ?",
        [titulo, editorial, genero, anio_publicacion, autor_cedula, params.isbn]
    );
    return NextResponse.json({ message: "Libro actualizado exitosamente" });
}