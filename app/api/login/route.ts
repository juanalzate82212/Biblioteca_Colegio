import { NextResponse } from "next/server"; 
import {conn } from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

export async function POST(request: Request) {
    const { nickname, password } = await request.json();

    try {
        const [rows]: any = await conn.query(
            'SELECT * FROM usuarios WHERE nickname = ?',
            [nickname]
        );

        const usuario = rows[0];

        if (!usuario) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
        }

        const esValida = (password === usuario.password) || await bcrypt.compare(password, usuario.password);

        if (!esValida) {
            return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'llave_secreta_123');
        const token = await new SignJWT({ 
            id: usuario.id, role: usuario.role })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("2h")
            .sign(secret);
        return NextResponse.json({ message: "Login exitoso", role: usuario.tipo, token });
    } catch (error) {
        console.error("Error en el login:", error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}