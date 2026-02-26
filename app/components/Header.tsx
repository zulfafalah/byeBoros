"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getUserFromToken, type JwtPayload } from "@/lib/auth";

export default function Header() {
    const t = useTranslations("Header");
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? t("goodMorning") : hour < 18 ? t("goodAfternoon") : t("goodEvening");

    const [user, setUser] = useState<JwtPayload | null>(null);
    useEffect(() => { setUser(getUserFromToken()); }, []);

    const displayName = user?.name ?? "User";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <header className="flex items-center justify-between px-6 pt-6 pb-4 safe-top bg-background-light dark:bg-background-dark">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                    {user?.picture ? (
                        <img
                            src={user.picture}
                            alt={displayName}
                            className="size-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <span className="text-lg font-bold text-primary">{initial}</span>
                    )}
                </div>

                <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold">
                        {greeting}
                    </p>
                    <p className="text-sm font-bold dark:text-white">{displayName}</p>
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
