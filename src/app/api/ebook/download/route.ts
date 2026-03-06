import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('leadId');

  if (!leadId) {
    return NextResponse.json({ message: 'leadId é obrigatório' }, { status: 400 });
  }

  try {
    const gift = await prisma.gift.findFirst({
      where: { leadId },
    });

    if (!gift || gift.isPhysical) {
      return NextResponse.json(
        { message: 'Não autorizado a baixar o eBook' },
        { status: 403 }
      );
    }

    const pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'Legado_ebook.pdf');

    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { message: "PDF não encontrado" },
        { status: 404 }
      );
    }

    const stat = fs.statSync(pdfPath);

    await prisma.gift.update({
      where: { id: gift.id },
      data: {
        hasClaimed: true,
        claimedAt: new Date(),
      },
    });

    const nodeStream = fs.createReadStream(pdfPath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Legado_ebook.pdf"',
        'Content-Length': String(stat.size),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
