"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useVoiceRecorder } from "@/lib/hooks/useVoiceRecorder";
import { createVoiceTransaction } from "@/lib/api/voice";
import { ApiError } from "@/lib/api/types";

/**
 * Center bottom-nav action. Records a short clip, sends it to the backend STT
 * endpoint and saves the recognized expense, then refreshes the current view.
 * Falls back to the manual expense form when recording is unavailable.
 */
export default function RecordExpenseButton() {
  const t = useTranslations("Voice");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const recorder = useVoiceRecorder({
    onRecorded: async (wav) => {
      setBusy(true);
      try {
        await createVoiceTransaction(wav);
        router.replace("/");
        router.refresh();
      } catch (error) {
        const body = error instanceof ApiError ? error.body : undefined;
        const message =
          body && typeof body === "object" && "error" in body
            ? String((body as { error?: unknown }).error)
            : error instanceof Error
              ? error.message
              : "voice-failed";
        if (typeof window !== "undefined") window.alert(message);
      } finally {
        setBusy(false);
      }
    },
    onError: (code) => {
      if (code !== "aborted" && typeof window !== "undefined") {
        window.alert(code);
      }
    },
  });

  if (!recorder.supported) {
    return (
      <Link href="/expense" aria-label={t("label")} className="relative -top-8">
        <div className="size-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-background-light dark:border-background-dark transition-transform active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="size-7">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </Link>
    );
  }

  const recording = recorder.recording;
  const title = busy ? t("processing") : recording ? t("listening") : t("recordExpense");

  return (
    <button
      type="button"
      onClick={() => {
        if (!busy) recorder.toggle();
      }}
      disabled={busy}
      aria-label={t("recordExpense")}
      aria-pressed={recording}
      title={title}
      className="relative -top-8 outline-none"
    >
      {recording && (
        <span className="absolute inset-0 rounded-full bg-expense-red/40 animate-ping" />
      )}
      <div
        className={`relative size-14 rounded-full flex items-center justify-center shadow-lg border-4 border-background-light dark:border-background-dark transition-transform active:scale-90 ${
          recording
            ? "bg-expense-red text-white shadow-expense-red/40"
            : "bg-primary text-on-primary shadow-primary/40"
        }`}
      >
        {busy ? (
          <svg className="size-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : recording ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </div>
    </button>
  );
}
