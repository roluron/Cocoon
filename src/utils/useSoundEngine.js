import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

const MODE_CONFIG = {
  wake: {
    pad: { attack: 2.0, release: 4.5, type: 'triangle' },
    notes: ['C4', 'E4', 'G4', 'B4', 'D5'],
    interval: 4.8,
    baseFreq: 520,
    reverb: 6,
    delay: 0.42,
    volume: -18,
  },
  focus: {
    pad: { attack: 3.0, release: 6.0, type: 'sine' },
    notes: ['C3', 'G3', 'C4', 'E4'],
    interval: 7.2,
    baseFreq: 320,
    reverb: 10,
    delay: 0.66,
    volume: -21,
  },
  create: {
    pad: { attack: 1.4, release: 5.0, type: 'sawtooth' },
    notes: ['D3', 'F3', 'A3', 'C4', 'E4', 'G4'],
    interval: 3.6,
    baseFreq: 420,
    reverb: 9,
    delay: 0.55,
    volume: -20,
  },
  move: {
    pad: { attack: 0.4, release: 1.6, type: 'square' },
    notes: ['A2', 'E3', 'A3', 'C4', 'E4'],
    interval: 1.2,
    baseFreq: 280,
    reverb: 4,
    delay: 0.28,
    volume: -19,
  },
  rest: {
    pad: { attack: 5.0, release: 10.0, type: 'sine' },
    notes: ['C2', 'G2', 'C3', 'E3'],
    interval: 10.5,
    baseFreq: 180,
    reverb: 14,
    delay: 0.85,
    volume: -24,
  },
};

const MOOD_TINT = {
  serene: 1.04,
  peaceful: 0.98,
  energized: 1.1,
  light: 1.06,
  creative: 1.02,
  restless: 1.12,
  melancholy: 0.9,
  heavy: 0.85,
};

export function useSoundEngine({ mode, mood, volume, fadeOut }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const nodesRef = useRef(null);
  const loopRef = useRef(null);
  const fadeTimeoutRef = useRef(null);
  const stopRampRef = useRef(null);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const cleanup = useCallback(() => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (stopRampRef.current) {
      clearTimeout(stopRampRef.current);
      stopRampRef.current = null;
    }
    if (loopRef.current) {
      loopRef.current.stop();
      loopRef.current.dispose();
      loopRef.current = null;
    }
    if (nodesRef.current) {
      Object.values(nodesRef.current).forEach((n) => n?.dispose?.());
      nodesRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const build = useCallback((m, mo) => {
    cleanup();
    const cfg = MODE_CONFIG[m];
    const tint = MOOD_TINT[mo] ?? 1;

    const reverb = new Tone.Reverb({ decay: cfg.reverb, wet: 0.85 }).toDestination();
    const delay = new Tone.FeedbackDelay({
      delayTime: cfg.delay,
      feedback: 0.35,
      wet: 0.4,
    }).connect(reverb);
    const filter = new Tone.Filter({
      frequency: cfg.baseFreq * tint,
      type: 'lowpass',
      Q: 0.6,
    }).connect(delay);

    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: cfg.pad.type },
      envelope: {
        attack: cfg.pad.attack,
        decay: 0.6,
        sustain: 0.6,
        release: cfg.pad.release,
      },
    }).connect(filter);
    pad.volume.value = cfg.volume;

    // slow filter LFO for living texture
    const lfo = new Tone.LFO({
      frequency: 0.04,
      min: cfg.baseFreq * tint * 0.7,
      max: cfg.baseFreq * tint * 1.5,
    }).connect(filter.frequency);
    lfo.start();

    nodesRef.current = { pad, filter, delay, reverb, lfo };

    let i = 0;
    loopRef.current = new Tone.Loop((time) => {
      const a = cfg.notes[i % cfg.notes.length];
      const b = cfg.notes[(i + 2) % cfg.notes.length];
      pad.triggerAttackRelease([a, b], cfg.interval * 0.9, time);
      i++;
    }, cfg.interval);
  }, [cleanup]);

  const stop = useCallback(() => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (stopRampRef.current) {
      clearTimeout(stopRampRef.current);
    }
    Tone.Destination.volume.rampTo(-60, 0.8);
    stopRampRef.current = setTimeout(() => {
      stopRampRef.current = null;
      if (loopRef.current) loopRef.current.stop();
      Tone.Transport.pause();
      cleanup();
      Tone.Destination.volume.value = Tone.gainToDb(volumeRef.current);
      setPlaying(false);
    }, 900);
  }, [cleanup]);

  const play = async () => {
    setLoading(true);
    try {
      await Tone.start();
    } catch {
      setLoading(false);
      return;
    }
    build(mode, mood);
    Tone.Destination.volume.rampTo(Tone.gainToDb(volume), 0.5);
    Tone.Transport.start();
    loopRef.current.start(0);
    setPlaying(true);
    setLoading(false);
  };

  // rebuild when mode/mood changes while playing
  useEffect(() => {
    if (!playing) return;
    build(mode, mood);
    loopRef.current?.start(0);
  }, [mode, mood, playing, build]);

  // volume live update
  useEffect(() => {
    if (!playing) return;
    Tone.Destination.volume.rampTo(Tone.gainToDb(volume), 0.4);
  }, [volume, playing]);

  // fade-to-silence scheduler
  useEffect(() => {
    if (!playing) return;
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    if (!fadeOut) return;
    const ms = fadeOut * 60 * 1000;
    const fadeStart = Math.max(0, ms - 20000);
    fadeTimeoutRef.current = setTimeout(() => {
      Tone.Destination.volume.rampTo(-60, 20);
      stopRampRef.current = setTimeout(() => stop(), 20000);
    }, fadeStart);
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [fadeOut, playing, stop]);

  return { playing, loading, play, stop };
}
