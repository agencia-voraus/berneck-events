"use server"
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET as string;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET) as { name: string };

    if (!decoded.name) {
      return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
    }

    return NextResponse.json({ user: { name: decoded.name } });

  } catch (error) {
    
    return NextResponse.json({ error: `Token inválido ou expirado ${error || ""}` }, { status: 401 });
  }
}
