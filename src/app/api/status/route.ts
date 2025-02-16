"use server"
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const giftStock = await prisma.giftStock.findFirst({
      where: { isActive: true },
      select: { isActive: true, totalAvailable: true, redeemedCount: true }
    });

    if (!giftStock) {
      return NextResponse.json(
        { isActive: false,  message: "Nenhum estoque ativo encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ isActive: giftStock.isActive, totalAvailable: giftStock.totalAvailable, redeemedCount: giftStock.redeemedCount }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar status:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
