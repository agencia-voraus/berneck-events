/**
 * Importa leads do leads.csv para a tabela Lead.
 * Uso: npm run import-leads
 * Requer DATABASE_URL no .env
 *
 * Mapeamento CSV → Lead:
 *   email → email, fullName → fullName, phone → phone, state → state (2 chars),
 *   city → city, birthDate → birthDate, cep → zipCode, complement → complement,
 *   jobTitle → jobTitle. street e number ficam null.
 */

const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BATCH_SIZE = 2000;
const MAX_STRING = 255;

function trim(str: string | undefined): string | null {
  if (str == null || typeof str !== 'string') return null;
  const t = str.trim();
  return t === '' ? null : t;
}

function truncate(str: string | null, max: number): string | null {
  if (str == null) return null;
  return str.length > max ? str.slice(0, max) : str;
}

/** Email: tudo minúsculo. */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Nome: primeira letra de cada palavra maiúscula, resto minúscula. */
function normalizeFullName(name: string | null): string | null {
  if (name == null || !name.trim()) return null;
  return name
    .trim()
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
}

/** Estado: 2 caracteres (UF). */
function normalizeState(state: string | null): string | null {
  if (!state) return null;
  const s = state.replace(/\s/g, '').toUpperCase();
  if (s.length >= 2) return s.slice(0, 2);
  return s || null;
}

/** CEP: só dígitos, até 8. */
function normalizeZipCode(cep: string | null): string | null {
  if (!cep) return null;
  const digits = cep.replace(/\D/g, '').slice(0, 8);
  return digits === '' ? null : digits;
}

/** Data: ISO ou DD/MM/YYYY ou null. */
function parseBirthDate(value: string | null): Date | null {
  if (!value || !value.trim()) return null;
  const v = value.trim();
  const iso = /^\d{4}-\d{2}-\d{2}/.test(v);
  if (iso) {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  const [d, m, y] = v.split(/[/\-.]/);
  if (d && m && y) {
    const year = y.length === 2 ? 2000 + parseInt(y, 10) : parseInt(y, 10);
    const month = parseInt(m, 10) - 1;
    const day = parseInt(d, 10);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

interface CsvRow {
  email: string;
  fullName: string;
  phone: string;
  state: string;
  city: string;
  birthDate: string;
  cep: string;
  complement: string;
  jobTitle: string;
}

function rowToLead(row: CsvRow) {
  const email = normalizeEmail(row.email);
  if (!email) return null;

  return {
    email,
    fullName: truncate(normalizeFullName(trim(row.fullName)), MAX_STRING),
    jobTitle: truncate(trim(row.jobTitle), MAX_STRING),
    birthDate: parseBirthDate(trim(row.birthDate)),
    phone: trim(row.phone),
    zipCode: normalizeZipCode(trim(row.cep)),
    street: null,
    number: null,
    complement: truncate(trim(row.complement), MAX_STRING),
    state: normalizeState(trim(row.state)),
    city: truncate(trim(row.city), MAX_STRING),
    status: true,
  };
}

async function main() {
  const csvPath = path.join(__dirname, '..', 'leads.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('Arquivo leads.csv não encontrado na raiz do projeto.');
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, 'utf-8');
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as CsvRow[];

  const leads: NonNullable<ReturnType<typeof rowToLead>>[] = [];
  let skipped = 0;
  for (const row of rows) {
    const lead = rowToLead(row);
    if (lead) leads.push(lead);
    else skipped++;
  }

  console.log(`Linhas no CSV: ${rows.length}, válidas: ${leads.length}, ignoradas: ${skipped}`);

  let inserted = 0;
  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE);
    const result = await prisma.lead.createMany({
      data: batch,
      skipDuplicates: true,
    });
    inserted += result.count;
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: +${result.count} (total inseridos: ${inserted})`);
  }

  console.log(`Concluído. Total inseridos: ${inserted} (emails duplicados foram ignorados).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
