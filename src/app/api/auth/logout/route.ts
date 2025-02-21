"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0, 
      path: "/",
    });

    return NextResponse.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json({ error: "Erro ao realizar logout" }, { status: 500 });
  }
}