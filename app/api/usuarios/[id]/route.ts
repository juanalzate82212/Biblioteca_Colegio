import { NextResponse } from "next/server";
import { conn } from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await conn.query("DELETE FROM usuarios WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "Usuario eliminado exitosamente" });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { nickname, password } = await request.json();
    await conn.query(
        "UPDATE usuarios SET nickname = ?, password = ? WHERE id = ?",
        [nickname, password, params.id]
    );
    return NextResponse.json({ message: "Usuario actualizado exitosamente" });
}