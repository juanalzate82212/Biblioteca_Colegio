import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function GET() {
    const [rows] = await conn.query("SELECT * FROM libros");
    return NextResponse.json(rows);
}

export async function POST(request: Request) {
    const { isbn, titulo, editorial, genero, anio_publicacion, autor_cedula } = await request.json();
    await conn.query(
        "INSERT INTO libros (isbn, titulo, editorial, genero, anio_publicacion, autor_cedula) VALUES (?, ?, ?, ?, ?, ?)",
        [isbn, titulo, editorial, genero, anio_publicacion, autor_cedula]
    );
    return NextResponse.json({ message: "Libro creado exitosamente" });
}