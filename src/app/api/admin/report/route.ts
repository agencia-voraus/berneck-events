import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalGenerated = await prisma.gift.count();

    const totalClaimed = await prisma.gift.count({
      where: {
        hasClaimed: true,
      },
    });

    return NextResponse.json(
      { totalGenerated, totalClaimed },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar contagens de gifts:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}