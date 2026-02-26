"use client";

import { useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getCategories, updateCategories, CategoryItem } from "@/lib/api/category";

/* ── Group helper ──────────────────────────────────── */
interface CategoryGroup {
    category_name: string;
    items: CategoryItem[];
    total: number;
}

function groupByCategory(items: CategoryItem[]): CategoryGroup[] {
    const map = new Map<string, CategoryItem[]>();
    for (const item of items) {
        const list = map.get(item.category_name) ?? [];
        list.push(item);
        map.set(item.category_name, list);
    }
    return Array.from(map.entries()).map(([category_name, items]) => ({
        category_name,
        items,
        total: items.reduce((sum, i) => sum + i.budget, 0),
    }));
}

/* ── SVG Icons ───────────────────────────────────────── */
const svgIcon = (paths: ReactNode) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        {paths}
    </svg>
);

const icons: Record<string, ReactNode> = {
    restaurant: svgIcon(<><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></>),
    home: svgIcon(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
    car: svgIcon(<><rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>),
    health: svgIcon(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />),
    phone: svgIcon(<><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>),
    coffee: svgIcon(<><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></>),
    shopping: svgIcon(<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>),
    briefcase: svgIcon(<><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>),
    users: svgIcon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
    movie: svgIcon(<><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" /></>),
    education: svgIcon(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>),
    wallet: svgIcon(<><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>),
    family: svgIcon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
    default: svgIcon(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>),
};

/* ── Category style mapping ──────────────────────────── */
const categoryStyles: Record<string, { text: string; bg: string; iconKey: string }> = {
    "Kebutuhan Harian": { text: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", iconKey: "restaurant" },
    "Tempat Tinggal": { text: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", iconKey: "home" },
    "Transportasi": { text: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10", iconKey: "car" },
    "Kesehatan": { text: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10", iconKey: "health" },
    "Komunikasi & Langganan": { text: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10", iconKey: "phone" },
    "Makan di Luar / Nongkrong": { text: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", iconKey: "coffee" },
    "Belanja Pribadi": { text: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10", iconKey: "shopping" },
    "Kerja / Produktivitas": { text: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", iconKey: "briefcase" },
    "Sosial": { text: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", iconKey: "users" },
    "Hiburan": { text: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", iconKey: "movie" },
    "Pendidikan / Pengembangan Diri": { text: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10", iconKey: "education" },
    "Keuangan": { text: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10", iconKey: "wallet" },
    "Keluarga": { text: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", iconKey: "family" },
};

const defaultStyle = { text: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-500/10", iconKey: "default" };

function getStyle(name: string) {
    return categoryStyles[name] ?? defaultStyle;
}

/* ═══════════════════════════════════════════════════════ */

export default function BudgetPage() {
    const t = useTranslations("Budget");

    /* ── State ──────────────────────────────────── */
    const [dailyBudget, setDailyBudget] = useState(0);
    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    /* toast state */
    const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string }>({ show: false, type: "success", message: "" });

    const showToast = useCallback((type: "success" | "error", message: string) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    }, []);

    /* modal state */
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newSubCategoryName, setNewSubCategoryName] = useState("");
    const [newBudget, setNewBudget] = useState("");

    /* ── Fetch on mount ────────────────────────── */
    useEffect(() => {
        getCategories()
            .then((res) => {
                // Handle both wrapped { data: { ... } } and direct response
                const data = (res as unknown as { data?: typeof res })?.data ?? res;
                setDailyBudget(data.daily_budget);
                setMonthlyBudget(data.monthly_budget);
                setCategories(data.categories);
                // Expand all groups initially
                const names = new Set(data.categories.map((c: CategoryItem) => c.category_name));
                setExpandedGroups(names);
            })
            .catch((err) => {
                console.error("Failed to fetch categories:", err);
                setError(err instanceof Error ? err.message : "Failed to load budget data");
            })
            .finally(() => setLoading(false));
    }, []);

    /* ── Grouped categories ────────────────────── */
    const groups = useMemo(() => groupByCategory(categories), [categories]);

    const totalBudget = useMemo(
        () => categories.reduce((sum, c) => sum + c.budget, 0),
        [categories]
    );

    /* ── Handlers ──────────────────────────────── */
    const parseCurrency = (value: string): number => {
        return Number(value.replace(/\./g, "")) || 0;
    };

    const handleBudgetChange = (categoryName: string, subCategoryName: string, value: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.category_name === categoryName && c.sub_category_name === subCategoryName
                    ? { ...c, budget: parseCurrency(value) }
                    : c
            )
        );
    };

    const toggleGroup = (name: string) => {
        setExpandedGroups((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateCategories({
                daily_budget: dailyBudget,
                monthly_budget: monthlyBudget,
                categories,
            });
            showToast("success", "Budget berhasil disimpan!");
        } catch (err) {
            console.error("Failed to save budget:", err);
            showToast("error", err instanceof Error ? err.message : "Gagal menyimpan budget");
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID").format(value);

    const openModal = () => {
        setNewCategoryName("");
        setNewSubCategoryName("");
        setNewBudget("");
        setShowModal(true);
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim() || !newSubCategoryName.trim()) return;
        const newItem: CategoryItem = {
            category_name: newCategoryName.trim(),
            sub_category_name: newSubCategoryName.trim(),
            budget: Number(newBudget) || 0,
        };
        setCategories((prev) => [...prev, newItem]);
        setExpandedGroups((prev) => new Set(prev).add(newItem.category_name));
        setShowModal(false);
    };

    /* existing category names for suggestions */
    const existingCategoryNames = useMemo(
        () => Array.from(new Set(categories.map((c) => c.category_name))),
        [categories]
    );

    /* ── Loading state ─────────────────────────── */
    if (loading) {
        return (
            <div className="relative flex min-h-dvh w-full flex-col max-w-[430px] mx-auto bg-white dark:bg-background-dark shadow-2xl items-center justify-center">
                <svg className="animate-spin size-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="mt-3 text-sm text-muted font-medium">Loading budget...</p>
            </div>
        );
    }

    /* ── Error state ───────────────────────────── */
    if (error) {
        return (
            <div className="relative flex min-h-dvh w-full flex-col max-w-[430px] mx-auto bg-white dark:bg-background-dark shadow-2xl items-center justify-center p-6">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-sm text-red-500 font-medium text-center">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-primary text-[#131811] font-bold rounded-xl text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="relative flex h-dvh w-full flex-col max-w-[430px] mx-auto bg-white dark:bg-background-dark shadow-2xl">
            {/* Toast Notification */}
            <div
                className={`fixed top-0 left-0 right-0 z-[60] max-w-[430px] mx-auto transition-all duration-500 ease-out ${toast.show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                    }`}
            >
                <div className={`mx-4 mt-4 px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 ${toast.type === "success"
                    ? "bg-emerald-500 text-white shadow-emerald-500/30"
                    : "bg-red-500 text-white shadow-red-500/30"
                    }`}>
                    <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === "success" ? "bg-white/20" : "bg-white/20"
                        }`}>
                        {toast.type === "success" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm font-bold">{toast.message}</span>
                </div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-background-dark/80 ios-blur px-4 py-4 border-b border-border-light dark:border-border-dark">
                <Link
                    href="/"
                    className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5 dark:text-white">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </Link>
                <h1 className="text-lg font-bold tracking-tight dark:text-white">{t("title")}</h1>
                <div className="size-10" />
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto px-4 pb-32 space-y-6 scrollbar-hide">
                {/* Budget Summary Card */}
                <section className="mt-4">
                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-primary/10 shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center border-r border-primary/10">
                                <span className="text-[10px] font-extrabold text-[#131811]/40 dark:text-white/40 uppercase tracking-widest mb-1 block">{t("dailyLimit")}</span>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-xl font-extrabold text-primary">Rp</span>
                                    <input
                                        className="bg-transparent border-none text-2xl font-extrabold focus:ring-0 focus:outline-none p-0 w-24 text-center dark:text-white"
                                        type="text"
                                        inputMode="numeric"
                                        value={formatCurrency(dailyBudget)}
                                        onChange={(e) => setDailyBudget(parseCurrency(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] font-extrabold text-[#131811]/40 dark:text-white/40 uppercase tracking-widest mb-1 block">{t("monthlyLimit")}</span>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-xl font-extrabold text-primary">Rp</span>
                                    <input
                                        className="bg-transparent border-none text-2xl font-extrabold focus:ring-0 focus:outline-none p-0 w-32 text-center dark:text-white"
                                        type="text"
                                        inputMode="numeric"
                                        value={formatCurrency(monthlyBudget)}
                                        onChange={(e) => setMonthlyBudget(parseCurrency(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-[#131811]/40 dark:text-white/40 mt-4 text-center">
                            Total Budget Kategori: <span className="font-bold">Rp {formatCurrency(totalBudget)}</span>
                        </p>
                    </div>
                </section>

                {/* Category Groups */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-extrabold text-[#131811]/50 dark:text-white/50 uppercase tracking-widest">{t("categories")}</h3>
                        <button
                            onClick={openModal}
                            className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            {t("addCategory")}
                        </button>
                    </div>

                    {groups.map((group) => {
                        const style = getStyle(group.category_name);
                        const isExpanded = expandedGroups.has(group.category_name);

                        return (
                            <div key={group.category_name} className="bg-white dark:bg-white/5 rounded-xl border border-primary/5 shadow-sm overflow-hidden">
                                {/* Group Header */}
                                <button
                                    onClick={() => toggleGroup(group.category_name)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-lg ${style.bg} flex items-center justify-center ${style.text}`}>
                                            {icons[style.iconKey]}
                                        </div>
                                        <div className="text-left">
                                            <span className="font-bold text-sm dark:text-white block">{group.category_name}</span>
                                            <span className="text-[10px] text-muted">
                                                {group.items.length} sub · Rp {formatCurrency(group.total)}
                                            </span>
                                        </div>
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`size-4 text-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {/* Sub-category items */}
                                {isExpanded && (
                                    <div className="border-t border-primary/5">
                                        {group.items.map((item, idx) => (
                                            <div
                                                key={`${item.category_name}-${item.sub_category_name}`}
                                                className={`flex items-center justify-between px-4 py-3 ${idx < group.items.length - 1 ? "border-b border-primary/5" : ""}`}
                                            >
                                                <span className="text-sm dark:text-white/80 pl-13">
                                                    {item.sub_category_name}
                                                </span>
                                                <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-lg px-2 py-1 border border-primary/5">
                                                    <span className="text-xs font-bold mr-1 text-gray-400 dark:text-gray-300">Rp</span>
                                                    <input
                                                        className="w-24 bg-transparent border-none p-0 text-sm font-extrabold focus:ring-0 focus:outline-none text-right dark:text-white"
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={formatCurrency(item.budget)}
                                                        onChange={(e) =>
                                                            handleBudgetChange(item.category_name, item.sub_category_name, e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>
            </main>

            {/* Sticky Footer */}
            <footer className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/90 dark:bg-background-dark/90 ios-blur border-t border-border-light dark:border-border-dark p-5">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-primary hover:opacity-90 active:scale-[0.98] transition-all py-4 rounded-xl shadow-lg shadow-primary/20 text-[#131811] font-extrabold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    {saving ? (
                        <svg className="animate-spin size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-6">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    )}
                    {saving ? "Saving..." : t("saveBudget")}
                </button>
            </footer>

            {/* ── Add Category Modal ─────────────────────── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 ios-blur"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Sheet */}
                    <div className="relative w-full max-w-[430px] bg-white dark:bg-[#1c1c1e] rounded-t-2xl p-6 pb-10 animate-slide-up">
                        {/* Drag indicator */}
                        <div className="flex justify-center mb-5">
                            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        </div>

                        <h2 className="text-lg font-extrabold tracking-tight mb-6">
                            {t("addNewCategory")}
                        </h2>

                        {/* Category Name */}
                        <div className="space-y-2 mb-5">
                            <label className="text-sm font-bold text-muted">{t("categoryName")}</label>
                            <input
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="block w-full rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-white/5 h-12 px-4 text-base focus:border-primary focus:ring-primary placeholder:text-gray-400"
                                placeholder={t("categoryNamePlaceholder")}
                                type="text"
                                list="category-suggestions"
                            />
                            <datalist id="category-suggestions">
                                {existingCategoryNames.map((name) => (
                                    <option key={name} value={name} />
                                ))}
                            </datalist>
                            {/* Quick select existing categories */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {existingCategoryNames.map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => setNewCategoryName(name)}
                                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${newCategoryName === name
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-gray-50/80 dark:bg-white/5 border-transparent text-muted hover:border-primary"
                                            }`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sub Category Name */}
                        <div className="space-y-2 mb-5">
                            <label className="text-sm font-bold text-muted">Sub Kategori</label>
                            <input
                                value={newSubCategoryName}
                                onChange={(e) => setNewSubCategoryName(e.target.value)}
                                className="block w-full rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-white/5 h-12 px-4 text-base focus:border-primary focus:ring-primary placeholder:text-gray-400"
                                placeholder="Nama sub kategori"
                                type="text"
                            />
                        </div>

                        {/* Budget Amount */}
                        <div className="space-y-2 mb-6">
                            <label className="text-sm font-bold text-muted">{t("budgetAmount")}</label>
                            <div className="flex items-center rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-white/5 h-12 px-4">
                                <span className="text-sm font-bold text-primary mr-2">Rp</span>
                                <input
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    className="flex-1 bg-transparent border-none p-0 text-base font-bold focus:ring-0 focus:outline-none placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0"
                                    type="number"
                                    inputMode="numeric"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        {newCategoryName.trim() && newSubCategoryName.trim() && (
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-primary/5 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-lg ${getStyle(newCategoryName).bg} flex items-center justify-center ${getStyle(newCategoryName).text}`}>
                                        {icons[getStyle(newCategoryName).iconKey]}
                                    </div>
                                    <div>
                                        <span className="font-bold block text-sm">{newCategoryName}</span>
                                        <span className="text-xs text-muted">{newSubCategoryName} · Rp {formatCurrency(Number(newBudget) || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3.5 rounded-xl border border-border-light dark:border-border-dark font-bold text-sm active:scale-[0.98] transition-transform"
                            >
                                {t("cancel")}
                            </button>
                            <button
                                onClick={handleAddCategory}
                                disabled={!newCategoryName.trim() || !newSubCategoryName.trim()}
                                className="flex-1 py-3.5 rounded-xl bg-primary text-[#131811] font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100"
                            >
                                {t("addCategory")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal slide-up animation */}
            <style jsx>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to   { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
