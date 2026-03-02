"use client";

import { useState, useMemo } from "react";
import type { ExpenseAnalysisData, ExpenseChartCategory, AnalysisPeriod } from "@/lib/api/analysis";

/* ── Color palette for chart segments ───────────── */
const COLORS = [
    { hex: "#46ec13", tw: "bg-primary" },
    { hex: "#3b82f6", tw: "bg-accent-blue" },
    { hex: "#f97316", tw: "bg-accent-orange" },
    { hex: "#a855f7", tw: "bg-accent-purple" },
    { hex: "#ec4899", tw: "bg-pink-500" },
    { hex: "#14b8a6", tw: "bg-teal-500" },
    { hex: "#eab308", tw: "bg-yellow-500" },
    { hex: "#ef4444", tw: "bg-red-500" },
];

const PRIORITY_COLORS = [
    { color: "bg-expense-red", dot: "bg-expense-red" },
    { color: "bg-accent-orange", dot: "bg-accent-orange" },
    { color: "bg-primary", dot: "bg-primary" },
];

const periods = ["Day", "Month", "3 Months", "6 Months", "Year"] as const;

const INDONESIAN_MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function getToday() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
}

function formatDayLabel(dateStr: string) {
    const [, m, d] = dateStr.split("-");
    return `${parseInt(d)} ${SHORT_MONTHS[parseInt(m) - 1]}`;
}

function generateCalendarDays(year: number, month: number) {
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
}

/* ── SVG donut helpers ───────────────────────────── */
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ChartCategory {
    name: string;
    category_name: string;
    amount: number;
    percent: number;
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
    data: ExpenseAnalysisData | null;
    loading?: boolean;
    activePeriod: AnalysisPeriod;
    onPeriodChange: (period: AnalysisPeriod) => void;
    /** Called when user picks a specific date from the Day calendar */
    onDaySelect?: (date: string) => void;
    /** The currently selected day date string (YYYY-MM-DD) */
    selectedDay?: string;
}

export default function ExpenseAnalysis({ data, loading, activePeriod, onPeriodChange, onDaySelect, selectedDay }: Props) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    // Calendar state for "Day" picker
    const today = getToday();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const activeDayStr = selectedDay ?? todayStr;
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const [calYear, setCalYear] = useState(today.getFullYear());

    const handleOpenCalendar = () => {
        // Navigate calendar to the currently active day
        const [y, m] = activeDayStr.split("-").map(Number);
        setCalYear(y);
        setCalMonth(m - 1);
        setIsCalendarOpen(true);
    };

    const handleDateSelect = (dateStr: string) => {
        setIsCalendarOpen(false);
        onPeriodChange("Day");
        onDaySelect?.(dateStr);
    };

    const handleCalPrevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
        else setCalMonth(calMonth - 1);
    };

    const handleCalNextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
        else setCalMonth(calMonth + 1);
    };

    const categories: ChartCategory[] = useMemo(() => {
        if (!data) return [];
        return data.chart.categories
            .filter((c) => c.percent > 0)
            .map((c, i) => ({
                name: c.sub_category_name,
                category_name: c.category_name,
                amount: c.amount,
                percent: c.percent,
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

    const totalSpent = data?.summary.total_spent ?? 0;
    const topCategory = data?.top_category;
    const dailyAverage = data?.daily_average;
    const priorityDistribution = data?.priority_distribution;

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
                {periods.map((p) => {
                    const isDay = p === "Day";
                    const label = isDay ? formatDayLabel(activeDayStr) : p;
                    const isActive = activePeriod === p;
                    return (
                        <button
                            key={p}
                            onClick={() => isDay ? handleOpenCalendar() : onPeriodChange(p as AnalysisPeriod)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${isActive
                                ? "bg-primary text-[#131811]"
                                : "bg-zinc-100 dark:bg-zinc-800 text-muted"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* ── Donut Chart Section ── */}
            <section className="mt-4 p-6 bg-card-light dark:bg-zinc-900 rounded-3xl border border-border-light dark:border-border-dark">
                <div className="flex flex-col items-center">
                    <div className="relative size-56 flex items-center justify-center">
                        <svg viewBox="0 0 200 200" className="size-full -rotate-90">
                            {segments.map((seg, i) => (
                                <circle
                                    key={`${seg.name}-${i}`}
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
                                    <span className="text-[10px] text-muted font-medium uppercase tracking-tight">Total Spent</span>
                                    <span className="text-lg font-extrabold leading-tight mt-0.5 dark:text-white">Rp {formatCurrency(totalSpent)}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 w-full gap-4 mt-8">
                        {categories.map((cat, i) => (
                            <button
                                key={`${cat.name}-${i}`}
                                onClick={() => handleSegmentClick(i)}
                                className={`flex items-center gap-2 min-w-0 transition-opacity ${selectedIdx !== null && selectedIdx !== i ? "opacity-40" : ""}`}
                            >
                                <span className={`size-3 shrink-0 rounded-full ${cat.tw}`} />
                                <span className="text-xs font-bold dark:text-white truncate">{cat.name}</span>
                                <span className="text-xs text-muted ml-auto shrink-0">{cat.percent}%</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                    <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Top Category</p>
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold dark:text-white">{topCategory?.name ?? "-"}</p>
                    </div>
                    <p className="text-lg font-extrabold mt-2 dark:text-white">{topCategory?.total_display ?? "Rp 0"}</p>
                </div>

                <div className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                    <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Daily Avg</p>
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold dark:text-white">{dailyAverage?.label ?? "Average"}</p>
                    </div>
                    <p className="text-lg font-extrabold mt-2 dark:text-white">{dailyAverage?.amount_display ?? "Rp 0"}</p>
                </div>
            </div>

            {/* ── Priority Distribution ── */}
            {priorityDistribution && priorityDistribution.length > 0 && (
                <section className="mt-6 mb-8">
                    <h2 className="text-sm font-extrabold mb-4 flex items-center justify-between dark:text-white">
                        Priority Distribution
                        <span className="text-[10px] text-muted font-bold">THIS MONTH</span>
                    </h2>
                    <div className="space-y-3">
                        {(() => {
                            const totalPriority = priorityDistribution.reduce((sum, p) => sum + p.amount, 0) || 1;
                            return priorityDistribution.map((p, i) => {
                                const pct = Math.round((p.amount / totalPriority) * 100);
                                return (
                                    <div key={`${p.level}-${i}`} className="p-4 bg-card-light dark:bg-zinc-900 rounded-2xl border border-border-light dark:border-border-dark">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`size-2 rounded-full ${PRIORITY_COLORS[i % PRIORITY_COLORS.length].dot}`} />
                                                <span className="text-xs font-bold dark:text-white">{p.label}</span>
                                            </div>
                                            <span className="text-xs font-extrabold dark:text-white">{p.amount_display}</span>
                                        </div>
                                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                            <div className={`${PRIORITY_COLORS[i % PRIORITY_COLORS.length].color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </section>
            )}

            {/* ── Day Calendar Modal ── */}
            {isCalendarOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setIsCalendarOpen(false)}>
                    <div
                        className="w-full max-w-[430px] bg-background-light dark:bg-background-dark rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-extrabold dark:text-white">Pilih Tanggal</h2>
                            <button
                                onClick={() => setIsCalendarOpen(false)}
                                className="size-8 rounded-full bg-card-light dark:bg-card-dark flex items-center justify-center active:scale-95 transition-transform"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 dark:text-white">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Reset to today */}
                        {activeDayStr !== todayStr && (
                            <button
                                onClick={() => handleDateSelect(todayStr)}
                                className="w-full mb-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold text-sm active:scale-95 transition-transform"
                            >
                                Kembali ke Hari Ini
                            </button>
                        )}

                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={handleCalPrevMonth}
                                className="size-10 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark flex items-center justify-center active:scale-95 transition-transform"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5 dark:text-white">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <h3 className="text-lg font-extrabold dark:text-white">
                                {INDONESIAN_MONTHS[calMonth]} {calYear}
                            </h3>
                            <button
                                onClick={handleCalNextMonth}
                                className="size-10 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark flex items-center justify-center active:scale-95 transition-transform"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5 dark:text-white">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div>
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
                                    <div key={d} className="text-center text-xs font-bold text-muted">{d}</div>
                                ))}
                            </div>
                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-2">
                                {generateCalendarDays(calYear, calMonth).map((day, idx) => {
                                    if (day === null) return <div key={`e-${idx}`} />;
                                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                    const isSelected = activeDayStr === dateStr;
                                    const isToday = today.getDate() === day && today.getMonth() === calMonth && today.getFullYear() === calYear;
                                    return (
                                        <button
                                            key={day}
                                            onClick={() => handleDateSelect(dateStr)}
                                            className={`aspect-square rounded-xl flex items-center justify-center font-semibold text-sm transition-all active:scale-95 ${
                                                isSelected
                                                    ? "bg-primary text-[#131811] shadow-lg shadow-primary/20"
                                                    : isToday
                                                    ? "bg-primary/20 text-primary border-2 border-primary"
                                                    : "bg-card-light dark:bg-card-dark text-[#131811] dark:text-white border border-border-light dark:border-border-dark hover:border-primary"
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
