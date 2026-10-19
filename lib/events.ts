"use client";

const TRANSACTIONS_CHANGED = "byeboros:transactions-changed";

/** Notify any mounted data hooks that transactions have changed. */
export function notifyTransactionsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TRANSACTIONS_CHANGED));
}

/** Subscribe to transaction changes. Returns an unsubscribe function. */
export function onTransactionsChanged(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(TRANSACTIONS_CHANGED, callback);
  return () => window.removeEventListener(TRANSACTIONS_CHANGED, callback);
}
