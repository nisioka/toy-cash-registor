let ctx: AudioContext | null = null;

export function initAudio(): void {
  if (ctx) return;
  const AudioCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  ctx = new AudioCtor();
}

export function playBeep(): void {
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(1320, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
  gain.gain.linearRampToValueAtTime(0, now + 0.12);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.14);
}

export function playChime(): void {
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }

  const now = ctx.currentTime;
  const notes = [
    { freq: 660, start: 0, dur: 0.18 },
    { freq: 880, start: 0.12, dur: 0.18 },
    { freq: 990, start: 0.24, dur: 0.28 },
  ];

  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, now + note.start);
    gain.gain.setValueAtTime(0, now + note.start);
    gain.gain.linearRampToValueAtTime(0.2, now + note.start + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + note.start + note.dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + note.start);
    osc.stop(now + note.start + note.dur + 0.02);
  }
}
