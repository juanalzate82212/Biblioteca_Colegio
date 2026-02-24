import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: { cedula: string } }) {
    await conn.query("DELETE FROM autores WHERE cedula = ?", [params.cedula]);
    return NextResponse.json({ message: "Autor eliminado exitosamente" });
}

export async function PUT(request: Request, { params }: { params: { cedula: string } }) {
    const { nombre_completo, nacionalidad } = await request.json();
    await conn.query(
        "UPDATE autores SET nombre_completo = ?, nacionalidad = ? WHERE cedula = ?",
        [nombre_completo, nacionalidad, params.cedula]
    );
    return NextResponse.json({ message: "Autor actualizado exitosamente" });
}
