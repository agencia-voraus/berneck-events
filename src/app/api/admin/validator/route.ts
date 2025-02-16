import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { message: "Código do Gift é obrigatório" },
        { status: 400 }
      );
    }

    let gift;

    if (code) {
      gift = await prisma.gift.findUnique({
        where: { code },
        include: { lead: true },
      });
    }

    if (!gift) {
      return NextResponse.json(
        { message: "Gift não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(gift, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar gift:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
