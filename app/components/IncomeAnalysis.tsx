"use client";

import { useState, useMemo } from "react";
import type { IncomeAnalysisData, AnalysisCategory, AnalysisPeriod } from "@/lib/api/analysis";

/* ── Color palette for chart segments ───────────── */
const COLORS = [
    { hex: "#22c55e", tw: "bg-income-green" },
    { hex: "#14b8a6", tw: "bg-income-teal" },
    { hex: "#84cc16", tw: "bg-income-lime" },
    { hex: "#3b82f6", tw: "bg-accent-blue" },
    { hex: "#a855f7", tw: "bg-accent-purple" },
    { hex: "#f97316", tw: "bg-accent-orange" },
    { hex: "#ec4899", tw: "bg-pink-500" },
    { hex: "#eab308", tw: "bg-yellow-500" },
];

const SOURCE_COLORS = [
    { color: "bg-income-green", dot: "bg-income-green" },
    { color: "bg-income-teal", dot: "bg-income-teal" },
    { color: "bg-income-lime", dot: "bg-income-lime" },
    { color: "bg-accent-blue", dot: "bg-accent-blue" },
    { color: "bg-accent-purple", dot: "bg-accent-purple" },
];

const periods = ["Day", "Month", "3 Months", "6 Months", "Year"];

/* ── SVG donut helpers ───────────────────────────── */
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ChartCategory extends AnalysisCategory {
    hex: string;
    tw: string;
}

function buildSegments(cats: ChartCategory[]) {
    let offset = 0;
    return cats.map((cat) => {
        const dash = (cat.percent / 100) * CIRCUMFERENCE;
        const gap = CIRCUMFERENCE - dash;
        const seg = { ...cat, dashArray: `${dash} ${gap}`, dashOffset: -offset };
        offset += dash;
        return seg;
    });
}

/* ═══════════════════════════════════════════════════ */

interface Props {
    data: IncomeAnalysisData | null;
    loading?: boolean;
    activePeriod: AnalysisPeriod;
    onPeriodChange: (period: AnalysisPeriod) => void;
}

export default function IncomeAnalysis({ data, loading, activePeriod, onPeriodChange }: Props) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const categories: ChartCategory[] = useMemo(() => {
        if (!data) return [];
        return data.chart.categories
            .filter((c) => c.percent > 0)
            .map((c, i) => ({
                ...c,
                hex: COLORS[i % COLORS.length].hex,
                tw: COLORS[i % COLORS.length].tw,
            }));
    }, [data]);

    const segments = useMemo(() => buildSegments(categories), [categories]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("id-ID").format(value);

    const handleSegmentClick = (idx: number) => {
        setSelectedIdx((prev) => (prev === idx ? null : idx));
    };

    const selected = selectedIdx !== null ? categories[selectedIdx] : null;

    const totalIncome = data?.summary.total_income ?? 0;
    const topCategory = data?.top_category;
    const dailyAverage = data?.daily_average;

    // Build sources from categories for the "Source Consistency" section
    const sources = useMemo(() => {
        if (!data) return [];
        const maxAmount = Math.max(...data.chart.categories.map((c) => c.amount), 1);
        return data.chart.categories
            .filter((c) => c.amount > 0)
            .map((c, i) => ({
                label: c.name,
                amount: c.amount,
                pct: Math.round((c.amount / maxAmount) * 100),
                ...SOURCE_COLORS[i % SOURCE_COLORS.length],
            }));
    }, [data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            {/* Period pills */}
            <div className="flex overflow-x-auto gap-3 py-4 scrollbar-hide -mx-6 px-6">
                {periods.map((p) => (
                    <button
                        key={p}
                        onClick={() => onPeriodChange(p as AnalysisPeriod)}
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
                                    <span className="text-base font-extrabold leading-tight mt-0.5 dark:text-white">Rp {formatCurrency(selected.amount)}</span>
                                    <span className="text-[10px] font-bold mt-0.5" style={{ color: selected.hex }}>{selected.percent}%</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[10px] text-muted font-medium uppercase tracking-tight">Total Income</span>
                                    <span className="text-lg font-extrabold leading-tight mt-0.5 dark:text-white">Rp {formatCurrency(totalIncome)}</span>
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
                                <span className="text-xs font-bold dark:text-white">{cat.name}</span>
                                <span className="text-xs text-muted ml-auto">{cat.percent}%</span>
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
                        <p className="text-sm font-bold dark:text-white">{topCategory?.name ?? "-"}</p>
                    </div>
                    <p className="text-lg font-extrabold mt-2 dark:text-white">{topCategory?.total_display ?? "Rp 0"}</p>
                </div>

                <div className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                    <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Daily Avg</p>
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-income-teal/10 text-income-teal flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold dark:text-white">{dailyAverage?.label ?? "Average"}</p>
                    </div>
                    <p className="text-lg font-extrabold mt-2 dark:text-white">{dailyAverage?.amount_display ?? "Rp 0"}</p>
                </div>
            </div>

            {/* ── Source Consistency ── */}
            {sources.length > 0 && (
                <section className="mt-6 mb-8">
                    <h2 className="text-sm font-extrabold mb-4 flex items-center justify-between dark:text-white">
                        Source Consistency
                        <span className="text-[10px] text-muted font-bold">THIS MONTH</span>
                    </h2>
                    <div className="space-y-3">
                        {sources.map((s, i) => (
                            <div key={s.label} className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`size-2 rounded-full ${s.dot}`} />
                                        <span className="text-xs font-bold dark:text-white">{s.label}</span>
                                    </div>
                                    <span className="text-xs font-extrabold dark:text-white">Rp {formatCurrency(s.amount)}</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                    <div className={`${s.color} h-full rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
