import { api } from "./client";
import type { TransactionResponse } from "./types";

interface GetTransactionsParams {
  date: string; // e.g. "2026-02-22"
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
