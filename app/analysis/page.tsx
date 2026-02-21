"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "../components/BottomNav";
import ExpenseAnalysis from "../components/ExpenseAnalysis";
import IncomeAnalysis from "../components/IncomeAnalysis";

export default function AnalysisPage() {
    const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
    const isExpense = activeTab === "expense";

    return (
        <div className="relative flex h-dvh w-full flex-col max-w-[430px] mx-auto bg-background-light dark:bg-background-dark shadow-2xl">
            {/* ── Header ── */}
            <header className="px-6 pt-12 pb-4 bg-background-light dark:bg-background-dark">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/"
                        className="size-10 flex items-center justify-center rounded-full bg-card-light dark:bg-card-dark shadow-sm border border-border-light dark:border-border-dark transition-colors active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold">Analysis</h1>
                    <button className="size-10 flex items-center justify-center rounded-full bg-card-light dark:bg-card-dark shadow-sm border border-border-light dark:border-border-dark transition-colors active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button>
                </div>

                {/* Expense / Income toggle */}
                <div className="p-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl flex">
                    <button
                        onClick={() => setActiveTab("expense")}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isExpense
                            ? "bg-card-light dark:bg-zinc-700 shadow-sm"
                            : "text-muted"
                            }`}
                    >
                        Expense Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab("income")}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isExpense
                            ? "bg-card-light dark:bg-zinc-700 shadow-sm"
                            : "text-muted"
                            }`}
                    >
                        Income Analysis
                    </button>
                </div>
            </header>

            {/* ── Scrollable Content ── */}
            <main className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
                {isExpense ? <ExpenseAnalysis /> : <IncomeAnalysis />}
            </main>

            {/* ── Bottom Nav ── */}
            <BottomNav />
        </div>
    );
}
