import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function GET() {
    const [rows] = await conn.query("SELECT * FROM usuarios");
    return NextResponse.json(rows);
}

export async function POST(request: Request) {
    const { nickname, password, tipo } = await request.json();
    await conn.query(
        "INSERT INTO usuarios (nickname, password, tipo) VALUES (?, ?, ?)",
        [nickname, password, tipo]
    );
    return NextResponse.json({ message: "Usuario creado exitosamente" });
}