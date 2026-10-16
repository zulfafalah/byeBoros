"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { blobToWav16kMono } from "@/lib/voice/audio";

interface UseVoiceRecorderOptions {
  /** Called with a 16 kHz mono WAV blob once recording stops. */
  onRecorded: (wav: Blob) => void;
  onError?: (code: string) => void;
}

/**
 * Records microphone audio via MediaRecorder and normalizes it to a 16 kHz
 * mono WAV blob suitable for the backend STT endpoint.
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
  const chunksRef = useRef<Blob[]>([]);
  const onRecordedRef = useRef(onRecorded);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onRecordedRef.current = onRecorded;
    onErrorRef.current = onError;
  }, [onRecorded, onError]);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const start = useCallback(async () => {
    if (!supported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        setRecording(false);
        cleanupStream();
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
        cleanupStream();
        onErrorRef.current?.("recorder-error");
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      cleanupStream();
      onErrorRef.current?.("mic-permission-denied");
    }
  }, [supported, cleanupStream]);

  const toggle = useCallback(() => {
    if (recording) stop();
    else void start();
  }, [recording, start, stop]);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      cleanupStream();
    };
  }, [cleanupStream]);

  return { supported, recording, start, stop, toggle };
}
