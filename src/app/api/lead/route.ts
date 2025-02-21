"use server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function generateUniqueCode(): Promise<string> {
  let uniqueCode = "";
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = (Math.floor(Math.random() * 900000) + 100000).toString();
    const existingGift = await prisma.gift.findUnique({
      where: { code: uniqueCode },
    });
    
    if (!existingGift) isUnique = true;
  }

  return uniqueCode;
}

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

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        fullName: true,
        jobTitle: true,
        birthDate: true,
        phone: true,
        zipCode: true,
        street: true,
        number: true,
        complement: true,
        state: true,
        city: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { message: "Lead não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(lead, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar lead:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
  try {
    const { email } = await req.json(); 

    if (!email) {
      return NextResponse.json({ message: "E-mail inválido" }, { status: 400 });
    }

    let lead = await prisma.lead.findUnique({ where: { email }, select: { id: true } });

    if (!lead) {
      lead = await prisma.lead.create({
        data: { email, status: false },
      });

      const response = NextResponse.json(
        { message: "E-mail registrado parcialmente.", lead },
        { status: 201 }
      );

      response.headers.set(
        "Set-Cookie",
        `leadId=${lead}; Path=/; HttpOnly; Secure; SameSite=Strict`
      );

      return response;
    }

    const response = NextResponse.json(lead, { status: 200 });

    response.headers.set(
      "Set-Cookie",
      `leadId=${lead.id}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error("Erro ao buscar lead:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const {
      leadId,
      nome,
      cargo,
      dataNascimento,
      celular,
      cep,
      rua,
      numero,
      complemento,
      uf,
      cidade,
    }: {
      leadId: string;
      nome: string;
      cargo: string;
      dataNascimento?: string;
      celular: string;
      cep: string;
      rua: string;
      numero: string;
      complemento?: string;
      uf: string;
      cidade: string;
    } = body;

    if (!leadId) {
      return NextResponse.json(
        { message: "LeadId é obrigatório" },
        { status: 400 }
      );
    }

    if (isNaN(Number(numero))) {
      return NextResponse.json(
        { message: "O campo 'numero' deve ser um número válido" },
        { status: 400 }
      );
    }

    const allFieldsFilled = !!(
      nome &&
      cargo &&
      celular &&
      cep &&
      rua &&
      numero &&
      uf &&
      cidade
    );

    const convertedNumber = parseInt(numero);

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        fullName: nome,
        jobTitle: cargo,
        birthDate: dataNascimento ? new Date(dataNascimento) : null,
        phone: celular,
        zipCode: cep,
        street: rua,
        number: convertedNumber,
        complement: complemento,
        state: uf,
        city: cidade,
        status: allFieldsFilled,
      },
    });

    const existingGift = await prisma.gift.findFirst({
      where: { leadId: lead.id },
    });

    if (existingGift) {
      return NextResponse.json({ leadId: lead.id, giftId: existingGift.id });
    }

    const stock = await prisma.giftStock.findFirst({
      where: { isActive: true, isFinished: false },
    });


    let giftType: "physical" | "digital" = "digital";
  
    if (stock && (stock.totalAvailable > stock.redeemedCount)) {
      giftType = "physical";
    }

    if (giftType === "digital") {
      const digitalGift = await prisma.gift.create({
        data: {
          leadId: lead.id,
          code: null, 
          hasClaimed: false,
          isPhysical: false,
        },
      });

      return NextResponse.json({ leadId: lead.id, giftId: digitalGift.id });
    }

    const uniqueCode = await generateUniqueCode();

    await prisma.$transaction(async (tx) => {
      if (!stock) {
        const digitalGift = await tx.gift.create({
          data: {
            leadId: lead.id,
            code: null, 
            hasClaimed: false,
            isPhysical: false,
          },
        });

        return NextResponse.json({ leadId: lead.id, giftId: digitalGift.id });
      }

      await tx.giftStock.update({
        where: { id: stock.id },
        data: {
          redeemedCount: { increment: 1 },
          isFinished: stock.redeemedCount + 1 >= stock.totalAvailable,
        },
      });

      return await tx.gift.create({
        data: {
          leadId: lead.id,
          code: uniqueCode,
          hasClaimed: false,
          isPhysical: true,
        },
      });
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}