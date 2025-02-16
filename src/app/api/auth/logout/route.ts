"use server"
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({ message: "Logout realizado com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json({ error: "Erro ao tentar sair" }, { status: 500 });
  }
}
