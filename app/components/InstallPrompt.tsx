"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Cek apakah sudah diinstall (standalone mode)
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Cek iOS
        const ua = window.navigator.userAgent;
        const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
        setIsIOS(iosDevice);

        if (iosDevice) {
            // iOS Safari: tampilkan petunjuk manual setelah delay
            const dismissed = localStorage.getItem("pwa-ios-dismissed");
            if (!dismissed) {
                setTimeout(() => setShowBanner(true), 2000);
            }
            return;
        }

        // Android / Desktop Chrome: tangkap event beforeinstallprompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            const dismissed = localStorage.getItem("pwa-install-dismissed");
            if (!dismissed) {
                setTimeout(() => setShowBanner(true), 2000);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowBanner(false);
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowBanner(false);
        if (isIOS) {
            localStorage.setItem("pwa-ios-dismissed", "1");
        } else {
            localStorage.setItem("pwa-install-dismissed", "1");
        }
    };

    if (isInstalled || !showBanner) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-4 flex items-start gap-3">
                {/* Icon */}
                <img
                    src="/icons/icon-192.png"
                    alt="ByeBoros"
                    className="w-12 h-12 rounded-xl flex-shrink-0"
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-zinc-900 dark:text-white">
                        Install ByeBoros
                    </p>
                    {isIOS ? (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                            Tap{" "}
                            <span className="inline-block">
                                <svg className="inline w-3.5 h-3.5 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L8 6h3v9h2V6h3L12 2zm-7 15v2h14v-2H5z" />
                                </svg>
                            </span>{" "}
                            lalu <strong>Add to Home Screen</strong>
                        </p>
                    ) : (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            Tambahkan ke layar utama untuk akses cepat
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                    {!isIOS && (
                        <button
                            onClick={handleInstall}
                            className="bg-[#46ec13] text-black text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
                        >
                            Install
                        </button>
                    )}
                    <button
                        onClick={handleDismiss}
                        className="text-zinc-400 dark:text-zinc-500 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                        Nanti
                    </button>
                </div>
            </div>
        </div>
    );
}
