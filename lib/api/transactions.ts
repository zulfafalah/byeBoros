import { api } from "./client";
import type { TransactionResponse } from "./types";

interface GetTransactionsParams {
  date?: string; // e.g. "2026-02-22"
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
export async function getTransactions(params?: GetTransactionsParams): Promise<TransactionResponse> {
  const query = params?.date ? `?date=${params.date}` : "";
  return api.get<TransactionResponse>(`/api/transaction${query}`);
}

/**
 * Create a new income transaction.
 * Spreadsheet ID and sheet name are automatically injected by the API client.
 */
export async function createIncome(payload: CreateIncomePayload) {
  return api.post("/api/transaction/income", payload);
}

export interface CreateExpensePayload {
  description: string;
  category: string;
  priority: string;
  amount: number;
  notes?: string;
  transaction_at: string; // e.g. "22/02/2026 14:30:00"
}

/**
 * Create a new expense transaction.
 * Spreadsheet ID and sheet name are automatically injected by the API client.
 */
export async function createExpense(payload: CreateExpensePayload) {
  return api.post("/api/transaction/expense", payload);
}

export interface UpdateIncomePayload {
  id: string;
  type: "income";
  description: string;
  category: string;
  amount: number;
  transaction_at: string; // e.g. "27/02/2026 20:36:24"
}

export interface UpdateExpensePayload {
  id: string;
  type: "expense";
  description: string;
  category: string;
  priority: string;
  amount: number;
  notes?: string;
  transaction_at: string; // e.g. "27/02/2026 20:36:24"
}

/**
 * Update an existing transaction (income or expense).
 * Spreadsheet ID and sheet name are automatically injected by the API client.
 */
export async function updateTransaction(payload: UpdateIncomePayload | UpdateExpensePayload) {
  return api.put("/api/transaction", payload);
}
