"use client";

import { useRef } from "react";

export function useTone() {
  const ctxRef = useRef<AudioContext | null>(null);

  function getCtx() {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const C = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
      if (!C) return null;
      ctxRef.current = new C();
    }
    return ctxRef.current;
  }

  function playTone(freq: number, duration = 0.12, type: OscillatorType = "sine") {
    const ctx = getCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.4, now + 0.01);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    o.stop(now + duration + 0.02);
  }

  function success() {
    playTone(880, 0.12, "sine");
  }

  function error() {
    playTone(220, 0.18, "sawtooth");
  }

  function click() {
    playTone(1200, 0.06, "square");
  }

  return { success, error, click, playTone };
}
