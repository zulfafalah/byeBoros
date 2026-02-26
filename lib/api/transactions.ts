import { api } from "./client";
import type { TransactionResponse } from "./types";

interface GetTransactionsParams {
  date: string; // e.g. "2026-02-22"
}

export interface CreateIncomePayload {
  description: string;
  category: string;
  priority: string;
  amount: number;
  notes?: string;
  transaction_at: string; // e.g. "22/02/2026 14:30:00"
}

/**
 * Fetch transactions for a given date.
 * Spreadsheet ID and sheet name are automatically injected by the API client.
 */
export async function getTransactions({
  date,
}: GetTransactionsParams): Promise<TransactionResponse> {
  return api.get<TransactionResponse>(`/api/transaction?date=${date}`);
}

/**
 * Create a new income transaction.
 * Spreadsheet ID and sheet name are automatically injected by the API client.
 */
export async function createIncome(payload: CreateIncomePayload) {
  return api.post("/api/transaction/income", payload);
}
