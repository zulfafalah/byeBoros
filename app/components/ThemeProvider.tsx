"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: (e?: React.MouseEvent) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

// Type for the View Transitions API (not yet in all TS lib versions)
type DocumentWithVT = Document & {
    startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export default function ThemeProvider({ children, initialDark = false }: { children: ReactNode; initialDark?: boolean }) {
    const [darkMode, setDarkMode] = useState(initialDark);

    // Sync cookie & theme-color meta tag whenever darkMode changes
    useEffect(() => {
        document.cookie = `theme=${darkMode ? "dark" : "light"};path=/;max-age=31536000`;

        // Update theme-color for PWA system UI (Android status bar, etc.)
        const themeColor = darkMode ? "#142210" : "#f6f8f6";
        document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
            el.setAttribute("content", themeColor);
        });
    }, [darkMode]);

    const toggleDarkMode = (e?: React.MouseEvent) => {
        const isDark = !darkMode;

        // Origin of the ripple — use click position or center of screen
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Set CSS custom properties for the animation origin
        document.documentElement.style.setProperty("--vt-x", `${x}px`);
        document.documentElement.style.setProperty("--vt-y", `${y}px`);
        document.documentElement.style.setProperty("--vt-r", `${maxRadius}px`);

        const applyTheme = () => {
            document.documentElement.classList.toggle("dark", isDark);
            setDarkMode(isDark);
        };

        const doc = document as DocumentWithVT;
        if (doc.startViewTransition) {
            doc.startViewTransition(applyTheme);
        } else {
            applyTheme();
        }
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}
