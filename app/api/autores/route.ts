import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function GET() {
    const [rows] = await conn.query("SELECT * FROM autores");
    return NextResponse.json(rows);
}

export async function POST(request: Request) {
    const { cedula, nombre_completo, nacionalidad } = await request.json();
    await conn.query(
        "INSERT INTO autores (cedula, nombre_completo, nacionalidad) VALUES (?, ?, ?)",
        [cedula, nombre_completo, nacionalidad]
    );
    return NextResponse.json({ message: "Autor creado exitosamente" });
}