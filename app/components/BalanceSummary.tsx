"use client";

import { useTranslations } from "next-intl";
import { useTransactions } from "@/lib/hooks/useTransactions";

export default function BalanceSummary() {
    const t = useTranslations("BalanceSummary");
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

    const { transactions, isLoading, error } = useTransactions({
        date: today,
    });

    const totalExpense = transactions.reduce(
        (sum, group) => sum + (group.total_expense || 0),
        0
    );

    const formattedExpense = new Intl.NumberFormat("id-ID").format(totalExpense);

    return (
        <section className="py-8 text-center">
            <p className="text-muted text-sm font-medium mb-1">{t("todaysBalance")}</p>

            <h1 className="text-[36px] font-extrabold tracking-tight leading-tight dark:text-white">
                {isLoading ? "..." : error ? "-" : `Rp${formattedExpense}`}
            </h1>

            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {/* Receipt icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5"
                >
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
                    <line x1="9" y1="9" x2="15" y2="9" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="12" y2="17" />
                </svg>
                <span>{t("totalExpenses")}</span>
            </div>
        </section>
    );
}
