import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers"; // Importa cookies

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const leadId = cookieStore.get("leadId")?.value; 

    if (!leadId) {
      return NextResponse.json({ error: "ID do lead é obrigatório" }, { status: 400 });
    }

    const { type } = await req.json();

    let uniqueCode: string = "";
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = (Math.floor(Math.random() * 900000) + 100000).toString(); 

      const existingGift = await prisma.gift.findUnique({
        where: { code: uniqueCode },
      });

      if (!existingGift) {
        isUnique = true;
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      if (type === "physical") {
        const stock = await tx.giftStock.findFirst({
          where: { isActive: true, isFinished: false },
        });

        if (!stock || stock.redeemedCount >= stock.totalAvailable) {
          throw new Error("Estoque de brindes físicos esgotado");
        }

        const gift = await tx.gift.create({
          data: {
            leadId,
            code: uniqueCode,
            hasClaimed: false,
            isPhysical: true,
          },
        });

        await tx.giftStock.update({
          where: { id: stock.id },
          data: {
            redeemedCount: stock.redeemedCount + 1,
            isFinished: stock.redeemedCount + 1 >= stock.totalAvailable,
          },
        });

        return { success: true, gift };
      }

      const gift = await tx.gift.create({
        data: {
          leadId,
          code: uniqueCode,
          hasClaimed: false,
          isPhysical: false,
        },
      });

      return { success: true, gift };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao resgatar brinde:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro interno do servidor" }, { status: 500 });
  }
}
