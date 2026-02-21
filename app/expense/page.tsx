"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ExpensePage() {
    const t = useTranslations("Expense");
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Food");
    const [priority, setPriority] = useState("Medium");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [note, setNote] = useState("");

    const handleSave = () => {
        // TODO: implement save logic
        const expense = { amount, name, category, priority, date, note };
        console.log("Saving expense:", expense);
    };

    return (
        <div className="relative flex min-h-dvh w-full flex-col max-w-[430px] mx-auto bg-white dark:bg-background-dark shadow-2xl">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-background-dark/80 ios-blur px-4 py-4 border-b border-border-light dark:border-border-dark">
                <Link
                    href="/"
                    className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-5 dark:text-white"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </Link>
                <h1 className="text-lg font-bold tracking-tight dark:text-white">
                    {t("title")}
                </h1>
                <div className="size-10" /> {/* Spacer for symmetry */}
            </header>

            {/* Scrollable Form Content */}
            <main className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-8 scrollbar-hide">
                {/* Amount Input (Large & Prominent) */}
                <section className="text-center space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted">
                        {t("howMuch")}
                    </p>
                    <div className="relative flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary mr-2">
                            Rp
                        </span>
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full max-w-[220px] text-5xl font-extrabold text-center bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-gray-200 dark:placeholder:text-gray-700 dark:text-white"
                            placeholder="0"
                            type="number"
                            inputMode="numeric"
                        />
                    </div>
                </section>

                {/* Expense Name */}
                <section className="space-y-3">
                    <label className="block">
                        <span className="text-sm font-bold text-muted px-1">
                            {t("whatFor")}
                        </span>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 block w-full rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-900/50 h-14 px-4 text-base focus:border-primary focus:ring-primary placeholder:text-gray-400 dark:text-white"
                            placeholder={t("placeholder")}
                            type="text"
                        />
                    </label>
                </section>

                {/* Category & Priority Row */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <span className="text-sm font-bold text-muted px-1">
                            {t("category")}
                        </span>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="appearance-none block w-full rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-900/50 h-14 px-4 pr-10 text-base focus:border-primary focus:ring-primary dark:text-white"
                            >
                                <option>{t("food")}</option>
                                <option>{t("transport")}</option>
                                <option>{t("entertainment")}</option>
                                <option>{t("health")}</option>
                                <option>{t("shopping")}</option>
                                <option>{t("others")}</option>
                            </select>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="size-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-sm font-bold text-muted px-1">
                            {t("priority")}
                        </span>
                        <div className="relative">
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="appearance-none block w-full rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-900/50 h-14 px-4 pr-10 text-base focus:border-primary focus:ring-primary dark:text-white"
                            >
                                <option>{t("low")}</option>
                                <option>{t("medium")}</option>
                                <option>{t("high")}</option>
                            </select>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="size-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* Date Picker */}
                <section className="space-y-2">
                    <span className="text-sm font-bold text-muted px-1">
                        {t("when")}
                    </span>
                    <div className="flex items-center space-x-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-border-light dark:border-border-dark p-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-5 text-primary shrink-0"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 focus:outline-none text-base w-full p-0 dark:text-white"
                            type="date"
                        />
                    </div>
                </section>

                {/* Optional Note */}
                <section className="space-y-2">
                    <span className="text-sm font-bold text-muted px-1">
                        {t("note")}
                    </span>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="block w-full rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-900/50 p-4 text-base focus:border-primary focus:ring-primary placeholder:text-gray-400 min-h-[100px] dark:text-white"
                        placeholder={t("notePlaceholder")}
                    />
                </section>
            </main>

            {/* Sticky Footer */}
            <footer className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/90 dark:bg-background-dark/90 ios-blur p-5 border-t border-border-light dark:border-border-dark">
                <button
                    onClick={handleSave}
                    className="w-full bg-primary hover:opacity-90 active:scale-[0.98] transition-all py-4 rounded-xl shadow-lg shadow-primary/20 text-black font-extrabold text-lg flex items-center justify-center gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-6"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {t("saveExpense")}
                </button>

                {/* iPhone Indicator Spacer */}
                <div className="h-6 w-full flex justify-center items-end pb-1">
                    <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
            </footer>
        </div>
    );
}
