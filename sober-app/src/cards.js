export const CARD_SIZE = 1080;

// Cached module-wide so concurrent card draws (e.g. React dev-mode double-invoking
// an effect) share one in-flight load instead of racing separate document.fonts.load()
// calls, which could otherwise leave a stray fallback glyph baked into a canvas.
let fontsReady = null;
function ensureFontsLoaded() {
  if (!fontsReady) {
    fontsReady = (async () => {
      try {
        if (document.fonts) {
          await Promise.all([
            document.fonts.load("800 64px Poppins"),
            document.fonts.load("700 46px Poppins"),
            document.fonts.load("600 32px Inter"),
            document.fonts.load("500 26px Inter"),
          ]);
        }
      } catch (e) { /* falls back to default sans-serif */ }
    })();
  }
  return fontsReady;
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(ctx, text, x, y, maxWidth, lineHeight, draw) {
  const drawFn = draw || ((l, lx, ly) => ctx.fillText(l, lx, ly));
  const lines = wrapLines(ctx, text, maxWidth);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => drawFn(l, x, startY + i * lineHeight));
  return lines.length;
}

/**
 * Renders a shareable 1:1 card onto `canvas` for the given chest/progress reward.
 * reward.kind: "affirmation" | "meme" | "badge" | "progress"
 * meta: { journeyLabel, days }
 */
export async function drawRewardCard(canvas, reward, meta = {}) {
  await ensureFontsLoaded();
  const ctx = canvas.getContext("2d");
  const S = canvas.width;
  ctx.clearRect(0, 0, S, S);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const accent = reward.kind === "badge" ? reward.badge.color
    : reward.kind === "meme" ? "#1FBFD4"
    : reward.kind === "progress" ? "#5C67FF"
    : "#8B5CF6";

  const bg = ctx.createLinearGradient(0, 0, S, S);
  bg.addColorStop(0, "#131E52");
  bg.addColorStop(1, "#060C24");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  const glow = ctx.createRadialGradient(S / 2, S * 0.36, 10, S / 2, S * 0.36, S * 0.62);
  glow.addColorStop(0, `${accent}4d`);
  glow.addColorStop(1, `${accent}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, S, S);

  if (reward.kind === "affirmation") {
    ctx.font = "600 32px Inter, sans-serif";
    ctx.fillStyle = "#8A92FF";
    ctx.fillText("TODAY'S AFFIRMATION", S / 2, S * 0.27);
    ctx.font = "700 56px Poppins, sans-serif";
    ctx.fillStyle = "#F2F5FF";
    drawWrapped(ctx, `"${reward.text}"`, S / 2, S * 0.5, S * 0.78, 72);
  } else if (reward.kind === "meme") {
    ctx.lineJoin = "round";
    ctx.font = "800 62px Poppins, sans-serif";
    const topDraw = (l, lx, ly) => {
      ctx.lineWidth = 10; ctx.strokeStyle = "#000"; ctx.strokeText(l, lx, ly);
      ctx.fillStyle = "#fff"; ctx.fillText(l, lx, ly);
    };
    drawWrapped(ctx, reward.meme.top.toUpperCase(), S / 2, S * 0.24, S * 0.86, 68, topDraw);
    ctx.font = "800 54px Poppins, sans-serif";
    drawWrapped(ctx, reward.meme.bottom.toUpperCase(), S / 2, S * 0.78, S * 0.86, 60, topDraw);
  } else if (reward.kind === "badge") {
    const cy = S * 0.42, r = S * 0.22;
    ctx.font = "600 28px Inter, sans-serif";
    ctx.fillStyle = "#93A0CE";
    ctx.fillText("BADGE UNLOCKED", S / 2, cy - r - 46);
    const grad = ctx.createRadialGradient(S / 2 - r * 0.3, cy - r * 0.3, r * 0.15, S / 2, cy, r);
    grad.addColorStop(0, reward.badge.color);
    grad.addColorStop(1, `${reward.badge.color}aa`);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(S / 2, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.font = `${Math.round(r * 0.85)}px serif`;
    ctx.fillText(reward.badge.emoji, S / 2, cy + r * 0.05);
    ctx.font = "700 44px Poppins, sans-serif";
    ctx.fillStyle = "#F2F5FF";
    ctx.fillText(reward.badge.label, S / 2, cy + r + 64);
  } else if (reward.kind === "progress") {
    ctx.font = "600 30px Inter, sans-serif";
    ctx.fillStyle = "#8A92FF";
    ctx.fillText((meta.journeyLabel || "MY JOURNEY").toUpperCase(), S / 2, S * 0.3);
    ctx.font = "800 220px Poppins, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText(String(meta.days ?? 0), S / 2, S * 0.5);
    ctx.font = "700 38px Poppins, sans-serif";
    ctx.fillStyle = "#93A0CE";
    ctx.fillText(meta.days === 1 ? "DAY FREE" : "DAYS FREE", S / 2, S * 0.6);
  }

  ctx.font = "700 30px Poppins, sans-serif";
  ctx.fillStyle = "#8A92FF";
  ctx.fillText("✨ STEADY", S / 2, S * 0.92);
  if (meta.journeyLabel && reward.kind !== "progress") {
    ctx.font = "500 24px Inter, sans-serif";
    ctx.fillStyle = "#93A0CE";
    ctx.fillText(`Day ${meta.days ?? 0} · ${meta.journeyLabel}`, S / 2, S * 0.965);
  }
}

/**
 * Shares the canvas as a PNG via the Web Share API when available (with files),
 * falling back to a plain browser download.
 *
 * Note: sandboxed preview surfaces (like an embedded artifact iframe) may block
 * both the share sheet and programmatic downloads — this works in a normal
 * browser tab / installed app.
 */
export async function shareOrDownload(canvas, filename) {
  if (!canvas) return;
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  try {
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "Steady" });
      return;
    }
  } catch (e) { /* share cancelled or unsupported — fall through to download */ }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
