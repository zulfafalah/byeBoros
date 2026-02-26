"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { getTransactions } from "@/lib/api/transactions";


/* ── SVG Icons ────────────────────────────────────── */
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5 dark:text-white">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

/* ── Category Icon Components ─────────────────────── */
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

/* ── Data Types ───────────────────────────────────── */
type Transaction = {
    id: number | string;
    name: string;
    time: string;
    category: string;
    amount: number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    badge: string;
};

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

/* ── Helpers ──────────────────────────────────────── */
function formatAmount(amount: number) {
    const abs = Math.abs(amount).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return amount >= 0 ? `+${abs}` : `-${abs}`;
}

/* ── Page ─────────────────────────────────────────── */
export default function TransactionsPage() {
    const t = useTranslations("Transactions");
    const [transactionGroups, setTransactionGroups] = useState<{ label: string; transactions: Transaction[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Fetch all transactions without date filter
                const res = await getTransactions();

                if (res?.data?.transactions) {
                    const mappedGroups = res.data.transactions.map((group) => {
                        return {
                            label: group.group_label,
                            transactions: group.items.map((item) => {
                                const design = getCategoryDesign(item.category);
                                return {
                                    id: item.id,
                                    name: item.transaction_name,
                                    time: item.time,
                                    category: item.category,
                                    amount: item.amount,
                                    icon: design.icon,
                                    iconBg: design.iconBg,
                                    iconColor: design.iconColor,
                                    badge: item.type === "expense" ? "PENGELUARAN" : "PEMASUKAN"
                                };
                            })
                        };
                    });
                    setTransactionGroups(mappedGroups);
                }
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="relative flex h-dvh w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-background-light dark:bg-background-dark shadow-2xl">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 ios-blur px-4 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center size-10 rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm active:scale-95 transition-transform"
                    >
                        <ChevronLeftIcon />
                    </Link>
                    <h1 className="text-xl font-extrabold tracking-tight dark:text-white">
                        {t("title")}
                    </h1>
                    <Link
                        href="/expense"
                        className="flex items-center justify-center size-10 rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm active:scale-95 transition-transform"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-5 text-primary">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </Link>
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-white font-semibold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                        <FilterIcon />
                        <span>{t("filter")}</span>
                    </button>
                    <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-card-light dark:bg-card-dark px-4 text-[#131811] dark:text-white border border-border-light dark:border-border-dark font-medium text-sm active:scale-95 transition-transform">
                        <span>{t("date")}</span>
                        <ChevronDownIcon />
                    </button>
                    <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-card-light dark:bg-card-dark px-4 text-[#131811] dark:text-white border border-border-light dark:border-border-dark font-medium text-sm active:scale-95 transition-transform">
                        <span>{t("category")}</span>
                        <ChevronDownIcon />
                    </button>
                    <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-card-light dark:bg-card-dark px-4 text-[#131811] dark:text-white border border-border-light dark:border-border-dark font-medium text-sm active:scale-95 transition-transform">
                        <span>{t("amount")}</span>
                        <ChevronDownIcon />
                    </button>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto px-4 pb-8 space-y-6 scrollbar-hide">
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <svg className="animate-spin size-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                ) : transactionGroups.length === 0 ? (
                    <div className="text-center text-muted font-medium py-10">
                        {t("noTransactions") || "No transactions found."}
                    </div>
                ) : (
                    transactionGroups.map((group) => (
                        <section key={group.label}>
                            <h3 className="text-sm font-extrabold text-[#131811]/50 dark:text-white/50 uppercase tracking-widest mb-3 px-1">
                                {group.label}
                            </h3>
                            <div className="space-y-3">
                                {group.transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm transition-transform active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`size-12 rounded-xl ${tx.iconBg} ${tx.iconColor} flex items-center justify-center`}>
                                                {tx.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base dark:text-white">{tx.name}</h4>
                                                <p className="text-xs text-muted">
                                                    {tx.category} • {tx.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-extrabold text-base ${tx.amount >= 0 ? "text-primary" : "text-expense-red"}`}>
                                                {formatAmount(tx.amount)}
                                            </p>
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tx.amount >= 0
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-red-100 dark:bg-red-500/20 text-red-600"
                                                    }`}
                                            >
                                                {tx.badge}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </main>
        </div>
    );
}
