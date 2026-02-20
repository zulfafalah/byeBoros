"use client";

import { useState } from "react";

const tabs = [
    {
        key: "home",
        label: "Home",
        icon: (active: boolean) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        key: "analysis",
        label: "Analysis",
        icon: () => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
    { key: "add", label: "", icon: () => null }, // FAB placeholder
    {
        key: "history",
        label: "History",
        icon: () => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
    },
    {
        key: "profile",
        label: "Profile",
        icon: () => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
];

export default function BottomNav() {
    const [active, setActive] = useState("home");

    return (
        <nav className="absolute bottom-0 left-0 right-0 ios-blur bg-card-light/80 dark:bg-card-dark/80 border-t border-border-light dark:border-border-dark px-6 pb-8 pt-3 safe-bottom">
            <div className="flex items-center justify-between max-w-md mx-auto">
                {tabs.map((tab) => {
                    if (tab.key === "add") {
                        return (
                            <div key={tab.key} className="relative -top-8">
                                <button className="size-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-background-light dark:border-background-dark transition-transform active:scale-90">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="size-7">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        );
                    }

                    const isActive = active === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActive(tab.key)}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-[#131811] dark:text-white" : "text-muted"
                                }`}
                        >
                            {tab.icon(isActive)}
                            <span className="text-[10px] font-bold">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* iOS Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 dark:bg-white/20 rounded-full" />
        </nav>
    );
}
