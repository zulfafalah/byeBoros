"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show once per session
    const shown = sessionStorage.getItem("splashShown");
    if (shown) {
      setVisible(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("splashShown", "1");
    }, 2400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="splash-bg fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ transition: "opacity 0.6s ease", opacity: fadeOut ? 0 : 1 }}
    >
      {/* Dark mode background */}
      <style>{`
        .splash-bg { background-color: #fff8f8; }
        @media (prefers-color-scheme: dark) {
          .splash-bg { background-color: #142210; }
          .splash-title { color: #f0fce9 !important; }
        }
        .dark .splash-bg { background-color: #142210; }
        .dark .splash-title { color: #f0fce9 !important; }
      `}</style>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div
          style={{
            animation: "splashScale 0.5s ease-out forwards",
          }}
        >
          <Image
            src="/logo_byeboros.jpg"
            alt="ByeBoros"
            width={140}
            height={140}
            priority
            className=""
          />
        </div>

        {/* App name */}
        <div
          style={{
            animation: "splashFadeUp 0.5s ease-out 0.2s both",
          }}
        >
          <p
            className="splash-title text-2xl font-bold tracking-tight"
            style={{ color: "#ff6b34", fontFamily: "var(--font-display)" }}
          >
            ByeBoros
          </p>
          <p
            className="text-sm text-center mt-1"
            style={{ color: "#6b8961" }}
          >
            Open Source Financial Dashboard
          </p>
        </div>

        {/* Loading dots */}
        <div
          className="flex gap-1.5"
          style={{ animation: "splashFadeUp 0.5s ease-out 0.5s both" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#46ec13",
                display: "inline-block",
                animation: `splashDot 1s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes splashScale {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
