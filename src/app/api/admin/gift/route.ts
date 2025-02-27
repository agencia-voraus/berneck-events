import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const filter = searchParams.get("filter");
    const search = searchParams.get("search")?.trim();
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};

    if (filter === "entregues") {
      where.hasClaimed = true;
      where.isPhysical = true;
    } else if (filter === "nao-entregues") {
      where.hasClaimed = false;
      where.isPhysical = true;
    } else if (filter === "produto-digital") {
      where.isPhysical = false;
    }

    if (search) {
      where.lead = {
        fullName: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    const gifts = await prisma.gift.findMany({
      skip,
      take: pageSize,
      where,
      include: { lead: true },
    });

    const total = await prisma.gift.count({ where });

    return NextResponse.json(
      {
        gifts,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar gifts:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
