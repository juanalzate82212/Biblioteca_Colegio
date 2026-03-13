import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ cedula: string }> }) {
    const { cedula } = await params;
    const [libros] = await conn.query("SELECT * FROM libros WHERE autor_cedula = ?", [cedula]);
    return NextResponse.json(libros);
}