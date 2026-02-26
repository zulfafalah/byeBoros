// ── Transactions ─────────────────────────────────
export interface TransactionItem {
  id: string;
  transaction_name: string;
  category: string;
  time: string;
  amount: number;
  amount_display: string;
  type: "expense" | "income";
}

export interface TransactionGroup {
  group_label: string;
  group_date: string;
  items: TransactionItem[];
}

export interface TransactionData {
  transactions: TransactionGroup[];
}

// ── Generic API Response ─────────────────────────
export interface ApiResponse<T> {
  data: T;
  status: string;
}

export type TransactionResponse = ApiResponse<TransactionData>;

// ── API Error ────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
