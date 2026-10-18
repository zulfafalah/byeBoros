"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { blobToWav16kMono } from "@/lib/voice/audio";

/** RMS below which the mic is considered silent. */
const SILENCE_RMS = 0.015;
/** How long the user must stay silent after speaking before auto-stopping. */
const SILENCE_MS = 1800;
/** Max time to wait for the user to start speaking before giving up. */
const MAX_LEAD_SILENCE_MS = 8000;
/** Hard cap on a single recording. */
const MAX_DURATION_MS = 20000;

interface UseVoiceRecorderOptions {
  /** Called with a 16 kHz mono WAV blob once recording stops. */
  onRecorded: (wav: Blob) => void;
  onError?: (code: string) => void;
}

/**
 * Records microphone audio via MediaRecorder and normalizes it to a 16 kHz
 * mono WAV blob suitable for the backend STT endpoint. Stops automatically
 * once the user stops speaking (or after a timeout).
 */
export function useVoiceRecorder({ onRecorded, onError }: UseVoiceRecorderOptions) {
  const [supported] = useState(
    () =>
      typeof navigator !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      typeof MediaRecorder !== "undefined",
  );
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const vadTimerRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);
  const chunksRef = useRef<Blob[]>([]);
  const onRecordedRef = useRef(onRecorded);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onRecordedRef.current = onRecorded;
    onErrorRef.current = onError;
  }, [onRecorded, onError]);

  const cleanup = useCallback(() => {
    if (vadTimerRef.current !== null) {
      window.clearInterval(vadTimerRef.current);
      vadTimerRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    mediaRecorderRef.current?.stop();
  }, []);

  const startSilenceDetection = useCallback((stream: MediaStream, onSilence: () => void) => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    const buffer = new Float32Array(analyser.fftSize);

    let hasSpeech = false;
    let lastVoiceAt = Date.now();
    const startedAt = Date.now();

    vadTimerRef.current = window.setInterval(() => {
      analyser.getFloatTimeDomainData(buffer);
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
      const rms = Math.sqrt(sum / buffer.length);
      const now = Date.now();

      if (rms > SILENCE_RMS) {
        hasSpeech = true;
        lastVoiceAt = now;
      }

      if (hasSpeech && now - lastVoiceAt >= SILENCE_MS) {
        onSilence();
      } else if (!hasSpeech && now - startedAt >= MAX_LEAD_SILENCE_MS) {
        onSilence();
      } else if (now - startedAt >= MAX_DURATION_MS) {
        onSilence();
      }
    }, 100);
  }, []);

  const start = useCallback(async () => {
    if (!supported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      stoppedRef.current = false;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        setRecording(false);
        cleanup();
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        try {
          const wav = await blobToWav16kMono(blob);
          onRecordedRef.current(wav);
        } catch {
          onErrorRef.current?.("audio-conversion-failed");
        }
      };
      recorder.onerror = () => {
        setRecording(false);
        cleanup();
        onErrorRef.current?.("recorder-error");
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);

      startSilenceDetection(stream, stop);
    } catch {
      cleanup();
      onErrorRef.current?.("mic-permission-denied");
    }
  }, [supported, cleanup, stop, startSilenceDetection]);

  const toggle = useCallback(() => {
    if (recording) stop();
    else void start();
  }, [recording, start, stop]);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      mediaRecorderRef.current?.stop();
      cleanup();
    };
  }, [cleanup]);

  return { supported, recording, start, stop, toggle };
}
