"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTransactions } from "@/lib/hooks/useTransactions";
import type { TransactionItem } from "@/lib/api/types";
import EditTransactionModal from "./EditTransactionModal";


/* ── SVG Icons ────────────────────────────────────── */
const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const CoffeeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
);

const CarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
);

const GymIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M6 20V4" /><path d="M18 20V4" /><path d="M4 8v8" /><path d="M20 8v8" /><path d="M2 10v4" /><path d="M22 10v4" />
    </svg>
);

const FlightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const RestaurantIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
);

/* ── Category Icon Mapper ─────────────────────────── */
function getCategoryDesign(category: string) {
    const defaultDesign = { icon: <ShoppingBagIcon />, iconBg: "bg-gray-50 dark:bg-gray-800/10", iconColor: "text-gray-500" };
    if (!category) return defaultDesign;

    const lower = category.toLowerCase();

    // Food & Groceries
    if (lower.includes("makan") || lower.includes("minum") || lower.includes("restoran") || lower.includes("jajanan")) return { icon: <RestaurantIcon />, iconBg: "bg-orange-100 dark:bg-orange-900/30", iconColor: "text-orange-600" };
    if (lower.includes("cafe") || lower.includes("coffee")) return { icon: <CoffeeIcon />, iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600" };
    if (lower.includes("belanja") || lower.includes("groceries") || lower.includes("baju") || lower.includes("skincare") || lower.includes("gadget") || lower.includes("aksesoris")) return { icon: <ShoppingBagIcon />, iconBg: "bg-pink-50 dark:bg-pink-500/10", iconColor: "text-pink-500" };

    // Housing & Living
    if (lower.includes("sewa") || lower.includes("kpr") || lower.includes("listrik") || lower.includes("air") || lower.includes("kebersihan") || lower.includes("maintenance") || lower.includes("tinggal") || lower.includes("kos")) return { icon: <HomeIcon />, iconBg: "bg-blue-50 dark:bg-blue-500/10", iconColor: "text-blue-600" };

    // Transportation
    if (lower.includes("bensin") || lower.includes("bbm") || lower.includes("parkir") || lower.includes("tol") || lower.includes("transportasi") || lower.includes("service") || lower.includes("motor") || lower.includes("mobil")) return { icon: <CarIcon />, iconBg: "bg-teal-50 dark:bg-teal-500/10", iconColor: "text-teal-600" };
    if (lower.includes("pesawat") || lower.includes("flight") || lower.includes("travel")) return { icon: <FlightIcon />, iconBg: "bg-indigo-50 dark:bg-indigo-500/10", iconColor: "text-indigo-500" };

    // Health
    if (lower.includes("obat") || lower.includes("vitamin") || lower.includes("bpjs") || lower.includes("asuransi kesehatan") || lower.includes("dokter") || lower.includes("sehat")) return { icon: <GymIcon />, iconBg: "bg-emerald-50 dark:bg-emerald-500/10", iconColor: "text-emerald-600" };

    // Digital, Bills & Subscriptions
    if (lower.includes("internet") || lower.includes("wifi") || lower.includes("pulsa") || lower.includes("paket data") || lower.includes("streaming") || lower.includes("cloud") || lower.includes("software")) return { icon: <WalletIcon />, iconBg: "bg-violet-50 dark:bg-violet-500/10", iconColor: "text-violet-600" };

    // Work & Education
    if (lower.includes("peralatan kerja") || lower.includes("coworking") || lower.includes("kursus") || lower.includes("buku") || lower.includes("workshop")) return { icon: <WalletIcon />, iconBg: "bg-cyan-50 dark:bg-cyan-500/10", iconColor: "text-cyan-600" };

    // Entertainment, Hobbies
    if (lower.includes("nonton") || lower.includes("hobi") || lower.includes("gym")) return { icon: <GymIcon />, iconBg: "bg-purple-50 dark:bg-purple-500/10", iconColor: "text-purple-500" };

    // Social, Family & Charity
    if (lower.includes("hadiah") || lower.includes("donasi") || lower.includes("kondangan") || lower.includes("thr") || lower.includes("orang tua") || lower.includes("adik") || lower.includes("kakak") || lower.includes("saudara")) return { icon: <ShoppingBagIcon />, iconBg: "bg-rose-50 dark:bg-rose-500/10", iconColor: "text-rose-500" };

    // Financial & Income
    if (lower.includes("cicilan") || lower.includes("piutang") || lower.includes("admin") || lower.includes("darurat")) return { icon: <WalletIcon />, iconBg: "bg-slate-100 dark:bg-slate-800/10", iconColor: "text-slate-600" };
    if (lower.includes("gaji") || lower.includes("pemasukan") || lower.includes("income") || lower.includes("salary")) return { icon: <WalletIcon />, iconBg: "bg-primary/10", iconColor: "text-primary" };

    return defaultDesign;
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

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

    const { transactions, isLoading, error, refetch } = useTransactions({
        date: today,
    });

    const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string }>({
        show: false,
        type: "success",
        message: "",
    });

    const showToast = useCallback((type: "success" | "error", message: string) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    }, []);

    const handleTransactionClick = (tx: TransactionItem) => {
        setSelectedTransaction(tx);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const handleUpdateSuccess = () => {
        refetch();
    };

    // Flatten all items from all groups for the "recent" view
    const allItems: TransactionItem[] = transactions.flatMap((g) => g.items);

    return (
        <section className="relative">
            {/* Toast Notification - Fixed at screen top */}
            <div
                className={`fixed top-0 left-0 right-0 z-[60] max-w-[430px] mx-auto transition-all duration-500 ease-out ${
                    toast.show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
            >
                <div
                    className={`mx-4 mt-4 px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 ${
                        toast.type === "success"
                            ? "bg-emerald-500 text-white shadow-emerald-500/30"
                            : "bg-red-500 text-white shadow-red-500/30"
                    }`}
                >
                    <div
                        className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            toast.type === "success" ? "bg-white/20" : "bg-white/20"
                        }`}
                    >
                        {toast.type === "success" ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-4"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-4"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm font-bold">{toast.message}</span>
                </div>
            </div>

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
                        const design = getCategoryDesign(tx.category);
                        return (
                            <button
                                key={tx.id}
                                onClick={() => handleTransactionClick(tx)}
                                className="w-full flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark transition-transform active:scale-[0.98] hover:border-primary cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`size-10 rounded-lg ${design.iconBg} ${design.iconColor} flex items-center justify-center`}
                                    >
                                        {design.icon}
                                    </div>
                                    <div className="text-left">
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
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Edit Transaction Modal */}
            <EditTransactionModal
                transaction={selectedTransaction}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={handleUpdateSuccess}
                showToast={showToast}
            />
        </section>
    );
}
