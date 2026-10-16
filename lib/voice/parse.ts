export interface ParsedVoiceTransaction {
  amount?: number;
  description?: string;
  type?: "income" | "expense";
}

const UNITS: Record<string, number> = {
  nol: 0,
  kosong: 0,
  satu: 1,
  dua: 2,
  tiga: 3,
  empat: 4,
  lima: 5,
  enam: 6,
  tujuh: 7,
  delapan: 8,
  sembilan: 9,
  sepuluh: 10,
  sebelas: 11,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

const SCALES: Record<string, number> = {
  ribu: 1_000,
  rb: 1_000,
  k: 1_000,
  rebu: 1_000,
  juta: 1_000_000,
  jt: 1_000_000,
  milyar: 1_000_000_000,
  miliar: 1_000_000_000,
  thousand: 1_000,
  million: 1_000_000,
};

const HUNDRED_WORDS = new Set(["ratus", "hundred"]);

const FILLERS = new Set([
  "catat",
  "catet",
  "tambah",
  "tambahkan",
  "input",
  "masukkan",
  "pengeluaran",
  "pemasukan",
  "pendapatan",
  "pemasukkan",
  "sebesar",
  "senilai",
  "seharga",
  "rupiah",
  "rp",
  "buat",
  "untuk",
  "aku",
  "saya",
  "tadi",
  "habis",
  "keluar",
  "masuk",
  "expense",
  "income",
  "spend",
  "spent",
  "paid",
  "pay",
]);

const INCOME_WORDS = new Set([
  "pemasukan",
  "pendapatan",
  "pemasukkan",
  "gaji",
  "bonus",
  "terima",
  "dapat",
  "dapet",
  "masuk",
  "income",
  "salary",
  "dividen",
  "dividends",
  "freelance",
]);

const EXPENSE_WORDS = new Set([
  "pengeluaran",
  "belanja",
  "bayar",
  "beli",
  "jajan",
  "keluar",
  "habis",
  "expense",
  "spend",
  "spent",
  "paid",
  "pay",
]);

function isNumericToken(token: string): boolean {
  return /^\d[\d.,]*$/.test(token);
}

function numericValue(token: string): number {
  const cleaned = token.replace(/[.,]/g, "");
  const value = Number.parseInt(cleaned, 10);
  return Number.isFinite(value) ? value : 0;
}

function parseSegment(tokens: string[]): number {
  let value = 0;
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (isNumericToken(token)) {
      value += numericValue(token);
      continue;
    }
    if (token === "seratus") {
      value += 100;
      continue;
    }
    if (token === "seribu") {
      value += 1_000;
      continue;
    }
    if (token === "sejuta") {
      value += 1_000_000;
      continue;
    }
    const unit = UNITS[token];
    if (unit !== undefined) {
      const next = tokens[i + 1];
      if (next === "ratus" || next === "hundred") {
        value += unit * 100;
        i += 1;
      } else if (next === "puluh") {
        value += unit * 10;
        i += 1;
      } else if (next === "belas") {
        value += unit + 10;
        i += 1;
      } else {
        value += unit;
      }
      continue;
    }
    if (token === "puluh" || token === "belas") {
      value += 10;
    } else if (HUNDRED_WORDS.has(token)) {
      value += 100;
    }
  }
  return value;
}

export function parseIndonesianAmount(tokens: string[]): number | undefined {
  let total = 0;
  let group: string[] = [];

  const flush = (scale?: number) => {
    const groupValue = parseSegment(group);
    if (scale) {
      total += (groupValue || 1) * scale;
    } else {
      total += groupValue;
    }
    group = [];
  };

  for (const token of tokens) {
    const scale = SCALES[token];
    if (scale !== undefined && scale >= 1_000) {
      flush(scale);
    } else {
      group.push(token);
    }
  }
  flush();

  return total > 0 ? total : undefined;
}

function normalize(transcript: string): string[] {
  return transcript
    .toLowerCase()
    .replace(/rp\b/g, " ")
    .replace(/(\d)\s*(rb|rebu)\b/g, "$1 ribu")
    .replace(/(\d)\s*(jt)\b/g, "$1 juta")
    .replace(/(\d)\s*k\b/g, "$1 ribu")
    .replace(/[^a-z0-9.,\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function isNumberWord(token: string): boolean {
  return (
    isNumericToken(token) ||
    token in UNITS ||
    token in SCALES ||
    HUNDRED_WORDS.has(token) ||
    token === "puluh" ||
    token === "belas" ||
    token === "seratus" ||
    token === "seribu" ||
    token === "sejuta"
  );
}

export function parseVoiceTransaction(
  transcript: string,
): ParsedVoiceTransaction {
  const tokens = normalize(transcript);
  if (tokens.length === 0) return {};

  const amount = parseIndonesianAmount(tokens);

  let type: ParsedVoiceTransaction["type"];
  if (tokens.some((token) => INCOME_WORDS.has(token))) type = "income";
  else if (tokens.some((token) => EXPENSE_WORDS.has(token))) type = "expense";

  const description = tokens
    .filter((token) => !isNumberWord(token) && !FILLERS.has(token))
    .join(" ")
    .trim();

  return {
    amount,
    description: description || undefined,
    type,
  };
}
