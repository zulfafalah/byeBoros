"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const STORAGE_KEY = "welcome-popup-dismissed";

/* ── SVG Icons ─────────────────────────────────── */
const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-8">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

export default function WelcomePopup() {
    const t = useTranslations("WelcomePopup");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (!dismissed) {
            // slight delay so the app paint finishes first
            const timer = setTimeout(() => setVisible(true), 600);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        /* backdrop */
        <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            aria-modal="true"
            role="dialog"
        >
            {/* dim overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={dismiss}
            />

            {/* sheet / card */}
            <div className="relative w-full max-w-[430px] rounded-t-3xl sm:rounded-3xl bg-background-light dark:bg-background-dark px-6 pt-8 pb-10 shadow-2xl animate-slide-up flex flex-col gap-5">

                {/* pill handle (mobile sheet feel) */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 sm:hidden" />

                {/* icon */}
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <SparkleIcon />
                    </div>
                </div>

                {/* title */}
                <h2 className="text-center text-xl font-bold text-text-light dark:text-text-dark leading-snug">
                    {t("title")}
                </h2>

                {/* body */}
                <p className="text-center text-sm text-text-light/70 dark:text-text-dark/70 leading-relaxed">
                    {t("body")}
                </p>

                {/* steps */}
                <ol className="flex flex-col gap-3">
                    <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600">
                            <UserIcon />
                        </span>
                        <p className="text-sm text-text-light dark:text-text-dark leading-snug">
                            {t("step1")}
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600">
                            <BookIcon />
                        </span>
                        <p className="text-sm text-text-light dark:text-text-dark leading-snug">
                            {t("step2")}
                        </p>
                    </li>
                </ol>

                {/* CTA buttons */}
                <div className="flex flex-col gap-2 pt-1">
                    <Link
                        href="/profile"
                        onClick={dismiss}
                        className="w-full rounded-2xl bg-primary py-3 text-center text-sm font-semibold text-[#131811] transition active:scale-95"
                    >
                        {t("cta")}
                    </Link>
                    <button
                        onClick={dismiss}
                        className="w-full rounded-2xl py-3 text-center text-sm font-medium text-text-light/60 dark:text-text-dark/60 transition active:scale-95"
                    >
                        {t("skip")}
                    </button>
                </div>
            </div>
        </div>
    );
}
