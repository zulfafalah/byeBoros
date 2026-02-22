"use client";

import { useTranslations } from "next-intl";

export default function Header() {
    const t = useTranslations("Header");
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? t("goodMorning") : hour < 18 ? t("goodAfternoon") : t("goodEvening");

    return (
        <header className="flex items-center justify-between px-6 pt-6 pb-4 safe-top bg-background-light dark:bg-background-dark">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                    <span className="text-lg font-bold text-primary">A</span>
                </div>

                <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold">
                        {greeting}
                    </p>
                    <p className="text-sm font-bold dark:text-white">Herman Doe</p>
                </div>
            </div>

            {/* Notification Bell */}
            <button className="size-10 flex items-center justify-center rounded-full bg-card-light dark:bg-card-dark shadow-sm border border-border-light dark:border-border-dark transition-transform active:scale-90">
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
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
            </button>
        </header>
    );
}
