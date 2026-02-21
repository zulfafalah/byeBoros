"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

/* ── Icon library ────────────────────────────────── */
const iconOptions: { name: string; icon: ReactNode }[] = [
    {
        name: "restaurant",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
            </svg>
        ),
    },
    {
        name: "car",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        ),
    },
    {
        name: "movie",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
                <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" />
            </svg>
        ),
    },
    {
        name: "scissors",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <circle cx="6" cy="6" r="3" /><path d="M8.12 8.12L12 12" /><path d="M20 4L8.12 15.88" />
                <circle cx="6" cy="18" r="3" /><path d="M14.8 14.8L20 20" />
            </svg>
        ),
    },
    {
        name: "shopping",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
        ),
    },
    {
        name: "health",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    },
    {
        name: "home",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        name: "education",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
        ),
    },
];

/* ── Color palette ───────────────────────────────── */
const colorOptions = [
    { name: "orange", text: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", ring: "ring-orange-500" },
    { name: "blue", text: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", ring: "ring-blue-500" },
    { name: "purple", text: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", ring: "ring-purple-500" },
    { name: "pink", text: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10", ring: "ring-pink-500" },
    { name: "green", text: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10", ring: "ring-green-500" },
    { name: "red", text: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10", ring: "ring-red-500" },
    { name: "teal", text: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-500/10", ring: "ring-teal-500" },
    { name: "amber", text: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", ring: "ring-amber-500" },
];

/* ── Category type ───────────────────────────────── */
interface Category {
    name: string;
    iconName: string;
    icon: ReactNode;
    color: string;
    bgColor: string;
    budget: number;
}

const defaultCategories: Category[] = [
    { name: "Food & Drinks", iconName: "restaurant", icon: iconOptions[0].icon, color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-500/10", budget: 500000 },
    { name: "Transport", iconName: "car", icon: iconOptions[1].icon, color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-500/10", budget: 250000 },
    { name: "Entertainment", iconName: "movie", icon: iconOptions[2].icon, color: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-500/10", budget: 150000 },
    { name: "Grooming", iconName: "scissors", icon: iconOptions[3].icon, color: "text-pink-500", bgColor: "bg-pink-50 dark:bg-pink-500/10", budget: 100000 },
];

/* ═══════════════════════════════════════════════════ */

export default function BudgetPage() {
    const t = useTranslations("Budget");
    const [dailyLimit, setDailyLimit] = useState(45000);
    const [monthlyLimit, setMonthlyLimit] = useState(1350000);
    const [categoryList, setCategoryList] = useState<Category[]>(defaultCategories);

    /* modal state */
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newBudget, setNewBudget] = useState("");
    const [selectedIcon, setSelectedIcon] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);

    const handleCategoryChange = (name: string, value: string) => {
        setCategoryList((prev) =>
            prev.map((c) => (c.name === name ? { ...c, budget: Number(value) || 0 } : c))
        );
    };

    const openModal = () => {
        setNewName("");
        setNewBudget("");
        setSelectedIcon(0);
        setSelectedColor(0);
        setShowModal(true);
    };

    const handleAddCategory = () => {
        if (!newName.trim()) return;
        const color = colorOptions[selectedColor];
        const icon = iconOptions[selectedIcon];
        const newCat: Category = {
            name: newName.trim(),
            iconName: icon.name,
            icon: icon.icon,
            color: color.text,
            bgColor: color.bg,
            budget: Number(newBudget) || 0,
        };
        setCategoryList((prev) => [...prev, newCat]);
        setShowModal(false);
    };

    const handleSave = () => {
        const budget = {
            dailyLimit,
            monthlyLimit,
            categories: categoryList.map((c) => ({ name: c.name, budget: c.budget })),
        };
        console.log("Saving budget:", budget);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID").format(value);
    };

    return (
        <div className="relative flex min-h-dvh w-full flex-col max-w-[430px] mx-auto bg-white dark:bg-background-dark shadow-2xl">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-background-dark/80 ios-blur px-4 py-4 border-b border-border-light dark:border-border-dark">
                <Link
                    href="/"
                    className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </Link>
                <h1 className="text-lg font-bold tracking-tight">{t("title")}</h1>
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
                                        className="bg-transparent border-none text-2xl font-extrabold focus:ring-0 focus:outline-none p-0 w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        type="number"
                                        value={dailyLimit}
                                        onChange={(e) => setDailyLimit(Number(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] font-extrabold text-[#131811]/40 dark:text-white/40 uppercase tracking-widest mb-1 block">{t("monthlyLimit")}</span>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-xl font-extrabold text-primary">Rp</span>
                                    <input
                                        className="bg-transparent border-none text-2xl font-extrabold focus:ring-0 focus:outline-none p-0 w-28 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        type="number"
                                        value={monthlyLimit}
                                        onChange={(e) => setMonthlyLimit(Number(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-[#131811]/40 dark:text-white/40 mt-4 text-center">
                            {t("remainingBalance")} <span className="font-bold">Rp {formatCurrency(840000)}</span>
                        </p>
                    </div>
                </section>

                {/* Categories */}
                <section className="space-y-4">
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

                    <div className="space-y-3">
                        {categoryList.map((cat) => (
                            <div key={cat.name} className="p-4 bg-white dark:bg-white/5 rounded-xl border border-primary/5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-lg ${cat.bgColor} flex items-center justify-center ${cat.color}`}>
                                            {cat.icon}
                                        </div>
                                        <span className="font-bold">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-lg px-2 py-1 border border-primary/5">
                                        <span className="text-xs font-bold mr-1 opacity-50">Rp</span>
                                        <input
                                            className="w-20 bg-transparent border-none p-0 text-sm font-extrabold focus:ring-0 focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            type="number"
                                            value={cat.budget}
                                            onChange={(e) => handleCategoryChange(cat.name, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Sticky Footer */}
            <footer className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/90 dark:bg-background-dark/90 ios-blur border-t border-border-light dark:border-border-dark p-5">
                <button
                    onClick={handleSave}
                    className="w-full bg-primary hover:opacity-90 active:scale-[0.98] transition-all py-4 rounded-xl shadow-lg shadow-primary/20 text-[#131811] font-extrabold text-lg flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-6">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {t("saveBudget")}
                </button>
                <div className="h-6 w-full flex justify-center items-end pb-1">
                    <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
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
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="block w-full rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-white/5 h-12 px-4 text-base focus:border-primary focus:ring-primary placeholder:text-gray-400"
                                placeholder={t("categoryNamePlaceholder")}
                                type="text"
                            />
                        </div>

                        {/* Budget Amount */}
                        <div className="space-y-2 mb-5">
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

                        {/* Icon Picker */}
                        <div className="space-y-2 mb-5">
                            <label className="text-sm font-bold text-muted">{t("chooseIcon")}</label>
                            <div className="grid grid-cols-8 gap-2">
                                {iconOptions.map((opt, i) => (
                                    <button
                                        key={opt.name}
                                        onClick={() => setSelectedIcon(i)}
                                        className={`size-10 rounded-lg flex items-center justify-center transition-all ${selectedIcon === i
                                            ? `${colorOptions[selectedColor].bg} ${colorOptions[selectedColor].text} ring-2 ${colorOptions[selectedColor].ring}`
                                            : "bg-gray-100 dark:bg-white/5 text-gray-500"
                                            }`}
                                    >
                                        {opt.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-2 mb-6">
                            <label className="text-sm font-bold text-muted">{t("chooseColor")}</label>
                            <div className="flex gap-3">
                                {colorOptions.map((c, i) => (
                                    <button
                                        key={c.name}
                                        onClick={() => setSelectedColor(i)}
                                        className={`size-8 rounded-full transition-all ${c.bg} ${selectedColor === i
                                            ? `ring-2 ring-offset-2 ${c.ring}`
                                            : ""
                                            }`}
                                    >
                                        <span className={`block size-full rounded-full ${c.text}`}>
                                            {selectedColor === i && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-full p-1.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        {newName.trim() && (
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-primary/5 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-lg ${colorOptions[selectedColor].bg} flex items-center justify-center ${colorOptions[selectedColor].text}`}>
                                        {iconOptions[selectedIcon].icon}
                                    </div>
                                    <div>
                                        <span className="font-bold block">{newName}</span>
                                        <span className="text-xs text-muted">Rp {formatCurrency(Number(newBudget) || 0)}</span>
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
                                disabled={!newName.trim()}
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
