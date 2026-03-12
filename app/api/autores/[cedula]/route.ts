import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: Promise<{ cedula: string }> }) {
    const { cedula } = await params;
    await conn.query("DELETE FROM autores WHERE cedula = ?", [cedula]);
    return NextResponse.json({ message: "Autor eliminado exitosamente" });
}

export async function PUT(request: Request, { params }: { params: Promise<{ cedula: string }> }) {
    const { cedula } = await params;
    const { cedula: nueva_cedula, nombre_completo, nacionalidad } = await request.json();
    await conn.query(
        "UPDATE autores SET cedula = ?, nombre_completo = ?, nacionalidad = ? WHERE cedula = ?",
        [nueva_cedula, nombre_completo, nacionalidad, cedula]
    );
    return NextResponse.json({ message: "Autor actualizado exitosamente" });
}
