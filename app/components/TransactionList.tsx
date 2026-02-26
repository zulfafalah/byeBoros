"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTransactions } from "@/lib/hooks/useTransactions";
import type { TransactionItem } from "@/lib/api/types";


/* ── SVG Icons ────────────────────────────────────── */
const RestaurantIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const ShoppingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

/* ── Category → icon/style mapping ────────────────── */
const CATEGORY_STYLES: Record<string, { icon: React.ReactNode; iconBg: string; iconColor: string }> = {
    Food: {
        icon: <RestaurantIcon />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600",
    },
    Housing: {
        icon: <HomeIcon />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600",
    },
    Income: {
        icon: <WalletIcon />,
        iconBg: "bg-primary/20",
        iconColor: "text-primary",
    },
    Shopping: {
        icon: <ShoppingIcon />,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600",
    },
};

const DEFAULT_STYLE = {
    icon: <WalletIcon />,
    iconBg: "bg-gray-100 dark:bg-gray-900/30",
    iconColor: "text-gray-600",
};

function getCategoryStyle(category: string) {
    return CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
}

/* ── Skeleton loader ──────────────────────────────── */
function TransactionSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark animate-pulse"
                >
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-gray-200 dark:bg-zinc-700" />
                        <div className="space-y-2">
                            <div className="h-3 w-28 rounded bg-gray-200 dark:bg-zinc-700" />
                            <div className="h-2 w-20 rounded bg-gray-200 dark:bg-zinc-700" />
                        </div>
                    </div>
                    <div className="h-3 w-16 rounded bg-gray-200 dark:bg-zinc-700" />
                </div>
            ))}
        </div>
    );
}

export default function TransactionList() {
    const t = useTranslations("TransactionList");

    const today = new Date().toISOString().split("T")[0];

    const { transactions, isLoading, error } = useTransactions({
        date: today,
    });

    // Flatten all items from all groups for the "recent" view
    const allItems: TransactionItem[] = transactions.flatMap((g) => g.items);

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold dark:text-white">{t("recentTransactions")}</h2>
                <Link href="/transactions" className="text-primary text-sm font-bold active:opacity-70 transition-opacity">
                    {t("seeAll")}
                </Link>
            </div>

            {/* Loading state */}
            {isLoading && <TransactionSkeleton />}

            {/* Error state */}
            {error && !isLoading && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && allItems.length === 0 && (
                <div className="p-8 text-center">
                    <p className="text-sm text-muted font-medium">No transactions today</p>
                </div>
            )}

            {/* Transaction list */}
            {!isLoading && !error && allItems.length > 0 && (
                <div className="space-y-3">
                    {allItems.map((tx) => {
                        const style = getCategoryStyle(tx.category);
                        return (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark transition-transform active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`size-10 rounded-lg ${style.iconBg} ${style.iconColor} flex items-center justify-center`}
                                    >
                                        {style.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold dark:text-white">{tx.transaction_name}</p>
                                        <p className="text-[11px] text-muted">
                                            {tx.time} • {tx.category}
                                        </p>
                                    </div>
                                </div>

                                <p
                                    className={`text-sm font-extrabold ${tx.type === "income" ? "text-primary" : "text-expense-red"}`}
                                >
                                    {tx.amount_display}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
