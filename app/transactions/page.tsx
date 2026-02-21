"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

/* ── SVG Icons ────────────────────────────────────── */
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
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
    id: number;
    name: string;
    time: string;
    category: string;
    amount: number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    badge: string;
};

/* ── Transaction Data (grouped by date) ───────────── */
const transactionGroups: { label: string; transactions: Transaction[] }[] = [
    {
        label: "Hari Ini",
        transactions: [
            {
                id: 1,
                name: "Tokopedia",
                time: "14:45",
                category: "Belanja",
                amount: -999000,
                icon: <ShoppingBagIcon />,
                iconBg: "bg-red-50 dark:bg-red-500/10",
                iconColor: "text-red-500",
                badge: "DEBIT",
            },
            {
                id: 2,
                name: "Gaji Bulanan",
                time: "09:00",
                category: "Pemasukan",
                amount: 15000000,
                icon: <WalletIcon />,
                iconBg: "bg-primary/10",
                iconColor: "text-primary",
                badge: "CREDIT",
            },
        ],
    },
    {
        label: "Kemarin",
        transactions: [
            {
                id: 3,
                name: "Starbucks Coffee",
                time: "16:12",
                category: "Makanan & Minuman",
                amount: -65000,
                icon: <CoffeeIcon />,
                iconBg: "bg-blue-50 dark:bg-blue-500/10",
                iconColor: "text-blue-500",
                badge: "DEBIT",
            },
            {
                id: 4,
                name: "Grab Ride",
                time: "11:30",
                category: "Transportasi",
                amount: -42000,
                icon: <CarIcon />,
                iconBg: "bg-orange-50 dark:bg-orange-500/10",
                iconColor: "text-orange-500",
                badge: "DEBIT",
            },
        ],
    },
    {
        label: "18 Feb 2026",
        transactions: [
            {
                id: 5,
                name: "Gym Membership",
                time: "08:00",
                category: "Kesehatan",
                amount: -350000,
                icon: <GymIcon />,
                iconBg: "bg-purple-50 dark:bg-purple-500/10",
                iconColor: "text-purple-500",
                badge: "SUBSCRIPTION",
            },
            {
                id: 6,
                name: "Tiket Pesawat",
                time: "23:45",
                category: "Travel",
                amount: -2450000,
                icon: <FlightIcon />,
                iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
                iconColor: "text-indigo-500",
                badge: "DEBIT",
            },
        ],
    },
    {
        label: "15 Feb 2026",
        transactions: [
            {
                id: 7,
                name: "Bayar Kos",
                time: "10:00",
                category: "Tempat Tinggal",
                amount: -3500000,
                icon: <HomeIcon />,
                iconBg: "bg-blue-50 dark:bg-blue-500/10",
                iconColor: "text-blue-600",
                badge: "DEBIT",
            },
            {
                id: 8,
                name: "Warteg Makan Siang",
                time: "12:30",
                category: "Makanan",
                amount: -25000,
                icon: <RestaurantIcon />,
                iconBg: "bg-orange-100 dark:bg-orange-900/30",
                iconColor: "text-orange-600",
                badge: "DEBIT",
            },
            {
                id: 9,
                name: "Transfer dari Teman",
                time: "15:00",
                category: "Pemasukan",
                amount: 500000,
                icon: <WalletIcon />,
                iconBg: "bg-primary/10",
                iconColor: "text-primary",
                badge: "CREDIT",
            },
        ],
    },
];

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

    return (
        <div className="relative flex h-dvh w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-background-light dark:bg-background-dark shadow-2xl">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 ios-blur px-4 pt-12 pb-4">
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
                {transactionGroups.map((group) => (
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
                ))}
            </main>
        </div>
    );
}
