import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout realizado com sucesso!" },
      { status: 200 }
    );

    response.headers.set(
      "Set-Cookie",
      "token=; Path=/; HttpOnly; Secure; SameSite=strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );

    return response;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      { error: "Erro ao tentar sair" },
      { status: 500 }
    );
  }
}
