import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { params } = context;
    const giftId = params.id;

    if (!giftId) {
      return NextResponse.json(
        { message: "ID do Gift é obrigatório" },
        { status: 400 }
      );
    }

    const existingGift = await prisma.gift.findUnique({
      where: { id: giftId },
    });

    if (!existingGift) {
      return NextResponse.json(
        { message: "Gift não encontrado" },
        { status: 404 }
      );
    }

    if (existingGift.hasClaimed) {
      return NextResponse.json(
        { message: "O Gift já foi reivindicado" },
        { status: 400 }
      );
    }

    const updatedGift = await prisma.gift.update({
      where: { id: giftId },
      data: {
        hasClaimed: true,
        claimedAt: new Date(),
      },
    });

    return NextResponse.json(updatedGift, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar o gift:", error);

    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}