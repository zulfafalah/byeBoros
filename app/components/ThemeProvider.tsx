"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PaletteId = "default" | "green" | "pink";

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: (e?: React.MouseEvent) => void;
    palette: PaletteId;
    setPalette: (palette: PaletteId) => void;
    voiceEntry: boolean;
    setVoiceEntry: (enabled: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => { },
    palette: "default",
    setPalette: () => { },
    voiceEntry: true,
    setVoiceEntry: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

// Type for the View Transitions API (not yet in all TS lib versions)
type DocumentWithVT = Document & {
    startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export default function ThemeProvider({
    children,
    initialDark = false,
    initialPalette = "default",
    initialVoiceEntry = true,
}: {
    children: ReactNode;
    initialDark?: boolean;
    initialPalette?: PaletteId;
    initialVoiceEntry?: boolean;
}) {
    const [darkMode, setDarkMode] = useState(initialDark);
    const [palette, setPaletteState] = useState<PaletteId>(initialPalette);
    const [voiceEntry, setVoiceEntryState] = useState(initialVoiceEntry);

    // Sync cookie & theme-color meta tag whenever darkMode changes
    useEffect(() => {
        document.cookie = `theme=${darkMode ? "dark" : "light"};path=/;max-age=31536000`;

        // Update theme-color for PWA system UI (Android status bar, etc.)
        const themeColor = darkMode ? "#142210" : "#f6f8f6";
        document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
            el.setAttribute("content", themeColor);
        });
    }, [darkMode]);

    // Apply palette attribute & persist choice
    useEffect(() => {
        document.documentElement.dataset.palette = palette;
        document.cookie = `palette=${palette};path=/;max-age=31536000`;
    }, [palette]);

    // Persist the voice quick-record preference
    useEffect(() => {
        document.cookie = `voiceEntry=${voiceEntry ? "1" : "0"};path=/;max-age=31536000`;
    }, [voiceEntry]);

    const setPalette = (next: PaletteId) => setPaletteState(next);
    const setVoiceEntry = (enabled: boolean) => setVoiceEntryState(enabled);

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
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode, palette, setPalette, voiceEntry, setVoiceEntry }}>
            {children}
        </ThemeContext.Provider>
    );
}
