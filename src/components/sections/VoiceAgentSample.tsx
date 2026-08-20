"use client";

import { useRef, useState } from "react";
import { Pause, Phone, Play } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { callSample } from "@/data/callSample";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** No live line to call yet (the receptionist is inbound-only and still in
 * pilot, and there's no number wired up for visitors to ring), so instead
 * of a "try it live" button that can't deliver, this plays a generated
 * recreation of the exact call script already shown on /ai-receptionist —
 * real product copy, spoken, not a new claim. Labeled as a recreation
 * throughout rather than implying it's a recorded real customer call. */
export default function VoiceAgentSample() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      void audio.play();
    }
  }

  return (
    <section className="border-t border-canvas-border py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="AI Phone Receptionist"
          title="Hear it handle a real call scenario."
          description="A recreation of the exact call script from our AI Phone Receptionist pilot, spoken aloud so you can hear how it actually sounds, not just read the transcript."
        />

        <Reveal delay={0.16} blurIn>
          <div className="mt-14 grid gap-8 rounded-3xl border border-canvas-border bg-canvas-surface/60 p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
            <audio
              ref={audioRef}
              src="/audio/sample-call.mp3"
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
            />

            <button
              type="button"
              onClick={toggle}
              aria-label={isPlaying ? "Pause sample call" : "Play sample call"}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-colors duration-300 hover:bg-accent-soft"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
            </button>

            <div className="min-w-0">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  Sample call — after hours, burst pipe
                </p>
                <p className="shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">
                  {formatTime(progress)} / {formatTime(duration)}
                </p>
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-canvas-border/60">
                <div
                  className="h-full rounded-full bg-ink transition-[width] duration-150 ease-linear"
                  style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-6">
          <div className="flex flex-col gap-2.5 rounded-2xl border border-canvas-border bg-canvas-surface/40 p-6">
            {callSample.map((line, i) => (
              <p
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  line.speaker === "agent"
                    ? "ml-auto rounded-tr-sm bg-ink text-canvas"
                    : "rounded-tl-sm bg-canvas-soft text-ink-muted",
                )}
              >
                {line.text}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.24} className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-relaxed text-ink-faint">
            A recreated scenario using our own call script, not a live line. The receptionist currently
            handles inbound calls for pilot businesses — there&apos;s no public number to call yet.
          </p>
          <Button href="/ai-receptionist" variant="secondary" size="sm" showArrow={false}>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-4 w-4" />
              See what happens on a real emergency call
            </span>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
