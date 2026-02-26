import { api } from "./client";
import type { TransactionResponse } from "./types";

interface GetTransactionsParams {
  date: string;            // e.g. "2026-02-22"
  spreadsheetId: string;
  sheetName: string;
}

/**
 * Fetch transactions for a given date.
 */
export async function getTransactions({
  date,
  spreadsheetId,
  sheetName,
}: GetTransactionsParams): Promise<TransactionResponse> {
  return api.get<TransactionResponse>(`/api/transaction?date=${date}`, {
    headers: {
      "X-Spreadsheet-ID": spreadsheetId,
      "X-Sheet-Name": sheetName,
    },
  });
}
