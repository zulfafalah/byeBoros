"use client";

import { useCallback, useEffect, useState } from "react";
import { getTransactions } from "@/lib/api/transactions";
import type { TransactionGroup } from "@/lib/api/types";

interface UseTransactionsOptions {
  date: string;
}

interface UseTransactionsReturn {
  transactions: TransactionGroup[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTransactions({
  date,
}: UseTransactionsOptions): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<TransactionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await getTransactions({ date });
      setTransactions(res.data.transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, isLoading, error, refetch: fetchTransactions };
}
