"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import BottomNav from "../components/BottomNav";

const TEMPLATE_URL = "https://docs.google.com/spreadsheets/d/1jZp3nUe4dq1r2Uwz6p2m3K8OzJpSIKA7eFa8p5sOLqI/export?format=xlsx";
const SERVICE_ACCOUNT_EMAIL = "byeborosclient@byeboros.iam.gserviceaccount.com";

export default function DocumentationPage() {
    const router = useRouter();
    const t = useTranslations("Documentation");
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(SERVICE_ACCOUNT_EMAIL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative flex h-dvh w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-background-light dark:bg-background-dark shadow-2xl text-[#131811] dark:text-white">
            {/* Header */}
            <header className="flex items-center gap-3 px-4 pt-6 pb-4">
                <button
                    onClick={() => router.back()}
                    className="size-10 flex items-center justify-center rounded-full bg-card-light dark:bg-card-dark shadow-sm border border-border-light dark:border-border-dark cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">{t("title")}</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 pb-32 scrollbar-hide">
                {/* Hero */}
                <section className="mt-2 mb-5">
                    <div className="bg-gradient-to-br from-primary/15 to-green-200/20 dark:from-primary/20 dark:to-green-900/30 rounded-xl border border-primary/20 dark:border-primary/30 p-5">
                        <h2 className="text-base font-extrabold tracking-tight mb-2">{t("heroTitle")}</h2>
                        <p className="text-[13px] text-muted leading-relaxed">{t("heroDescription")}</p>
                    </div>
                </section>

                {/* Getting Started */}
                <section className="mb-5">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-[18px] text-blue-600 dark:text-blue-400">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                            <h2 className="text-[15px] font-extrabold tracking-tight">{t("gettingStarted")}</h2>
                        </div>

                        {/* Step 1 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5">
                                <span className="size-6 rounded-md bg-primary/15 text-primary text-xs font-extrabold flex items-center justify-center shrink-0">1</span>
                                <h3 className="text-sm font-bold">{t("step1Title")}</h3>
                            </div>
                            <div className="ml-[34px] space-y-1.5 text-[13px] text-muted leading-[1.7]">
                                <p>{t("step1Desc1")}</p>
                                <p>{t("step1Desc2")}</p>
                                <p>{t("step1Desc3")}</p>
                            </div>
                            <div className="ml-[34px]">
                                <a
                                    href={TEMPLATE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-[#131811] text-xs font-bold shadow-sm active:scale-[0.98] transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    {t("downloadTemplate")}
                                </a>
                            </div>
                            <div className="ml-[34px] bg-amber-50 dark:bg-amber-900/30 border border-amber-200/80 dark:border-amber-700/40 rounded-lg p-3">
                                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{t("step1Warning")}</p>
                            </div>
                        </div>

                        <div className="h-px bg-border-light dark:bg-border-dark" />

                        {/* Step 2 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5">
                                <span className="size-6 rounded-md bg-primary/15 text-primary text-xs font-extrabold flex items-center justify-center shrink-0">2</span>
                                <h3 className="text-sm font-bold">{t("step2Title")}</h3>
                            </div>
                            <div className="ml-[34px] space-y-2 text-[13px] text-muted leading-[1.7]">
                                <p>{t("step2Desc1")}</p>
                                <p>{t("step2Desc2")}</p>
                                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-md px-3 py-2.5">
                                    <span className="font-mono text-[11px] break-all select-all leading-relaxed flex-1">
                                        {SERVICE_ACCOUNT_EMAIL}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="shrink-0 size-7 flex items-center justify-center rounded-md bg-white dark:bg-zinc-700 border border-border-light dark:border-border-dark active:scale-95 transition-all cursor-pointer"
                                        title="Copy"
                                    >
                                        {copied ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-green-500">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-muted">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p>{t("step2Desc3")}</p>
                            </div>
                            <div className="ml-[34px] bg-blue-50 dark:bg-blue-900/30 border border-blue-200/80 dark:border-blue-700/40 rounded-lg p-3">
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{t("step2Info")}</p>
                            </div>
                        </div>

                        <div className="h-px bg-border-light dark:bg-border-dark" />

                        {/* Step 3 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5">
                                <span className="size-6 rounded-md bg-primary/15 text-primary text-xs font-extrabold flex items-center justify-center shrink-0">3</span>
                                <h3 className="text-sm font-bold">{t("step3Title")}</h3>
                            </div>
                            <div className="ml-[34px] space-y-1.5 text-[13px] text-muted leading-[1.7]">
                                <p>{t("step3Desc1")}</p>
                                <p>{t("step3Desc2")}</p>
                            </div>
                            <div className="ml-[34px] bg-green-50 dark:bg-green-900/30 border border-green-200/80 dark:border-green-700/40 rounded-lg p-3">
                                <p className="text-xs font-semibold text-green-700 dark:text-green-300 leading-relaxed">{t("step3Success")}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mb-5">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-[18px] text-purple-600 dark:text-purple-400">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h2 className="text-[15px] font-extrabold tracking-tight">{t("features")}</h2>
                        </div>

                        <div className="space-y-2">
                            {[
                                { icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-blue-500">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                ), title: t("featureLogin"), desc: t("featureLoginDesc") },
                                { icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-red-500">
                                        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                ), title: t("featureExpense"), desc: t("featureExpenseDesc") },
                                { icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-green-500">
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                                    </svg>
                                ), title: t("featureIncome"), desc: t("featureIncomeDesc") },
                                { icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-orange-500">
                                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                                    </svg>
                                ), title: t("featureHistory"), desc: t("featureHistoryDesc") },
                                { icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-amber-500">
                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                                    </svg>
                                ), title: t("featureBudget"), desc: t("featureBudgetDesc") },
                                { icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-indigo-500">
                                        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                                    </svg>
                                ), title: t("featureAnalysis"), desc: t("featureAnalysisDesc") },
                            ].map((f, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50/60 dark:bg-zinc-800/50">
                                    <div className="size-8 rounded-md bg-white dark:bg-zinc-800 border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 mt-0.5">
                                        {f.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold leading-snug">{f.title}</p>
                                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="mb-5">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-[18px] text-cyan-600 dark:text-cyan-400">
                                    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>
                            </div>
                            <h2 className="text-[15px] font-extrabold tracking-tight">{t("howItWorks")}</h2>
                        </div>

                        <div className="space-y-3">
                            {[
                                t("howStep1"),
                                t("howStep2"),
                                t("howStep3"),
                            ].map((step, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="size-6 rounded-md bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                                    <p className="text-[13px] text-muted leading-[1.7]">{step}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3.5">
                            <p className="text-xs font-bold mb-1">{t("whyGoogleSheets")}</p>
                            <p className="text-xs text-muted leading-relaxed">{t("whyGoogleSheetsDesc")}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-5">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-[18px] text-orange-600 dark:text-orange-400">
                                    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <h2 className="text-[15px] font-extrabold tracking-tight">{t("faq")}</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Is it free? */}
                            <div className="space-y-1">
                                <p className="text-sm font-bold">{t("faqFreeQ")}</p>
                                <p className="text-[13px] text-muted leading-relaxed">{t("faqFreeA")}</p>
                            </div>

                            <div className="h-px bg-border-light dark:bg-border-dark" />

                            {/* Is data safe? */}
                            <div className="space-y-1">
                                <p className="text-sm font-bold">{t("faqSafeQ")}</p>
                                <p className="text-[13px] text-muted leading-relaxed">{t("faqSafeA")}</p>
                            </div>

                            <div className="h-px bg-border-light dark:bg-border-dark" />

                            {/* Can developer see data? */}
                            <div className="space-y-3">
                                <p className="text-sm font-bold">{t("faqDevQ")}</p>
                                <p className="text-[13px] text-muted leading-relaxed">{t("faqDevA")}</p>

                                {/* Service Account Comparison Table */}
                                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3.5 space-y-3">
                                    <p className="text-xs font-bold">{t("saComparisonTitle")}</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="text-left border-b border-border-light dark:border-border-dark">
                                                    <th className="pb-2 pr-2 font-bold text-muted"></th>
                                                    <th className="pb-2 pr-2 font-bold text-center">Google</th>
                                                    <th className="pb-2 font-bold text-center">Service Acc.</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted">
                                                <tr>
                                                    <td className="py-2 pr-2 font-medium">{t("saLogin")}</td>
                                                    <td className="py-2 pr-2 text-center text-green-500 font-bold">Ya</td>
                                                    <td className="py-2 text-center text-red-500 font-bold">Tidak</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-2 font-medium">{t("saBrowser")}</td>
                                                    <td className="py-2 pr-2 text-center text-green-500 font-bold">Ya</td>
                                                    <td className="py-2 text-center text-red-500 font-bold">Tidak</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-2 font-medium">{t("saApi")}</td>
                                                    <td className="py-2 pr-2 text-center text-green-500 font-bold">Ya</td>
                                                    <td className="py-2 text-center text-green-500 font-bold">Ya</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-2 font-medium">{t("saPassword")}</td>
                                                    <td className="py-2 pr-2 text-center text-green-500 font-bold">Ya</td>
                                                    <td className="py-2 text-center text-red-500 font-bold">Tidak</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <p className="text-[13px] text-muted leading-[1.7]">{t("faqDevExplain")}</p>

                                <div className="ml-1 space-y-1.5 text-[13px] text-muted leading-relaxed">
                                    <div className="flex items-start gap-2">
                                        <span className="text-muted mt-px">•</span>
                                        <p>{t("saUse1")}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-muted mt-px">•</span>
                                        <p>{t("saUse2")}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-muted mt-px">•</span>
                                        <p>{t("saUse3")}</p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200/80 dark:border-blue-700/40 rounded-lg p-3">
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{t("faqDevTip")}</p>
                                </div>
                            </div>

                            <div className="h-px bg-border-light dark:bg-border-dark" />

                            {/* Mobile? */}
                            <div className="space-y-1">
                                <p className="text-sm font-bold">{t("faqMobileQ")}</p>
                                <p className="text-[13px] text-muted leading-relaxed">{t("faqMobileA")}</p>
                            </div>

                            <div className="h-px bg-border-light dark:bg-border-dark" />

                            {/* Deleted sheet? */}
                            <div className="space-y-1">
                                <p className="text-sm font-bold">{t("faqDeleteQ")}</p>
                                <p className="text-[13px] text-muted leading-relaxed">{t("faqDeleteA")}</p>
                            </div>

                            <div className="h-px bg-border-light dark:bg-border-dark" />

                            {/* Family? */}
                            <div className="space-y-1">
                                <p className="text-sm font-bold">{t("faqFamilyQ")}</p>
                                <p className="text-[13px] text-muted leading-relaxed">{t("faqFamilyA")}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Source */}
                <section className="mb-5">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-[18px] text-zinc-600 dark:text-zinc-400">
                                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                                </svg>
                            </div>
                            <h2 className="text-[15px] font-extrabold tracking-tight">{t("openSource")}</h2>
                        </div>

                        <div className="space-y-2">
                            <a
                                href="https://github.com/zulfafalah/byeBoros-backend"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50/60 dark:bg-zinc-800/50 active:bg-zinc-100 dark:active:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-zinc-700 dark:text-zinc-300">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-bold">Backend</p>
                                        <p className="text-xs text-muted">byeBoros-backend</p>
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-zinc-400">
                                    <line x1="7" y1="17" x2="17" y2="7" />
                                    <polyline points="7 7 17 7 17 17" />
                                </svg>
                            </a>
                            <a
                                href="https://github.com/zulfafalah/byeBoros"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50/60 dark:bg-zinc-800/50 active:bg-zinc-100 dark:active:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-zinc-700 dark:text-zinc-300">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-bold">Frontend</p>
                                        <p className="text-xs text-muted">byeBoros</p>
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-zinc-400">
                                    <line x1="7" y1="17" x2="17" y2="7" />
                                    <polyline points="7 7 17 7 17 17" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <section className="mb-6">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-border-light dark:border-border-dark rounded-xl p-4 text-center">
                        <p className="text-[13px] text-muted">{t("footer")}</p>
                    </div>
                </section>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
