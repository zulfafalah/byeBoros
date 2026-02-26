"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import BottomNav from "../components/BottomNav";

function extractSheetId(url: string): string | null {
    // Matches Google Sheet URLs like:
    // https://docs.google.com/spreadsheets/d/SHEET_ID/edit
    // https://docs.google.com/spreadsheets/d/SHEET_ID/
    // https://docs.google.com/spreadsheets/d/SHEET_ID
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

export default function SettingsPage() {
    const router = useRouter();
    const t = useTranslations("Settings");
    const [sheetLink, setSheetLink] = useState("");
    const [sheetId, setSheetId] = useState("");
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedLink = localStorage.getItem("googleSheetLink") ?? "";
        const storedId = localStorage.getItem("googleSheetId") ?? "";
        setSheetLink(storedLink);
        setSheetId(storedId);
    }, []);

    const handleLinkChange = (value: string) => {
        setSheetLink(value);
        setError("");
        setSaved(false);

        if (value.trim() === "") {
            setSheetId("");
            return;
        }

        const id = extractSheetId(value);
        if (id) {
            setSheetId(id);
        } else {
            setSheetId("");
        }
    };

    const handleSave = () => {
        if (sheetLink.trim() === "") {
            localStorage.removeItem("googleSheetLink");
            localStorage.removeItem("googleSheetId");
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            return;
        }

        const id = extractSheetId(sheetLink);
        if (!id) {
            setError(t("invalidLink"));
            return;
        }

        localStorage.setItem("googleSheetLink", sheetLink.trim());
        localStorage.setItem("googleSheetId", id);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
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
                {/* Google Sheet Section */}
                <section className="mt-4">
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-5 space-y-5">
                        {/* Section Header */}
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5 text-green-600 dark:text-green-400">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <line x1="3" y1="9" x2="21" y2="9" />
                                    <line x1="3" y1="15" x2="21" y2="15" />
                                    <line x1="9" y1="3" x2="9" y2="21" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-base font-extrabold tracking-tight">{t("googleSheet")}</h2>
                                <p className="text-xs text-muted mt-0.5">{t("description")}</p>
                            </div>
                        </div>

                        {/* Google Sheet Link Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">
                                {t("googleSheetLink")}
                            </label>
                            <input
                                type="url"
                                value={sheetLink}
                                onChange={(e) => handleLinkChange(e.target.value)}
                                placeholder={t("googleSheetPlaceholder")}
                                className="w-full h-12 px-4 rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-white/5 text-sm font-medium placeholder:text-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                            />
                            {error && (
                                <p className="text-xs font-semibold text-expense-red mt-1">{error}</p>
                            )}
                        </div>

                        {/* Sheet ID (read-only) */}
                        {sheetId && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider">
                                    {t("googleSheetId")}
                                </label>
                                <div className="w-full h-12 px-4 rounded-xl border border-border-light dark:border-border-dark bg-gray-50/80 dark:bg-white/5 text-sm font-mono font-medium flex items-center text-muted overflow-x-auto">
                                    {sheetId}
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className={`w-full h-12 rounded-xl font-bold text-sm shadow-lg active:scale-[0.98] transition-all cursor-pointer ${
                                saved
                                    ? "bg-green-500 text-white shadow-green-500/20"
                                    : "bg-primary text-[#131811] shadow-primary/20"
                            }`}
                        >
                            {saved ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {t("saved")}
                                </span>
                            ) : (
                                t("save")
                            )}
                        </button>
                    </div>
                </section>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
