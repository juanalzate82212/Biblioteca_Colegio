import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function GET() {
  // const [rows] = await conn.query("SELECT * FROM libros");
  // return NextResponse.json(rows);
  try {
    const query = `
    SELECT l.isbn, l.titulo, l.editorial, l.genero, l.anio_publicacion, l.autor_cedula, a.nombre_completo AS nombre_autor
    FROM libros l
    INNER JOIN autores a ON l.autor_cedula = a.cedula`;
    const [rows] = await conn.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener libros:", error);
    return NextResponse.json(
      { error: "Error al obtener libros" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { isbn, titulo, editorial, genero, anio_publicacion, autor_cedula } =
    await request.json();
  await conn.query(
    "INSERT INTO libros (isbn, titulo, editorial, genero, anio_publicacion, autor_cedula) VALUES (?, ?, ?, ?, ?, ?)",
    [isbn, titulo, editorial, genero, anio_publicacion, autor_cedula],
  );
  return NextResponse.json({ message: "Libro creado exitosamente" });
}
