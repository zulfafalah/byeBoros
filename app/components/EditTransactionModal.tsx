"use client";

import { useState, useEffect } from "react";
import { updateTransaction } from "@/lib/api/transactions";
import { getCategories, getIncomeCategories, type CategoryItem } from "@/lib/api/category";
import type { TransactionItem } from "@/lib/api/types";

interface EditTransactionModalProps {
  transaction: TransactionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (type: "success" | "error", message: string) => void;
}

export default function EditTransactionModal({
  transaction,
  isOpen,
  onClose,
  onSuccess,
  showToast,
}: EditTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [priority, setPriority] = useState("Low");
  const [notes, setNotes] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);

  // Load categories on mount
  useEffect(() => {
    if (transaction?.type === "expense") {
      getCategories()
        .then((res) => setCategories(res.categories))
        .catch((err) => console.error("Failed to fetch expense categories:", err));
    } else if (transaction?.type === "income") {
      getIncomeCategories()
        .then((res) => setIncomeCategories(res.categories))
        .catch((err) => console.error("Failed to fetch income categories:", err));
    }
  }, [transaction?.type]);

  // Populate form when transaction changes
  useEffect(() => {
    if (transaction) {
      setDescription(transaction.transaction_name);
      setCategory(transaction.category);
      // Always use absolute value for amount (no negative numbers)
      setAmount(String(Math.abs(transaction.amount)));
      // Set to current datetime in YYYY-MM-DDTHH:MM format for datetime-local input
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const mi = String(now.getMinutes()).padStart(2, "0");
      setTransactionDate(`${yyyy}-${mm}-${dd}T${hh}:${mi}`);
      setNotes("");
      setPriority("Low");
    }
  }, [transaction]);

  // Format date with time in DD/MM/YYYY HH:MM:SS format
  const formatTransactionAt = (dateString: string): string => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !description || !category || !amount) return;

    setIsLoading(true);
    try {
      const formattedDateTime = formatTransactionAt(transactionDate);
      
      if (transaction.type === "income") {
        await updateTransaction({
          id: transaction.id,
          type: "income",
          description,
          category,
          amount: Number(amount),
          transaction_at: formattedDateTime,
        });
      } else {
        await updateTransaction({
          id: transaction.id,
          type: "expense",
          description,
          category,
          priority,
          amount: Number(amount),
          notes: notes || undefined,
          transaction_at: formattedDateTime,
        });
      }
      showToast("success", "Transaction updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update transaction:", err);
      showToast("error", err instanceof Error ? err.message : "Failed to update transaction");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-white dark:bg-background-dark rounded-t-3xl shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-lg font-bold dark:text-white">
            Edit {transaction.type === "income" ? "Income" : "Expense"}
          </h2>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 dark:text-white"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all dark:text-white"
              placeholder="Enter description"
              type="text"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted">
              Category
            </label>
            {transaction.type === "expense" ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all dark:text-white"
                required
              >
                <option value="">Select category</option>
                {Object.entries(
                  categories.reduce<Record<string, CategoryItem[]>>((acc, item) => {
                    (acc[item.category_name] ??= []).push(item);
                    return acc;
                  }, {})
                ).map(([catName, items]) => (
                  <optgroup key={catName} label={catName}>
                    {items.map((item) => (
                      <option key={item.sub_category_name} value={item.sub_category_name}>
                        {item.sub_category_name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all dark:text-white"
                required
              >
                <option value="">Select category</option>
                {incomeCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Priority (Expense only) */}
          {transaction.type === "expense" && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold dark:text-white">
                Rp
              </span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all font-semibold dark:text-white"
                placeholder="0"
                type="number"
                inputMode="numeric"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted">
              Date & Time
            </label>
            <input
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all dark:text-white"
              type="datetime-local"
              required
            />
          </div>

          {/* Notes (Expense only) */}
          {transaction.type === "expense" && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all resize-none dark:text-white"
                placeholder="Add notes..."
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl font-semibold border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
