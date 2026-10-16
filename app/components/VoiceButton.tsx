"use client";

import { useTranslations } from "next-intl";
import { useSpeechRecognition } from "@/lib/hooks/useSpeechRecognition";
import {
  parseVoiceTransaction,
  type ParsedVoiceTransaction,
} from "@/lib/voice/parse";

interface VoiceButtonProps {
  lang: string;
  onResult: (parsed: ParsedVoiceTransaction, raw: string) => void;
  className?: string;
}

export default function VoiceButton({
  lang,
  onResult,
  className = "",
}: VoiceButtonProps) {
  const t = useTranslations("Voice");
  const { supported, listening, toggle } = useSpeechRecognition({
    lang,
    onResult: (text) => onResult(parseVoiceTransaction(text), text),
    onError: (error) => {
      if (error !== "no-speech" && error !== "aborted") {
        console.error("Speech recognition error:", error);
      }
    },
  });

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("label")}
      aria-pressed={listening}
      title={listening ? t("listening") : t("label")}
      className={`relative flex items-center justify-center size-10 rounded-full transition-all active:scale-95 cursor-pointer ${
        listening
          ? "bg-expense-red text-white shadow-lg shadow-expense-red/30"
          : "bg-primary/10 text-primary"
      } ${className}`}
    >
      {listening && (
        <span className="absolute inset-0 rounded-full bg-expense-red/40 animate-ping" />
      )}
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
    </button>
  );
}
