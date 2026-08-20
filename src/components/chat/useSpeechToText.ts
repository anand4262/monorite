"use client";

import { useEffect, useRef, useState } from "react";

// The Web Speech API's SpeechRecognition isn't in TypeScript's standard
// DOM lib yet — minimal shape for what this hook actually uses.
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Microphone access was blocked. Check your browser's site permissions.",
  "service-not-allowed": "Microphone access was blocked. Check your browser's site permissions.",
  "no-speech": "Didn't catch that. Try again.",
  "audio-capture": "No microphone found.",
  network: "Voice input needs a network connection.",
};

/**
 * Thin wrapper around the browser's built-in speech recognition — no
 * server round trip, no audio ever leaves the device. Only Chrome/Edge/
 * Safari implement it (as a vendor-prefixed global), so `isSupported`
 * gates whether the mic button renders at all rather than showing a
 * button that silently does nothing on unsupported browsers (Firefox).
 */
export function useSpeechToText(onFinalTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  onFinalTranscriptRef.current = onFinalTranscript;

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;
    setIsSupported(true);

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results as ArrayLike<SpeechRecognitionResultLike>)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
      if (transcript) onFinalTranscriptRef.current(transcript);
    };
    recognition.onerror = (event) => {
      // "aborted" fires on a normal user-initiated stop() — not a real
      // error, don't show anything for it.
      if (event.error !== "aborted") {
        setError(ERROR_MESSAGES[event.error] ?? "Voice input isn't working right now.");
      }
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, []);

  function toggleListening() {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  }

  return { isSupported, isListening, toggleListening, error };
}
