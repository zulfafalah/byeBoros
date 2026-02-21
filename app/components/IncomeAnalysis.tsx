"use client";

import { useState, useMemo } from "react";

/* ── Data ────────────────────────────────────────── */
const totalIncome = 8540000;

const categories = [
    { name: "Salary", pct: 70, amount: 5978000, hex: "#22c55e", tw: "bg-income-green" },
    { name: "Freelance", pct: 20, amount: 1708000, hex: "#14b8a6", tw: "bg-income-teal" },
    { name: "Dividends", pct: 10, amount: 854000, hex: "#84cc16", tw: "bg-income-lime" },
];

const sources = [
    { label: "Primary Salary", amount: 5978000, pct: 100, color: "bg-income-green", dot: "bg-income-green" },
    { label: "Freelance Projects", amount: 1708000, pct: 28, color: "bg-income-teal", dot: "bg-income-teal" },
    { label: "Investment Dividends", amount: 854000, pct: 14, color: "bg-income-lime", dot: "bg-income-lime" },
];

const periods = ["Day", "Month", "3 Months", "6 Months", "Year", "Custom"];

/* ── SVG donut helpers ───────────────────────────── */
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function buildSegments(cats: typeof categories) {
    let offset = 0;
    return cats.map((cat) => {
        const dash = (cat.pct / 100) * CIRCUMFERENCE;
        const gap = CIRCUMFERENCE - dash;
        const seg = { ...cat, dashArray: `${dash} ${gap}`, dashOffset: -offset };
        offset += dash;
        return seg;
    });
}

/* ═══════════════════════════════════════════════════ */

export default function IncomeAnalysis() {
    const [activePeriod, setActivePeriod] = useState("Month");
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const segments = useMemo(() => buildSegments(categories), []);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("id-ID").format(value);

    const handleSegmentClick = (idx: number) => {
        setSelectedIdx((prev) => (prev === idx ? null : idx));
    };

    const selected = selectedIdx !== null ? categories[selectedIdx] : null;

    return (
        <>
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
                                    style={{ opacity: selectedIdx === null || selectedIdx === i ? 1 : 0.3 }}
                                    onClick={() => handleSegmentClick(i)}
                                />
                            ))}
                        </svg>

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
                                    <span className="text-[10px] text-muted font-medium uppercase tracking-tight">Total Income</span>
                                    <span className="text-lg font-extrabold leading-tight mt-0.5">Rp {formatCurrency(totalIncome)}</span>
                                </>
                            )}
                        </div>
                    </div>

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
                <div className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                    <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Top Income Source</p>
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-income-green/10 text-income-green flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold">Salary</p>
                    </div>
                    <p className="text-lg font-extrabold mt-2">Rp {formatCurrency(5978000)}</p>
                </div>

                <div className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                    <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Daily Avg</p>
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-income-teal/10 text-income-teal flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold">Average</p>
                    </div>
                    <p className="text-lg font-extrabold mt-2">Rp {formatCurrency(284600)}</p>
                </div>
            </div>

            {/* ── Source Consistency ── */}
            <section className="mt-6 mb-8">
                <h2 className="text-sm font-extrabold mb-4 flex items-center justify-between">
                    Source Consistency
                    <span className="text-[10px] text-muted font-bold">THIS MONTH</span>
                </h2>
                <div className="space-y-3">
                    {sources.map((s) => (
                        <div key={s.label} className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`size-2 rounded-full ${s.dot}`} />
                                    <span className="text-xs font-bold">{s.label}</span>
                                </div>
                                <span className="text-xs font-extrabold">Rp {formatCurrency(s.amount)}</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div className={`${s.color} h-full rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
