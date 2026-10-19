"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSpeechRecognition } from "@/lib/hooks/useSpeechRecognition";
import { useVoiceRecorder } from "@/lib/hooks/useVoiceRecorder";
import {
  createVoiceTransaction,
  transcribeVoice,
  type VoiceTransactionResult,
} from "@/lib/api/voice";
import {
  parseVoiceTransaction,
  type ParsedVoiceTransaction,
} from "@/lib/voice/parse";
import { notifyTransactionsChanged } from "@/lib/events";
import { ApiError } from "@/lib/api/types";

interface VoiceButtonProps {
  lang: string;
  /** When the backend STT is available, save immediately instead of filling the form. */
  autoSave?: boolean;
  onResult?: (parsed: ParsedVoiceTransaction, raw: string) => void;
  onSaved?: (result: VoiceTransactionResult) => void;
  onError?: (code: string) => void;
  className?: string;
}

export default function VoiceButton({
  lang,
  autoSave = false,
  onResult,
  onSaved,
  onError,
  className = "",
}: VoiceButtonProps) {
  const t = useTranslations("Voice");
  const [busy, setBusy] = useState(false);

  const handleError = (code: string) => {
    if (code !== "no-speech" && code !== "aborted") {
      console.error("Voice input error:", code);
    }
    onError?.(code);
  };

  const recorder = useVoiceRecorder({
    onRecorded: async (wav) => {
      setBusy(true);
      try {
        if (autoSave) {
          const res = await createVoiceTransaction(wav);
          notifyTransactionsChanged();
          onSaved?.(res.data);
        } else {
          const res = await transcribeVoice(wav);
          const data = res.data;
          onResult?.(
            {
              amount: data.amount || undefined,
              description: data.description || undefined,
              type: data.type,
              category: data.category || undefined,
              priority: data.priority || undefined,
              notes: data.notes || undefined,
              date: data.date || undefined,
            },
            data.text,
          );
        }
      } catch (error) {
        const body = error instanceof ApiError ? error.body : undefined;
        const message =
          body && typeof body === "object" && "error" in body
            ? String((body as { error?: unknown }).error)
            : error instanceof Error
              ? error.message
              : "backend-transcription-failed";
        console.error("Voice backend error:", message);
        onError?.(message);
        if (autoSave && typeof window !== "undefined") window.alert(message);
      } finally {
        setBusy(false);
      }
    },
    onError: handleError,
  });

  const speech = useSpeechRecognition({
    lang,
    onResult: (text) => onResult?.(parseVoiceTransaction(text), text),
    onError: handleError,
  });

  const useBackend = recorder.supported;
  const supported = useBackend || speech.supported;
  const listening = useBackend ? recorder.recording : speech.listening;

  if (!supported) return null;

  const toggle = () => {
    if (busy) return;
    if (useBackend) recorder.toggle();
    else speech.toggle();
  };

  const title = busy
    ? t("processing")
    : listening
      ? t("listening")
      : t("label");

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={t("label")}
      aria-pressed={listening}
      title={title}
      className={`relative flex items-center justify-center size-10 rounded-full transition-all active:scale-95 cursor-pointer disabled:opacity-60 ${
        listening
          ? "bg-expense-red text-white shadow-lg shadow-expense-red/30"
          : "bg-primary/10 text-primary"
      } ${className}`}
    >
      {listening && (
        <span className="absolute inset-0 rounded-full bg-expense-red/40 animate-ping" />
      )}
      {busy ? (
        <svg
          className="relative size-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative size-5"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      )}
    </button>
  );
}
