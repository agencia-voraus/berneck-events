import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json(
        { message: "Lead ID é obrigatório" },
        { status: 400 }
      );
    }

    const gift = await prisma.gift.findFirst({
      where: { leadId: leadId },
      orderBy: { createdAt: "desc" },
      select: {
        isPhysical: true,
        hasClaimed: true,
        code: true,
        createdAt: true,
      },
    });

    if (!gift) {
      return NextResponse.json(
        { message: "Gift não encontrado para este Lead" },
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
