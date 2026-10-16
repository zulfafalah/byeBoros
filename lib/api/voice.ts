import { api } from "./client";

/** Structured transaction returned by the backend voice endpoints. */
export interface VoiceTransactionResult {
  message?: string;
  text: string;
  amount: number;
  description: string;
  type?: "income" | "expense";
  priority?: string;
  notes?: string;
  date?: string;
  category?: string;
  created: boolean;
}

export interface VoiceApiResponse {
  status?: string;
  data: VoiceTransactionResult;
  error?: string;
  candidates?: string[];
}

function toForm(audio: Blob, filename: string): FormData {
  const form = new FormData();
  form.append("file", audio, filename);
  return form;
}

/**
 * Transcribe audio and parse it into transaction fields (no persistence).
 * Spreadsheet ID, sheet name and auth token are injected by the API client.
 */
export async function transcribeVoice(audio: Blob, filename = "audio.wav") {
  return api.postForm<VoiceApiResponse>("/api/voice/transcribe", toForm(audio, filename));
}

/**
 * Transcribe audio, parse it and save the resulting transaction.
 * Spreadsheet ID, sheet name and auth token are injected by the API client.
 */
export async function createVoiceTransaction(audio: Blob, filename = "audio.wav") {
  return api.postForm<VoiceApiResponse>("/api/voice/transaction", toForm(audio, filename));
}
