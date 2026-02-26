"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createIncome } from "@/lib/api/transactions";
import { getIncomeCategories } from "@/lib/api/category";

export default function IncomePage() {
    const t = useTranslations("Income");
    const router = useRouter();
    const [quickTags, setQuickTags] = useState<string[]>([]);
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getIncomeCategories()
            .then((res) => setQuickTags(res.categories))
            .catch((err) => console.error("Failed to fetch income categories:", err));
    }, []);

    const handleTagClick = (tag: string) => {
        setSelectedTag(selectedTag === tag ? null : tag);
        if (selectedTag !== tag) {
            setName(tag);
        } else {
            setName("");
        }
    };

    const formatTransactionAt = (): string => {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, "0");
        const mi = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
    };

    const handleSave = async () => {
        if (!name || !amount || !selectedTag) return;

        setIsLoading(true);
        try {
            await createIncome({
                description: name,
                category: selectedTag,
                priority: "low",
                amount: Number(amount),
                notes: note || undefined,
                transaction_at: formatTransactionAt(),
            });
            router.push("/");
        } catch (err) {
            console.error("Failed to save income:", err);
            alert(err instanceof Error ? err.message : "Failed to save income");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-dvh w-full flex-col max-w-[430px] mx-auto bg-white dark:bg-background-dark shadow-2xl overflow-hidden">
            {/* Decorative background blurs */}
            <div className="absolute -top-20 -right-20 size-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -left-20 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top App Bar */}
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
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </Link>
                <h1 className="text-base font-bold leading-tight tracking-tight dark:text-white">
                    {t("title")}
                </h1>
                <div className="size-10" /> {/* Spacer for symmetry */}
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 pt-8 pb-32 scrollbar-hide">
                <div className="space-y-8">
                    {/* Large Header */}
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight mb-2 dark:text-white">
                            {t("newEntry")}
                        </h2>
                        <p className="text-muted text-sm font-medium">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Income Source Input */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted ml-1">
                            {t("incomeSource")}
                        </label>
                        <div className="relative group">
                            <input
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-16 px-5 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all text-xl font-semibold placeholder:text-gray-400 placeholder:font-normal dark:text-white"
                                placeholder={t("sourcePlaceholder")}
                                type="text"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="size-5"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted ml-1">
                            {t("amount")}
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-bold dark:text-white">
                                Rp
                            </div>
                            <input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full h-24 pl-14 pr-14 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all text-4xl font-extrabold placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white"
                                placeholder="0"
                                type="number"
                                inputMode="numeric"
                                step="0.01"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <button className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-4 text-primary"
                                    >
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                        <line x1="1" y1="10" x2="23" y2="10" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Selection Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {quickTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${selectedTag === tag
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-gray-50/80 dark:bg-white/5 border-transparent text-muted hover:border-primary"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Note Input (Optional) */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted ml-1">
                            {t("note")}
                        </label>
                        <div className="relative group">
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full min-h-[100px] px-5 py-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 transition-all text-base font-medium placeholder:text-gray-400 placeholder:font-normal dark:text-white resize-none"
                                placeholder={t("notePlaceholder")}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Fixed Bottom Action Bar */}
            <footer className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-gradient-to-t from-white dark:from-background-dark via-white/90 dark:via-background-dark/90 to-transparent">
                <button
                    onClick={handleSave}
                    disabled={isLoading || !name || !amount || !selectedTag}
                    className="w-full h-16 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all text-black rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    {isLoading ? (
                        <svg className="animate-spin size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
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
                    )}
                    {isLoading ? t("saving") || "Saving..." : t("saveIncome")}
                </button>

            </footer>
        </div>
    );
}
