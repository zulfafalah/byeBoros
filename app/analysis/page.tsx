"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "../components/BottomNav";

/* ── Dummy data ──────────────────────────────────── */
const totalSpent = 4285000;

const categories = [
    { name: "Food & Drink", pct: 35, amount: 1499750, hex: "#46ec13", tw: "bg-primary" },
    { name: "Transport", pct: 25, amount: 1071250, hex: "#3b82f6", tw: "bg-accent-blue" },
    { name: "Rent", pct: 20, amount: 857000, hex: "#f97316", tw: "bg-accent-orange" },
    { name: "Other", pct: 20, amount: 857000, hex: "#a855f7", tw: "bg-accent-purple" },
];

const priorities = [
    { label: "High Priority", amount: 2850000, pct: 65, color: "bg-expense-red", dot: "bg-expense-red" },
    { label: "Medium Priority", amount: 935000, pct: 25, color: "bg-accent-orange", dot: "bg-accent-orange" },
    { label: "Low Priority", amount: 500000, pct: 10, color: "bg-primary", dot: "bg-primary" },
];

const periods = ["Day", "Month", "3 Months", "6 Months", "Year", "Custom"];

/* ── SVG donut helpers ───────────────────────────── */
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function buildSegments() {
    let offset = 0;
    return categories.map((cat) => {
        const dash = (cat.pct / 100) * CIRCUMFERENCE;
        const gap = CIRCUMFERENCE - dash;
        const seg = { ...cat, dashArray: `${dash} ${gap}`, dashOffset: -offset };
        offset += dash;
        return seg;
    });
}

const segments = buildSegments();

export default function AnalysisPage() {
    const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
    const [activePeriod, setActivePeriod] = useState("Month");
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("id-ID").format(value);

    const handleSegmentClick = (idx: number) => {
        setSelectedIdx((prev) => (prev === idx ? null : idx));
    };

    const selected = selectedIdx !== null ? categories[selectedIdx] : null;

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
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "expense"
                            ? "bg-card-light dark:bg-zinc-700 shadow-sm"
                            : "text-muted"
                            }`}
                    >
                        Expense Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab("income")}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "income"
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
                {/* Period pills */}
                <div className="flex overflow-x-auto gap-3 py-4 scrollbar-hide -mx-6 px-6">
                    {periods.map((p) => (
                        <button
                            key={p}
                            onClick={() => setActivePeriod(p)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${activePeriod === p
                                ? "bg-primary text-[#131811]"
                                : "bg-zinc-100 dark:bg-zinc-800 text-muted"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {/* ── Donut Chart Section ── */}
                <section className="mt-4 p-6 bg-card-light dark:bg-zinc-900 rounded-3xl border border-border-light dark:border-border-dark">
                    <div className="flex flex-col items-center">
                        {/* Interactive SVG Donut */}
                        <div className="relative size-56 flex items-center justify-center">
                            <svg viewBox="0 0 200 200" className="size-full -rotate-90">
                                {segments.map((seg, i) => (
                                    <circle
                                        key={seg.name}
                                        cx="100"
                                        cy="100"
                                        r={RADIUS}
                                        fill="none"
                                        stroke={seg.hex}
                                        strokeWidth={selectedIdx === null || selectedIdx === i ? 20 : 12}
                                        strokeDasharray={seg.dashArray}
                                        strokeDashoffset={seg.dashOffset}
                                        className="cursor-pointer transition-all duration-300"
                                        style={{
                                            opacity: selectedIdx === null || selectedIdx === i ? 1 : 0.3,
                                        }}
                                        onClick={() => handleSegmentClick(i)}
                                    />
                                ))}
                            </svg>

                            {/* Center label */}
                            <div
                                className="absolute size-36 bg-card-light dark:bg-zinc-900 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all px-3 text-center"
                                onClick={() => setSelectedIdx(null)}
                            >
                                {selected ? (
                                    <>
                                        <span className="text-[10px] text-muted font-medium leading-tight">{selected.name}</span>
                                        <span className="text-base font-extrabold leading-tight mt-0.5">Rp {formatCurrency(selected.amount)}</span>
                                        <span className="text-[10px] font-bold mt-0.5" style={{ color: selected.hex }}>{selected.pct}%</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[10px] text-muted font-medium">Total Spent</span>
                                        <span className="text-lg font-extrabold leading-tight mt-0.5">Rp {formatCurrency(totalSpent)}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 w-full gap-4 mt-8">
                            {categories.map((cat, i) => (
                                <button
                                    key={cat.name}
                                    onClick={() => handleSegmentClick(i)}
                                    className={`flex items-center gap-2 transition-opacity ${selectedIdx !== null && selectedIdx !== i ? "opacity-40" : ""}`}
                                >
                                    <span className={`size-3 rounded-full ${cat.tw}`} />
                                    <span className="text-xs font-bold">{cat.name}</span>
                                    <span className="text-xs text-muted ml-auto">{cat.pct}%</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    {/* Top Category */}
                    <div className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                        <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Top Category</p>
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                    <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                                </svg>
                            </div>
                            <p className="text-sm font-bold">Food</p>
                        </div>
                        <p className="text-lg font-extrabold mt-2">Rp {formatCurrency(1499000)}</p>
                    </div>

                    {/* Daily Average */}
                    <div className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                        <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Daily Avg</p>
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-lg bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <p className="text-sm font-bold">Average</p>
                        </div>
                        <p className="text-lg font-extrabold mt-2">Rp {formatCurrency(142800)}</p>
                    </div>
                </div>

                {/* ── Priority Distribution ── */}
                <section className="mt-6 mb-8">
                    <h2 className="text-sm font-extrabold mb-4 flex items-center justify-between">
                        Priority Distribution
                        <span className="text-[10px] text-muted font-bold">THIS MONTH</span>
                    </h2>
                    <div className="space-y-3">
                        {priorities.map((p) => (
                            <div key={p.label} className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`size-2 rounded-full ${p.dot}`} />
                                        <span className="text-xs font-bold">{p.label}</span>
                                    </div>
                                    <span className="text-xs font-extrabold">Rp {formatCurrency(p.amount)}</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                    <div className={`${p.color} h-full rounded-full transition-all`} style={{ width: `${p.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* ── Bottom Nav ── */}
            <BottomNav />
        </div>
    );
}
