"use server"
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { isActive, totalAvailable } = await req.json();

    const currentGiftStock = await prisma.giftStock.findFirst({
      where: { isActive: true },
    });

    if (currentGiftStock) {
      if (!isActive) {
        await prisma.giftStock.update({
          where: { id: currentGiftStock.id },
          data: { isActive: false, isFinished: true },
        });

        return NextResponse.json({ message: "Distribuição finalizada!", isActive: false, isFinished: true }, { status: 200 });
      }
    }

    if (isActive) {
      if (!totalAvailable || totalAvailable <= 0) {
        return NextResponse.json({ error: "Quantidade inválida" }, { status: 400 });
      }

      const newGiftStock = await prisma.giftStock.create({
        data: {
          totalAvailable,
          redeemedCount: 0,
          isActive: true,
          isFinished: false,
        },
      });

      return NextResponse.json({ message: "Nova distribuição iniciada!", isActive: true, newGiftStock }, { status: 201 });
    }

    return NextResponse.json({ error: "Operação inválida" }, { status: 400 });

  } catch (error) {
    console.error("Erro ao alternar status:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
