let audioCtx;
function ensureAudio() {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  } catch (e) { return null; }
}

function playChime(freqs, dur = 0.16, type = "sine", gain = 0.05) {
  const ctx = ensureAudio();
  if (!ctx) return;
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type; osc.frequency.value = f;
    osc.connect(g); g.connect(ctx.destination);
    const t0 = ctx.currentTime + i * 0.07;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.start(t0); osc.stop(t0 + dur + 0.03);
  });
}

export const CHIMES = {
  spark: () => playChime([880], 0.14, "sine", 0.05),
  level: () => playChime([523.25, 659.25, 783.99, 1046.5], 0.2, "triangle", 0.07),
  achievement: () => playChime([659.25, 987.77, 1318.51], 0.2, "triangle", 0.06),
  milestone: () => playChime([440, 659.25, 880, 1174.7], 0.24, "triangle", 0.07),
  perfect: () => playChime([783.99, 987.77, 1318.51], 0.2, "sine", 0.06),
  chest: () => playChime([659.25, 987.77], 0.16, "square", 0.045),
};
