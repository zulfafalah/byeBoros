"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import BottomNav from "../components/BottomNav";
import { useTheme } from "../components/ThemeProvider";

export default function ProfilePage() {
    const router = useRouter();
    const t = useTranslations("Profile");
    const locale = useLocale();
    const { darkMode, toggleDarkMode } = useTheme();
    const [showLangModal, setShowLangModal] = useState(false);
    const [selectedLang, setSelectedLang] = useState(locale);

    const confirmLanguage = () => {
        if (selectedLang !== locale) {
            document.cookie = `locale=${selectedLang};path=/;max-age=31536000`;
            router.refresh();
        }
        setShowLangModal(false);
    };

    return (
        <div className="relative flex h-dvh w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-background-light dark:bg-background-dark shadow-2xl text-[#131811] dark:text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-6 pt-12 pb-4">
                <h1 className="text-xl font-bold">{t("title")}</h1>
                <button className="size-10 flex items-center justify-center rounded-full bg-card-light dark:bg-card-dark shadow-sm border border-border-light dark:border-border-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
                {/* Profile Section */}
                <section className="flex flex-col items-center py-8">
                    <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-primary/30 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-12 text-primary">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Alex Rivers</h2>
                    <p className="text-muted text-sm font-medium">alex.rivers@email.com</p>
                </section>

                {/* Settings */}
                <section className="space-y-6">
                    {/* Preferences */}
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold">{t("darkMode")}</span>
                            </div>
                            <button
                                onClick={toggleDarkMode}
                                className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${darkMode ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-600"
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all ${darkMode ? "right-1" : "left-1"
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Language */}
                        <button
                            onClick={() => { setSelectedLang(locale); setShowLangModal(true); }}
                            className="w-full flex items-center justify-between p-4 cursor-pointer active:bg-zinc-50 dark:active:bg-zinc-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold">{t("language")}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted">
                                <span className="text-xs font-bold uppercase">
                                    {locale === "en" ? t("english") : t("indonesian")}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Links */}
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        <a
                            href="#"
                            className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark active:bg-zinc-50 dark:active:bg-zinc-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10 9 9 9 8 9" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold">{t("documentation")}</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-zinc-400">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="flex items-center justify-between p-4 active:bg-zinc-50 dark:active:bg-zinc-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold">{t("helpCenter")}</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-zinc-400">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </a>
                    </div>

                    {/* Log Out */}
                    <button
                        onClick={() => router.push("/login")}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-expense-red font-bold active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>{t("logOut")}</span>
                    </button>
                </section>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />

            {/* Language Selection Modal */}
            {showLangModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-black/40 ios-blur"
                        onClick={() => setShowLangModal(false)}
                    />
                    <div className="relative w-full max-w-[430px] bg-white dark:bg-[#1c1c1e] rounded-t-2xl p-6 pb-10 animate-slide-up">
                        <div className="flex justify-center mb-5">
                            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        </div>

                        <h2 className="text-lg font-extrabold tracking-tight mb-6">
                            {t("language")}
                        </h2>

                        <div className="space-y-2 mb-6">
                            <div className="relative">
                                <select
                                    value={selectedLang}
                                    onChange={(e) => setSelectedLang(e.target.value)}
                                    className="appearance-none block w-full rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-white/5 h-14 px-4 pr-10 text-base font-semibold focus:border-primary focus:ring-primary"
                                >
                                    <option value="en">{t("english")}</option>
                                    <option value="id">{t("indonesian")}</option>
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLangModal(false)}
                                className="flex-1 py-3.5 rounded-xl border border-border-light dark:border-border-dark font-bold text-sm active:scale-[0.98] transition-transform"
                            >
                                {t("cancel")}
                            </button>
                            <button
                                onClick={confirmLanguage}
                                className="flex-1 py-3.5 rounded-xl bg-primary text-[#131811] font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
                            >
                                {t("confirm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
