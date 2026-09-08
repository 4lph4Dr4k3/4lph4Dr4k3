import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Home, Trophy, Wind, Heart, Users, Flame, Sparkles, Award, Check, Plus, Trash2,
  Phone, X, ChevronRight, ChevronDown, MessageSquare, HandHeart, Star, Send, Lock,
  Clock, DollarSign, Zap, Settings, RotateCcw, Anchor, Gift, Volume2, VolumeX,
  Compass, Share2,
} from "lucide-react";
import {
  JOURNEY_TYPES, MILESTONES, READINGS, QUOTES, PRACTICES, ACHIEVEMENTS, BREATH_PRESETS,
  TAGS, MOODS, SLEEP, CHEST_BADGES, pickChestReward,
  todayISO, isoOf, dayIdx, fmtDate, daysSince, streakOf, levelOf, todaysChallenges, uid,
} from "./game.js";
import { load, save, newJourney } from "./storage.js";
import { CHIMES } from "./sound.js";
import { CARD_SIZE, drawRewardCard, shareOrDownload } from "./cards.js";

/* =========================================================
   STEADY — one day at a time
   Navy/indigo recovery companion with a full gamification
   layer: multi-journey tracking, XP + levels, daily practices,
   a mystery chest, streaks, badges, and breathing exercises.
========================================================= */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

:root{
  --bg:#0B1437; --bg2:#060C24;
  --card:#131E52; --card2:#0F1844;
  --line:rgba(255,255,255,0.09);
  --text:#F2F5FF; --soft:#93A0CE;
  --indigo:#4F5BFF; --indigo-lt:#8A92FF;
  --teal:#1FBFD4; --orange:#D97A0F; --purple:#8B5CF6;
  --green:#22C55E; --red:#E4573D; --gold:#F5B942;
}
*{box-sizing:border-box}
body{margin:0}

.root{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;position:relative;overflow-x:hidden}
.aurora{position:fixed;top:-160px;left:50%;transform:translateX(-50%);width:640px;height:560px;pointer-events:none;z-index:0;
  background:radial-gradient(circle,rgba(79,91,255,.30) 0%,rgba(139,92,246,.12) 42%,rgba(11,20,55,0) 70%);animation:drift 10s ease-in-out infinite}
@keyframes drift{0%,100%{opacity:.75;transform:translateX(-50%) scale(1)}50%{opacity:1;transform:translateX(-50%) scale(1.08)}}

@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.fade{animation:fade .34s cubic-bezier(.22,1,.36,1) both}
@keyframes pop{0%{transform:scale(.85);opacity:0}100%{transform:scale(1);opacity:1}}
.pop{animation:pop .32s cubic-bezier(.34,1.56,.64,1) both}
@keyframes rise{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-46px);opacity:0}}
.xp-float{animation:rise 1.1s ease-out forwards}

.card{background:var(--card);border:1px solid var(--line);border-radius:22px;box-shadow:0 18px 40px -26px #000}
.card2{background:var(--card2);border:1px solid var(--line);border-radius:18px}

.btn{background:linear-gradient(135deg,#5C67FF,#4038E0);color:#fff;border:none;border-radius:16px;
  font-family:'Poppins',sans-serif;font-weight:600;font-size:15px;padding:15px 18px;cursor:pointer;
  box-shadow:0 14px 30px -12px rgba(79,91,255,.75);transition:transform .14s ease,filter .14s ease;width:100%}
.btn:hover{filter:brightness(1.07)} .btn:active{transform:scale(.975)}
.btn:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}

.btn-soft{background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--text);border-radius:16px;
  font-family:'Inter',sans-serif;font-weight:600;font-size:14px;padding:13px 16px;cursor:pointer;width:100%;transition:.15s}
.btn-soft:hover{background:rgba(255,255,255,.11)} .btn-soft:active{transform:scale(.975)}
.btn-soft:disabled{opacity:.4;cursor:not-allowed}

.pill{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.07);border:1px solid var(--line);
  border-radius:999px;padding:7px 13px;font-size:12.5px;font-weight:600;color:var(--text)}

.chip{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;padding:8px 13px;border-radius:999px;
  border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--soft);cursor:pointer;transition:.16s}
.chip.on{background:linear-gradient(135deg,#5C67FF,#4038E0);color:#fff;border-color:transparent}

.inp{font-family:'Inter',sans-serif;font-size:14.5px;padding:13px 15px;border-radius:14px;border:1px solid var(--line);
  background:rgba(255,255,255,.05);color:var(--text);width:100%}
.inp::placeholder{color:#6B78A8}
.inp:focus{outline:none;border-color:var(--indigo)}

.tabbar{display:flex;padding:7px;margin:0 12px 12px;background:#0A1233;border:1px solid var(--line);border-radius:22px;
  position:sticky;bottom:12px;backdrop-filter:blur(12px)}
.tab{flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:4px;padding:9px 2px;
  cursor:pointer;color:#6B78A8;border-radius:16px;transition:.16s;font-family:'Inter',sans-serif;font-size:10.5px;font-weight:600}
.tab.on{color:#fff;background:linear-gradient(135deg,#5C67FF,#4038E0);box-shadow:0 10px 22px -12px rgba(79,91,255,.9)}

.seg{height:9px;border-radius:999px;background:rgba(255,255,255,.09);overflow:hidden}
.seg > div{height:100%;border-radius:999px;transition:width .7s cubic-bezier(.22,1,.36,1)}

.badge{width:100%;aspect-ratio:1;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;
  border:1px solid var(--line);background:rgba(255,255,255,.04);color:#5B6798;transition:.2s;padding:6px}
.badge.on{background:linear-gradient(150deg,#5C67FF,#8B5CF6);border-color:transparent;color:#fff;box-shadow:0 14px 26px -14px rgba(124,92,255,.9)}

.breath-orb{border-radius:50%;background:radial-gradient(circle at 35% 30%,#EEF0FF,#9AA4FF 60%,#5C67FF);
  box-shadow:0 0 70px 12px rgba(92,103,255,.45)}

.tile{flex:1;background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:16px;padding:13px 9px;text-align:center}

.chal{display:flex;align-items:center;gap:12px;padding:11px 0}
.chal-ic{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}

.overlay{position:fixed;inset:0;background:rgba(4,8,26,.72);backdrop-filter:blur(5px);display:flex;align-items:center;
  justify-content:center;z-index:60;padding:24px}

::selection{background:rgba(92,103,255,.4)}
:focus-visible{outline:2px solid var(--indigo-lt);outline-offset:2px}
input[type=range]{-webkit-appearance:none;width:100%;height:6px;border-radius:999px;background:rgba(255,255,255,.12)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;
  background:linear-gradient(135deg,#8A92FF,#4F5BFF);box-shadow:0 4px 12px rgba(79,91,255,.8);cursor:pointer}
input[type=checkbox]{accent-color:var(--indigo);width:19px;height:19px}
input[type=date],input[type=number]{color-scheme:dark}
details summary::-webkit-details-marker{display:none}

.switch{width:46px;height:27px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.08);
  position:relative;cursor:pointer;flex-shrink:0;transition:background .18s,border-color .18s;padding:0}
.switch::after{content:'';position:absolute;top:2px;left:2px;width:21px;height:21px;border-radius:50%;background:#fff;
  transition:transform .18s cubic-bezier(.22,1,.36,1);box-shadow:0 2px 6px rgba(0,0,0,.3)}
.switch.on{background:linear-gradient(135deg,#5C67FF,#4038E0);border-color:transparent}
.switch.on::after{transform:translateX(19px)}

@keyframes chestFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-7px) rotate(1deg)}}
.chest-bounce{animation:chestFloat 2.4s ease-in-out infinite}
@keyframes glowPulse{0%,100%{opacity:.55}50%{opacity:1}}
.glow-pulse{animation:glowPulse 1.8s ease-in-out infinite}
@keyframes slideDown{from{opacity:0;transform:translate(-50%,-16px)}to{opacity:1;transform:translate(-50%,0)}}
.slide-down{animation:slideDown .38s cubic-bezier(.22,1,.36,1) both}

@media (prefers-reduced-motion:reduce){.aurora,.fade,.pop,.xp-float,.chest-bounce,.glow-pulse,.slide-down{animation:none!important}}
`;

/* ---------------- confetti ---------------- */
function Confetti({ trigger }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ["#5C67FF", "#8B5CF6", "#1FBFD4", "#F5B942", "#22C55E", "#E4573D"];
    const cx = window.innerWidth / 2;
    const particles = Array.from({ length: 64 }, () => ({
      x: cx + (Math.random() - 0.5) * 140,
      y: window.innerHeight * 0.32,
      vx: (Math.random() - 0.5) * 8.5,
      vy: -Math.random() * 8 - 3,
      g: 0.26 + Math.random() * 0.14,
      size: 5 + Math.random() * 5,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.35,
    }));
    let raf, start;
    const DURATION = 1300;
    const tick = (t) => {
      if (!start) start = t;
      const elapsed = t - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const life = Math.max(0, 1 - elapsed / DURATION);
      particles.forEach((p) => {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (elapsed < DURATION) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); };
  }, [trigger]);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 85 }} aria-hidden="true" />;
}

/* ---------------- small pieces ---------------- */
function useCountUp(target, ms = 800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, start = null;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Ring({ pct, size = 200, stroke = 14, children, from = "#5C67FF", to = "#8B5CF6" }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const gid = `g${from.replace(/[^a-zA-Z0-9]/g, "")}${to.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} /><stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${gid})`}
          strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .9s cubic-bezier(.22,1,.36,1), stroke .3s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function H2({ children, sub }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 25, margin: 0 }}>{children}</h2>
      {sub && <p style={{ fontSize: 13, color: "var(--soft)", margin: "5px 0 0", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function TypePicker({ value, onChange, customLabel, onCustomLabel }) {
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: value === "custom" ? 12 : 0 }}>
        {JOURNEY_TYPES.map((jt) => (
          <button key={jt.id} type="button" className={`chip${value === jt.id ? " on" : ""}`}
            onClick={() => onChange(jt.id)} style={value === jt.id ? { background: jt.color, borderColor: "transparent", color: "#fff" } : {}}>
            <span>{jt.emoji}</span> {jt.label}
          </button>
        ))}
      </div>
      {value === "custom" && (
        <input className="inp" value={customLabel} placeholder="Name this journey" onChange={(e) => onCustomLabel(e.target.value)} />
      )}
    </>
  );
}

/* ---------------- top bar ---------------- */
function TopBar({ xp, streak, onProfile, onSettings }) {
  const lv = levelOf(xp);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "18px 18px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
        <div style={{ width: 32, height: 32, borderRadius: 11, background: "linear-gradient(135deg,#5C67FF,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={16} color="#fff" />
        </div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16 }}>Steady</div>
      </div>
      <div className="pill" title={`${streak} day login streak`}><Flame size={14} color="#F5B942" />{streak}</div>
      <button className="pill" onClick={onProfile} style={{ cursor: "pointer" }} aria-label={`${xp} sparks — open quests`}>
        <Sparkles size={14} color="#F5B942" />{xp}
      </button>
      <button onClick={onProfile} aria-label={`Level ${lv.level}, ${lv.name}`} style={{ border: "none", width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#5C67FF,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 12.5, color: "#fff", cursor: "pointer" }}>
        L{lv.level}
      </button>
      <button onClick={onSettings} aria-label="Settings" style={{ border: "1px solid var(--line)", background: "rgba(255,255,255,.06)", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--soft)", cursor: "pointer" }}>
        <Settings size={16} />
      </button>
    </div>
  );
}

/* ---------------- journey switcher ---------------- */
function JourneyBar({ journeys, activeId, onSwitch, onManage }) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "2px 2px 6px", marginBottom: 10 }}>
      {journeys.map((j) => {
        const jDays = daysSince(j.quitDate);
        const active = j.id === activeId;
        return (
          <button key={j.id} onClick={() => onSwitch(j.id)} className="chip"
            style={{ flexShrink: 0, whiteSpace: "nowrap", ...(active ? { background: j.color, color: "#fff", borderColor: "transparent" } : {}) }}>
            <span>{j.emoji}</span> {j.label} · {jDays}d
            {j.isPrimary && <Star size={10} fill="currentColor" />}
          </button>
        );
      })}
      <button onClick={onManage} className="chip" style={{ flexShrink: 0 }} aria-label="Manage journeys">
        <Settings size={12} />
      </button>
    </div>
  );
}

function JourneysSheet({ journeys, activeId, onSwitch, onEdit, onClose }) {
  return (
    <div className="overlay" style={{ alignItems: "flex-end", padding: 0 }} onClick={onClose}>
      <div className="card fade" style={{ width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", padding: "22px 20px 30px", maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20, marginRight: "auto" }}>Your journeys</div>
          <button className="btn-soft" style={{ width: "auto", padding: 8 }} onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--soft)", margin: "0 0 16px", lineHeight: 1.5 }}>
          Track more than one thing at a time. Each journey keeps its own start date, day count, and savings.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {journeys.map((j) => {
            const jDays = daysSince(j.quitDate);
            return (
              <div key={j.id} className="card2" style={{
                padding: "13px 15px", display: "flex", alignItems: "center", gap: 12,
                border: j.id === activeId ? `1.5px solid ${j.color}` : "1px solid var(--line)",
              }}>
                <button onClick={() => onSwitch(j.id)} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, color: "inherit" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: `${j.color}26`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{j.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                      {j.label}{j.isPrimary && <Star size={12} color="#F5B942" fill="#F5B942" />}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--soft)" }}>{jDays} day{jDays === 1 ? "" : "s"}</div>
                  </div>
                </button>
                <button className="btn-soft" style={{ width: "auto", padding: 8 }} onClick={() => onEdit(j)} aria-label={`Edit ${j.label}`}><Settings size={14} /></button>
              </div>
            );
          })}
        </div>
        <button className="btn" onClick={() => onEdit(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Plus size={16} /> Add a journey
        </button>
      </div>
    </div>
  );
}

function JourneyFormSheet({ journey, canDelete, onSave, onDelete, onSetPrimary, onReset, onClose }) {
  const isEdit = !!journey;
  const [type, setType] = useState(journey?.type || null);
  const [customLabel, setCustomLabel] = useState(journey?.type === "custom" ? journey.label : "");
  const [quitDate, setQuitDate] = useState(journey?.quitDate || todayISO());
  const [dailySpend, setDailySpend] = useState(String(journey?.dailySpend || ""));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const chosen = JOURNEY_TYPES.find((jt) => jt.id === type);
  const canSave = type && (type !== "custom" || customLabel.trim());

  const submit = () => {
    if (!canSave) return;
    const label = type === "custom" ? customLabel.trim() : chosen.label;
    onSave({ type, label, emoji: chosen.emoji, color: chosen.color, quitDate, dailySpend: Number(dailySpend) || 0 });
    onClose();
  };

  return (
    <div className="overlay" style={{ alignItems: "flex-end", padding: 0 }} onClick={onClose}>
      <div className="card fade" style={{ width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", padding: "22px 20px 30px", maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20, marginRight: "auto" }}>{isEdit ? "Edit journey" : "New journey"}</div>
          <button className="btn-soft" style={{ width: "auto", padding: 8 }} onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--soft)", display: "block", marginBottom: 8 }}>What are you working on?</label>
        <div style={{ marginBottom: 14 }}>
          <TypePicker value={type} onChange={setType} customLabel={customLabel} onCustomLabel={setCustomLabel} />
        </div>

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--soft)", display: "block", marginBottom: 7 }}>Start date</label>
        <input type="date" className="inp" value={quitDate} max={todayISO()} onChange={(e) => setQuitDate(e.target.value)} />

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--soft)", display: "block", margin: "16px 0 7px" }}>Rough daily spend before (optional)</label>
        <input type="number" min="0" step="0.01" className="inp" value={dailySpend} placeholder="0.00" onChange={(e) => setDailySpend(e.target.value)} />

        <button className="btn" style={{ marginTop: 18 }} disabled={!canSave} onClick={submit}>{isEdit ? "Save changes" : "Start this journey"}</button>

        {isEdit && (
          <>
            <div style={{ height: 1, background: "var(--line)", margin: "22px 0 18px" }} />
            {!journey.isPrimary && (
              <button className="btn-soft" style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => onSetPrimary(journey.id)}>
                <Star size={15} /> Make this my primary journey
              </button>
            )}
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15.5, marginBottom: 6 }}>Start the count again</div>
            <p style={{ fontSize: 13, color: "var(--soft)", lineHeight: 1.6, margin: "0 0 14px" }}>
              Resetting this journey's timer isn't erasing your progress — sparks, badges, and everything you've built stay exactly where they are.
            </p>
            {!confirmReset ? (
              <button className="btn-soft" onClick={() => setConfirmReset(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
                <RotateCcw size={15} /> Reset this timer to today
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button className="btn-soft" onClick={() => setConfirmReset(false)}>Cancel</button>
                <button className="btn" onClick={() => { onReset(journey.id); onClose(); }}>Yes, start today</button>
              </div>
            )}
            {canDelete && (
              !confirmDelete ? (
                <button className="btn-soft" style={{ color: "var(--red)", borderColor: "rgba(228,87,61,.4)" }} onClick={() => setConfirmDelete(true)}>Delete this journey</button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-soft" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  <button className="btn" style={{ background: "linear-gradient(135deg,#E4573D,#C0392B)" }} onClick={() => { onDelete(journey.id); onClose(); }}>Delete for good</button>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- settings sheet ---------------- */
function SettingsSheet({ soundOn, onToggleSound, onManageJourneys, onClose }) {
  return (
    <div className="overlay" style={{ alignItems: "flex-end", padding: 0 }} onClick={onClose}>
      <div className="card fade" style={{ width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", padding: "22px 20px 30px", maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20, marginRight: "auto" }}>Settings</div>
          <button className="btn-soft" style={{ width: "auto", padding: 8 }} onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>

        <button className="btn-soft" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 18 }} onClick={onManageJourneys}>
          <Compass size={15} /> Manage your journeys
        </button>

        <div style={{ height: 1, background: "var(--line)", margin: "0 0 18px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {soundOn ? <Volume2 size={17} color="var(--indigo-lt)" /> : <VolumeX size={17} color="var(--soft)" />}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14.5 }}>Sound effects</div>
            <div style={{ fontSize: 12, color: "var(--soft)" }}>Chimes for sparks, levels, and chests</div>
          </div>
          <button className={`switch${soundOn ? " on" : ""}`} role="switch" aria-checked={soundOn} aria-label="Toggle sound effects" onClick={() => onToggleSound(!soundOn)} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- readings & practices libraries ---------------- */
function ReadingsSheet({ onClose }) {
  const [open, setOpen] = useState(dayIdx() % READINGS.length);
  return (
    <div className="overlay" style={{ alignItems: "flex-end", padding: 0 }} onClick={onClose}>
      <div className="card fade" style={{ width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", padding: "22px 20px 30px", maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20, marginRight: "auto" }}>All readings</div>
          <button className="btn-soft" style={{ width: "auto", padding: 8 }} onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--soft)", margin: "0 0 16px", lineHeight: 1.5 }}>
          Original reflections — not affiliated with, or a substitute for, any program's own literature.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {READINGS.map((r, i) => (
            <div key={i} className="card2" style={{ padding: "14px 16px", cursor: "pointer", borderColor: i === open ? "var(--indigo)" : "var(--line)" }} onClick={() => setOpen(i === open ? -1 : i)}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, marginRight: "auto" }}>{r.t}</div>
                <ChevronDown size={16} color="var(--indigo-lt)" style={{ transform: i === open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </div>
              {i === open && <div style={{ fontSize: 13.5, color: "var(--soft)", lineHeight: 1.65, marginTop: 9 }}>{r.b}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PracticesSheet({ onClose }) {
  const [open, setOpen] = useState(dayIdx() % PRACTICES.length);
  return (
    <div className="overlay" style={{ alignItems: "flex-end", padding: 0 }} onClick={onClose}>
      <div className="card fade" style={{ width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", padding: "22px 20px 30px", maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20, marginRight: "auto" }}>Daily practices</div>
          <button className="btn-soft" style={{ width: "auto", padding: 8 }} onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--soft)", margin: "0 0 16px", lineHeight: 1.5 }}>
          One of these rotates in as today's practice. Small and concrete, aimed at how you actually feel — not just the streak.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PRACTICES.map((r, i) => (
            <div key={i} className="card2" style={{ padding: "14px 16px", cursor: "pointer", borderColor: i === open ? "var(--indigo)" : "var(--line)" }} onClick={() => setOpen(i === open ? -1 : i)}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, marginRight: "auto" }}>{r.t}</div>
                <ChevronDown size={16} color="var(--indigo-lt)" style={{ transform: i === open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </div>
              {i === open && <div style={{ fontSize: 13.5, color: "var(--soft)", lineHeight: 1.65, marginTop: 9 }}>{r.b}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- my why ---------------- */
function WhyCard({ reasons, setReasons }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const add = () => { if (!text.trim()) return; setReasons([...reasons, { id: uid("reason"), text: text.trim() }]); setText(""); setAdding(false); };

  return (
    <div className="card" style={{ padding: "18px", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <Anchor size={17} color="#1FBFD4" />
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 17, marginRight: "auto" }}>My why</div>
        <button className="btn-soft" style={{ width: "auto", padding: "7px 12px", fontSize: 12.5 }} onClick={() => setAdding(!adding)}>
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>
      {adding && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input className="inp" autoFocus value={text} placeholder="I want to stay sober because..." onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          <button className="btn" style={{ width: "auto", padding: "0 16px" }} onClick={add}><Plus size={17} /></button>
        </div>
      )}
      {reasons.length === 0 && !adding && (
        <div style={{ fontSize: 13.5, color: "var(--soft)", lineHeight: 1.6 }}>
          Write down why you're doing this while it's clear to you. It's much harder to come up with in the moment you actually need it.
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {reasons.map((r) => (
          <div key={r.id} className="card2" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, borderLeft: "3px solid #1FBFD4" }}>
            <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.5 }}>{r.text}</div>
            <button className="btn-soft" style={{ width: "auto", padding: 6 }} aria-label="Remove reason" onClick={() => setReasons(reasons.filter((x) => x.id !== r.id))}><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- craving sparkline ---------------- */
function Sparkline({ points }) {
  if (points.length < 2) return null;
  const w = 300, h = 70, max = 10;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - (p.craving / max) * (h - 10) - 5]);
  const path = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A92FF" stopOpacity=".35" />
          <stop offset="100%" stopColor="#8A92FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#spark)" />
      <path d={path} fill="none" stroke="#8A92FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={points[i].craving >= 7 ? "#E4573D" : points[i].craving >= 4 ? "#F5B942" : "#22C55E"} />
      ))}
    </svg>
  );
}

/* ---------------- level up modal ---------------- */
function LevelUp({ lv, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="card pop" style={{ padding: "30px 26px", textAlign: "center", maxWidth: 340, width: "100%" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 40, marginBottom: 4 }}>🎉</div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 24 }}>Level {lv.level}</div>
        <div style={{ color: "var(--indigo-lt)", fontWeight: 600, marginTop: 2 }}>{lv.name}</div>
        <p style={{ color: "var(--soft)", fontSize: 13.5, lineHeight: 1.6, margin: "12px 0 20px" }}>
          Levels track the small consistent things you're doing — not how "good" you are at recovery. Keep going.
        </p>
        <button className="btn" onClick={onClose}>Nice</button>
      </div>
    </div>
  );
}

/* ---------------- chest reward / share card modal ---------------- */
function ChestReward({ reward, journey, days, onClose }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    (async () => {
      if (!canvasRef.current) return;
      await drawRewardCard(canvasRef.current, reward, { journeyLabel: journey?.label, days });
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
  }, [reward, journey, days]);

  const heading = reward.kind === "badge" ? "New badge!"
    : reward.kind === "meme" ? "A little something"
    : reward.kind === "progress" ? "Share your progress"
    : "Your affirmation";
  const filename = `steady-${reward.kind}-${todayISO()}.png`;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="card pop" style={{ padding: "22px 20px 26px", textAlign: "center", maxWidth: 360, width: "100%" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{heading}</div>
        <div style={{ fontSize: 12.5, color: "var(--soft)", marginBottom: 16 }}>
          {reward.kind === "progress" ? "A card worth sharing" : "From today's mystery chest"}
        </div>
        <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 16, background: "#0B1437" }}>
          <canvas ref={canvasRef} width={CARD_SIZE} height={CARD_SIZE} style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
        <button className="btn-soft" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 8 }} disabled={!ready} onClick={() => shareOrDownload(canvasRef.current, filename)}>
          <Share2 size={15} /> Save / share image
        </button>
        <button className="btn" onClick={onClose}>Nice</button>
      </div>
    </div>
  );
}

/* ---------------- crisis modal ---------------- */
function Crisis({ onClose }) {
  return (
    <div className="overlay" style={{ alignItems: "flex-end", padding: 0 }} onClick={onClose}>
      <div className="card fade" style={{ width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", padding: "24px 20px 30px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(228,87,61,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Phone size={16} color="var(--red)" />
          </div>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 19, marginRight: "auto" }}>Talk to someone now</div>
          <button className="btn-soft" style={{ width: "auto", padding: 8 }} onClick={onClose}><X size={15} /></button>
        </div>
        <p style={{ color: "var(--soft)", fontSize: 13.5, lineHeight: 1.55, margin: "0 0 16px" }}>
          If today is heavier than you can carry alone, these lines are free, confidential, and staffed around the clock.
        </p>
        {[["SAMHSA National Helpline", "1-800-662-4357", "Free, confidential, 24/7 — treatment referral & support"],
          ["988 Suicide & Crisis Lifeline", "Call or text 988", "For any moment that feels unsafe, not only about substances"]].map(([a, b, c]) => (
          <div className="card2" key={a} style={{ padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{a}</div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18, color: "var(--indigo-lt)", margin: "3px 0" }}>{b}</div>
            <div style={{ fontSize: 12.5, color: "var(--soft)" }}>{c}</div>
          </div>
        ))}
        <button className="btn" style={{ marginTop: 8 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

/* ---------------- onboarding ---------------- */
function Onboarding({ onDone }) {
  const [type, setType] = useState(null);
  const [customLabel, setCustomLabel] = useState("");
  const [date, setDate] = useState(todayISO());
  const [spend, setSpend] = useState("");
  const chosen = JOURNEY_TYPES.find((jt) => jt.id === type);
  const canBegin = type && (type !== "custom" || customLabel.trim());

  const begin = () => {
    if (!canBegin) return;
    onDone({
      type, label: type === "custom" ? customLabel.trim() : chosen.label,
      emoji: chosen.emoji, color: chosen.color, quitDate: date, dailySpend: Number(spend) || 0,
    });
  };

  return (
    <div className="root fade" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 24 }}>
      <div className="aurora" />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 420, margin: "0 auto", width: "100%" }}>
        <div style={{ width: 52, height: 52, borderRadius: 17, background: "linear-gradient(135deg,#5C67FF,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <Sparkles size={26} color="#fff" />
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2.5, color: "var(--indigo-lt)", textTransform: "uppercase" }}>Steady</div>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 32, margin: "8px 0 10px", lineHeight: 1.15 }}>Let's mark your first day.</h1>
        <p style={{ color: "var(--soft)", fontSize: 14.5, lineHeight: 1.6, margin: "0 0 22px" }}>
          Start with one journey — you can add more anytime, each with its own start date and day count.
        </p>
        <div className="card" style={{ padding: 18, marginBottom: 18 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--soft)", display: "block", marginBottom: 8 }}>What are you working on?</label>
          <div style={{ marginBottom: 16 }}>
            <TypePicker value={type} onChange={setType} customLabel={customLabel} onCustomLabel={setCustomLabel} />
          </div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--soft)", display: "block", marginBottom: 7 }}>Start date</label>
          <input type="date" className="inp" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
          <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--soft)", display: "block", margin: "16px 0 7px" }}>Rough daily spend before (optional)</label>
          <input type="number" min="0" step="0.01" className="inp" placeholder="0.00" value={spend} onChange={(e) => setSpend(e.target.value)} />
        </div>
        <button className="btn" disabled={!canBegin} onClick={begin}>Begin</button>
        <p style={{ fontSize: 12, color: "var(--soft)", marginTop: 16, lineHeight: 1.6 }}>
          A companion for tracking your own progress — it works alongside a sponsor, a support group, or a counselor, not instead of one.
        </p>
      </div>
    </div>
  );
}

/* ---------------- HOME ---------------- */
function HomeTab({ d, days, live, challengeState, journeys, activeJourney, onSwitchJourney, onManageJourneys,
  onChallenge, onPledge, onRead, onOpenChest, onShareProgress, setReasons, openReadings, openPractices, go, openCrisis }) {
  const next = MILESTONES.find((m) => m.d > days) || MILESTONES[MILESTONES.length - 1];
  const prev = [...MILESTONES].reverse().find((m) => m.d <= days);
  const lo = prev ? prev.d : 0;
  const pct = Math.min(1, Math.max(0, (days - lo) / (next.d - lo || 1)));
  const reading = READINGS[dayIdx() % READINGS.length];
  const quote = QUOTES[dayIdx() % QUOTES.length];
  const practice = PRACTICES[dayIdx() % PRACTICES.length];
  const animDays = useCountUp(days);
  const pledged = d.pledgeDates.includes(todayISO());
  const done = challengeState.filter((c) => c.done).length;
  const badges = MILESTONES.filter((m) => m.d <= days).length;
  const saved = Math.round(days * (activeJourney?.dailySpend || 0));
  const chestOpened = d.chestDates.includes(todayISO());
  const perfectToday = challengeState.length > 0 && done === challengeState.length;
  const week = useMemo(() => {
    const out = []; const now = new Date(); const dow = now.getDay();
    for (let i = 0; i < 7; i++) { const x = new Date(now); x.setDate(now.getDate() - dow + i); out.push(x); }
    return out;
  }, []);

  return (
    <div className="fade" style={{ padding: "6px 18px 8px" }}>
      <JourneyBar journeys={journeys} activeId={activeJourney?.id} onSwitch={onSwitchJourney} onManage={onManageJourneys} />

      {/* timer */}
      <div className="card" style={{ padding: "24px 18px 22px", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 12 }}>
        <Ring pct={pct} size={206} from={activeJourney?.color || "#5C67FF"}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 52, lineHeight: 1 }}>{animDays}</div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--soft)", letterSpacing: 1 }}>{days === 1 ? "DAY FREE" : "DAYS FREE"}</div>
        </Ring>
        <div style={{ display: "flex", gap: 7, marginTop: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {[[live.h, "hrs", "#1FBFD4"], [live.m, "min", "#D97A0F"], [live.s, "sec", "#8B5CF6"]].map(([v, l, c]) => (
            <div key={l} style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--line)", borderRadius: 12, padding: "7px 13px", minWidth: 62, textAlign: "center" }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 17 }}>{String(v).padStart(2, "0")}</div>
              <div style={{ fontSize: 9.5, color: "var(--soft)", fontWeight: 600 }}>{l}</div>
              <div style={{ height: 3, borderRadius: 3, background: c, marginTop: 4, opacity: .85 }} />
            </div>
          ))}
        </div>
        <div style={{ width: "100%", marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--soft)", marginBottom: 6 }}>
            <span>{prev ? prev.label : "Getting started"}</span>
            <span style={{ color: "var(--indigo-lt)", fontWeight: 600 }}>{next.label} in {next.d - days}d</span>
          </div>
          <div className="seg"><div style={{ width: `${pct * 100}%`, background: "linear-gradient(90deg,#5C67FF,#8B5CF6)" }} /></div>
        </div>
      </div>

      {/* stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[[Clock, "#8A92FF", (days * 24).toLocaleString(), "HOURS"],
          [Award, "#F5B942", badges, "BADGES"],
          ...(activeJourney?.dailySpend > 0 ? [[DollarSign, "#22C55E", saved.toLocaleString(), "SAVED"]] : [])].map(([Ic, c, v, l], i) => (
          <div className="tile" key={i}>
            <Ic size={16} color={c} />
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 17, marginTop: 3 }}>{v}</div>
            <div style={{ fontSize: 9.5, color: "var(--soft)", fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      <button className="btn-soft" style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={onShareProgress}>
        <Share2 size={14} /> Share your progress
      </button>

      {/* practice pledge */}
      <button onClick={onPledge} className="card" style={{
        width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "16px 18px", marginBottom: 8, cursor: "pointer",
        border: pledged ? "none" : "1px solid var(--line)", background: pledged ? "linear-gradient(135deg,#5C67FF,#8B5CF6)" : "var(--card)", textAlign: "left",
      }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: pledged ? "rgba(255,255,255,.22)" : "rgba(79,91,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <HandHeart size={20} color={pledged ? "#fff" : "var(--indigo-lt)"} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, color: "#fff" }}>
            {pledged ? "Practice complete ✓" : practice.t}
          </div>
          <div style={{ fontSize: 12, color: pledged ? "rgba(255,255,255,.85)" : "var(--soft)" }}>
            {pledged ? "See you tomorrow for the next one" : practice.b}
          </div>
        </div>
        {!pledged && <div className="pill" style={{ background: "rgba(245,185,66,.15)", border: "none", color: "#F5B942" }}>+20</div>}
      </button>
      <button className="btn-soft" style={{ marginBottom: 12 }} onClick={openPractices}>Browse all practices</button>

      {/* mystery chest */}
      <div className="card" style={{
        padding: "16px 18px", marginBottom: 12, display: "flex", alignItems: "center", gap: 14,
        background: chestOpened ? "var(--card)" : "linear-gradient(135deg,rgba(245,185,66,.14),rgba(217,122,15,.08))",
        border: chestOpened ? "1px solid var(--line)" : "1px solid rgba(245,185,66,.35)",
      }}>
        <div className={chestOpened ? "" : "chest-bounce"} style={{
          width: 46, height: 46, borderRadius: 15, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: chestOpened ? "rgba(255,255,255,.05)" : "linear-gradient(135deg,#F5B942,#D97A0F)",
        }}>
          <Gift size={22} color={chestOpened ? "#5B6798" : "#221703"} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, color: chestOpened ? "var(--text)" : "#F5B942" }}>
            {chestOpened ? "Chest opened today" : "Today's mystery chest"}
          </div>
          <div style={{ fontSize: 12, color: "var(--soft)" }}>
            {chestOpened ? "A fresh one unlocks tomorrow" : "Sparks, an affirmation, a meme, or a badge"}
          </div>
        </div>
        {!chestOpened && <button className="btn" style={{ width: "auto", padding: "10px 18px" }} onClick={onOpenChest}>Open</button>}
      </div>

      {/* daily challenges */}
      <div className="card" style={{ padding: "18px 18px 8px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 19, marginRight: "auto" }}>Daily Challenges</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: perfectToday ? "#22C55E" : "var(--soft)" }}>
            {perfectToday ? "Perfect day ✓" : `${done} of ${challengeState.length} done`}
          </div>
        </div>
        <div className="seg" style={{ marginBottom: 6 }}>
          <div style={{ width: `${(done / challengeState.length) * 100}%`, background: "linear-gradient(90deg,#5C67FF,#22C55E)" }} />
        </div>
        {challengeState.map((c) => (
          <div className="chal" key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
            <div className="chal-ic" style={{ background: c.done ? c.color : `${c.color}28` }}>
              <c.Icon size={20} color={c.done ? "#fff" : c.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, textDecoration: c.done ? "line-through" : "none", color: c.done ? "var(--soft)" : "var(--text)" }}>{c.label}</div>
              <div style={{ fontSize: 11.5, color: "#F5B942", fontWeight: 600 }}>+{c.xp} sparks</div>
            </div>
            <button onClick={() => onChallenge(c)} disabled={c.done}
              style={{
                border: "none", borderRadius: 999, padding: "8px 15px", fontSize: 12.5, fontWeight: 700, cursor: c.done ? "default" : "pointer",
                background: c.done ? "rgba(34,197,94,.2)" : "rgba(255,255,255,.08)", color: c.done ? "#22C55E" : "#fff",
                fontFamily: "'Inter',sans-serif",
              }}>
              {c.done ? "Done" : "Mark"}
            </button>
          </div>
        ))}
      </div>

      {/* streak calendar */}
      <div className="card" style={{ padding: "18px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 17, marginRight: "auto" }}>My Commitment</div>
          <div className="pill" style={{ background: "rgba(245,185,66,.14)", border: "none", color: "#F5B942" }}>
            <Flame size={13} />{streakOf(d.loginDates)} day{streakOf(d.loginDates) === 1 ? "" : "s"}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {week.map((dt) => {
            const iso = isoOf(dt);
            const hit = d.loginDates.includes(iso);
            const isToday = iso === todayISO();
            const future = dt > new Date();
            return (
              <div key={iso} style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 10.5, color: "var(--soft)", marginBottom: 6 }}>{["S", "M", "T", "W", "T", "F", "S"][dt.getDay()]}</div>
                <div style={{
                  width: 30, height: 30, margin: "0 auto", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  background: hit ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,.05)",
                  border: isToday && !hit ? "1.5px solid var(--indigo-lt)" : "1px solid var(--line)",
                  opacity: future ? .4 : 1, fontSize: 11.5, fontWeight: 700, color: hit ? "#fff" : "var(--soft)",
                }}>
                  {hit ? <Check size={14} /> : dt.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn-soft" style={{ marginTop: 14 }} onClick={() => go("checkin")}>Check in with yourself →</button>
      </div>

      <WhyCard reasons={d.reasons} setReasons={setReasons} />

      {/* quote */}
      <div className="card" style={{ padding: "17px 19px", marginBottom: 12, borderLeft: "3px solid var(--indigo)" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.3, color: "var(--indigo-lt)", textTransform: "uppercase" }}>Today's line</div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 18, marginTop: 6, lineHeight: 1.35 }}>"{quote}"</div>
      </div>

      {/* reading */}
      <div className="card" style={{ padding: "19px", marginBottom: 12 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.3, color: "#22C55E", textTransform: "uppercase" }}>Daily reading</div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 18, margin: "6px 0 8px" }}>{reading.t}</div>
        <div style={{ fontSize: 14, color: "var(--soft)", lineHeight: 1.65 }}>{reading.b}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {!d.readDates.includes(todayISO()) && (
            <button className="btn-soft" onClick={onRead}>Mark as read · +15</button>
          )}
          <button className="btn-soft" onClick={openReadings}>Browse all</button>
        </div>
      </div>

      <button className="btn-soft" style={{ marginBottom: 16, color: "var(--red)", borderColor: "rgba(228,87,61,.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={openCrisis}>
        <Phone size={14} /> Need to talk to someone right now?
      </button>
    </div>
  );
}

/* ---------------- BREATHE ---------------- */
const BREATH_MIN = 130, BREATH_MAX = 250;

function BreatheTab({ sessions, onComplete }) {
  const [preset, setPreset] = useState(null);
  const [running, setRunning] = useState(false);
  const [total, setTotal] = useState(60);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(60);
  const [orbSize, setOrbSize] = useState(BREATH_MIN);

  // current phase is derived from elapsed time rather than tracked as its own state —
  // ticking it via a nested setState (setLeft's updater calling setPhaseI) used to skip
  // phases under React's dev-mode double-invoke of updater functions
  const cycleLen = useMemo(() => (preset ? preset.phases.reduce((s, [, d]) => s + d, 0) : 0), [preset]);
  const { phaseI, left } = useMemo(() => {
    if (!preset || !cycleLen) return { phaseI: 0, left: 0 };
    let t = elapsed % cycleLen;
    for (let i = 0; i < preset.phases.length; i++) {
      const d = preset.phases[i][1];
      if (t < d) return { phaseI: i, left: d - t };
      t -= d;
    }
    return { phaseI: 0, left: preset.phases[0][1] };
  }, [preset, cycleLen, elapsed]);

  useEffect(() => {
    if (!running || !preset) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running, preset]);

  useEffect(() => {
    if (running && elapsed >= total) {
      setRunning(false);
      onComplete(preset, total);
    }
  }, [elapsed, total, running, preset, onComplete]);

  const start = (p, secs) => {
    setPreset(p); setTotal(secs); setDuration(secs); setElapsed(0); setOrbSize(BREATH_MIN); setRunning(true);
  };

  // target orb size per phase — a Hold inherits whatever size the breath was already at,
  // so holding after an exhale stays small instead of ballooning back up
  const phaseTargets = useMemo(() => {
    if (!preset) return [];
    let last = BREATH_MIN;
    return preset.phases.map(([label]) => {
      if (label === "Breathe in") last = BREATH_MAX;
      else if (label === "Breathe out") last = BREATH_MIN;
      return last;
    });
  }, [preset]);

  // drive the orb size a beat after the phase changes so the browser has a painted
  // starting frame to transition from — flipping style + transition-duration in the
  // same render otherwise gets coalesced and the CSS transition never plays
  useEffect(() => {
    if (!running || !preset) return;
    const target = phaseTargets[phaseI] ?? BREATH_MIN;
    let raf2;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setOrbSize(target)); });
    return () => { cancelAnimationFrame(raf1); if (raf2) cancelAnimationFrame(raf2); };
  }, [phaseI, running, preset, phaseTargets]);

  if (running && preset) {
    const [label, secs] = preset.phases[phaseI];
    const holding = label === "Hold";
    const easing = holding ? "ease" : "cubic-bezier(.45,0,.55,1)";
    return (
      <div className="fade" style={{ padding: "10px 18px 8px", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 30, marginBottom: 6 }}>{label}</div>
        <div style={{ color: "var(--soft)", fontSize: 13, marginBottom: 34 }}>{preset.name}</div>
        <div style={{ height: 270, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className={`breath-orb${holding ? " glow-pulse" : ""}`} style={{
            width: orbSize, height: orbSize,
            transition: `width ${secs}s ${easing}, height ${secs}s ${easing}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 34, color: "#1B2455" }}>{left || secs}</span>
          </div>
        </div>
        <div style={{ width: "100%", maxWidth: 300, marginTop: 34 }}>
          <div className="seg"><div style={{ width: `${(elapsed / total) * 100}%`, background: "linear-gradient(90deg,#8A92FF,#5C67FF)" }} /></div>
          <div style={{ textAlign: "center", color: "var(--soft)", fontSize: 12.5, marginTop: 8 }}>{Math.max(0, total - elapsed)}s remaining</div>
        </div>
        <button className="btn-soft" style={{ maxWidth: 300, marginTop: 22 }} onClick={() => setRunning(false)}>Stop</button>
      </div>
    );
  }

  return (
    <div className="fade" style={{ padding: "10px 18px 8px" }}>
      <H2 sub="Slow breathing is one of the few things that reliably takes the edge off a craving in the moment. Pick a pattern and follow the circle.">Breathe</H2>

      <div className="card" style={{ padding: "16px 18px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(31,191,212,.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Wind size={20} color="#1FBFD4" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20 }}>{sessions.length}</div>
          <div style={{ fontSize: 12, color: "var(--soft)" }}>sessions completed · +25 sparks each</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[60, 120, 180].map((s) => (
          <button key={s} className="chip" onClick={() => setDuration(s)} style={{ flex: 1, justifyContent: "center", ...(duration === s ? { background: "linear-gradient(135deg,#5C67FF,#4038E0)", color: "#fff", borderColor: "transparent" } : {}) }}>
            {s / 60} min
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {BREATH_PRESETS.map((p) => (
          <button key={p.id} className="card" onClick={() => start(p, duration)}
            style={{ display: "flex", alignItems: "center", gap: 13, padding: "16px 18px", cursor: "pointer", textAlign: "left", width: "100%" }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: `${p.color}26`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Wind size={21} color={p.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15.5, color: "#fff" }}>{p.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--soft)", marginTop: 2 }}>{p.sub}</div>
              <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
                {p.phases.map(([l, s], i) => (
                  <span key={i} style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: "rgba(255,255,255,.06)", color: "var(--soft)" }}>{l} {s}s</span>
                ))}
              </div>
            </div>
            <ChevronRight size={18} color="var(--soft)" />
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, marginBottom: 6 }}>If a craving is peaking right now</div>
        <div style={{ fontSize: 13.5, color: "var(--soft)", lineHeight: 1.65 }}>
          Try Urge Surfing for three minutes, then check in with a person — not just the app. Breathing buys you time; people get you through the rest of it.
        </div>
      </div>
    </div>
  );
}

/* ---------------- QUESTS ---------------- */
function QuestsTab({ d, days, activeJourney, goals, setGoals }) {
  const lv = levelOf(d.xp);
  const [text, setText] = useState("");
  const add = () => { if (!text.trim()) return; setGoals([{ id: uid("goal"), text: text.trim(), done: false }, ...goals]); setText(""); };

  return (
    <div className="fade" style={{ padding: "10px 18px 8px" }}>
      {/* level card */}
      <div className="card" style={{ padding: "22px 20px", marginBottom: 14, display: "flex", alignItems: "center", gap: 16 }}>
        <Ring pct={lv.pct} size={96} stroke={9} from="#F5B942" to="#D97A0F">
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 24 }}>{lv.level}</div>
          <div style={{ fontSize: 9, color: "var(--soft)", fontWeight: 700, letterSpacing: 1 }}>LEVEL</div>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 19 }}>{lv.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#F5B942", fontWeight: 600, margin: "3px 0 10px" }}>
            <Sparkles size={13} /> {d.xp} sparks
          </div>
          <div className="seg" style={{ height: 7 }}><div style={{ width: `${lv.pct * 100}%`, background: "linear-gradient(90deg,#F5B942,#D97A0F)" }} /></div>
          <div style={{ fontSize: 11.5, color: "var(--soft)", marginTop: 6 }}>
            {lv.next ? `${lv.next.xp - d.xp} sparks to ${lv.next.name}` : "Top level reached"}
          </div>
        </div>
      </div>

      {/* streaks */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["Login streak", streakOf(d.loginDates), Flame, "#F5B942"],
          ["Practice streak", streakOf(d.pledgeDates), HandHeart, "#8B5CF6"],
          ["Check-in streak", streakOf(d.checkins.map((c) => c.date)), MessageSquare, "#1FBFD4"],
          ["Perfect streak", streakOf(d.perfectDates), Zap, "#22C55E"]].map(([l, v, Ic, c]) => (
          <div className="tile" key={l} style={{ minWidth: 84 }}>
            <Ic size={15} color={c} />
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18, marginTop: 3 }}>{v}</div>
            <div style={{ fontSize: 9.5, color: "var(--soft)", fontWeight: 600 }}>{l.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* milestone badges */}
      <H2 sub={`Unlocked automatically as ${activeJourney ? activeJourney.label : "your"} timer grows.`}>Milestones</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9, marginBottom: 24 }}>
        {MILESTONES.map((m) => {
          const on = days >= m.d;
          return (
            <div key={m.d} className={`badge${on ? " on" : ""}`}>
              {on ? <Award size={22} /> : <Lock size={17} />}
              <div style={{ fontSize: 9.5, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* achievements */}
      <H2 sub="Earned by showing up, not by how long you've been at it.">Achievements</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9, marginBottom: 24 }}>
        {ACHIEVEMENTS.map((a) => {
          const on = a.test(d);
          return (
            <div key={a.id} className={`badge${on ? " on" : ""}`} style={on ? { background: "linear-gradient(150deg,#F5B942,#D97A0F)" } : {}}>
              {on ? <Trophy size={20} /> : <Lock size={16} />}
              <div style={{ fontSize: 9.5, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{a.label}</div>
            </div>
          );
        })}
      </div>

      {/* chest badges */}
      <H2 sub="Collectible surprises from the daily mystery chest.">Badge Collection</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9, marginBottom: 24 }}>
        {CHEST_BADGES.map((b) => {
          const on = d.chestBadges.includes(b.id);
          return (
            <div key={b.id} className={`badge${on ? " on" : ""}`} style={on ? { background: `linear-gradient(150deg,${b.color},${b.color}99)` } : {}}>
              {on ? <span style={{ fontSize: 22, lineHeight: 1 }}>{b.emoji}</span> : <Lock size={16} />}
              <div style={{ fontSize: 9.5, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{b.label}</div>
            </div>
          );
        })}
      </div>

      {/* goals */}
      <H2 sub="Your own quests. Small and specific beats big and vague. +20 sparks each.">Your goals</H2>
      <div className="card" style={{ display: "flex", gap: 8, padding: 9, marginBottom: 14 }}>
        <input className="inp" style={{ border: "none", background: "transparent" }} value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="e.g. Call my sponsor before noon" />
        <button className="btn" style={{ width: "auto", padding: "0 17px" }} onClick={add}><Plus size={18} /></button>
      </div>
      {goals.length === 0 && <div style={{ fontSize: 13.5, color: "var(--soft)", fontStyle: "italic", padding: "4px 2px 12px" }}>No goals yet. Add one thing you want true by the end of today.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {goals.map((g) => (
          <div key={g.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 15px" }}>
            <input type="checkbox" checked={g.done} onChange={() => setGoals(goals.map((x) => x.id === g.id ? { ...x, done: !x.done } : x))} />
            <div style={{ flex: 1, fontSize: 14, color: g.done ? "var(--soft)" : "var(--text)", textDecoration: g.done ? "line-through" : "none" }}>{g.text}</div>
            <button className="btn-soft" style={{ width: "auto", padding: 8 }} onClick={() => setGoals(goals.filter((x) => x.id !== g.id))}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FEED ---------------- */
function FeedTab({ posts, setPosts, onPost }) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState(null);
  const share = () => {
    if (!text.trim()) return;
    setPosts([{ id: uid("post"), date: new Date().toISOString(), text: text.trim(), tag, milestone: false }, ...posts]);
    setText(""); setTag(null); onPost();
  };
  const rel = (iso) => {
    const m = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (m < 1) return "just now"; if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="fade" style={{ padding: "10px 18px 8px" }}>
      <H2 sub="A private journal styled like a support feed. Steady has no live member network — nothing here leaves your device.">Your feed</H2>

      <div className="card" style={{ padding: "14px 16px", marginBottom: 16 }}>
        <textarea className="inp" rows={3} value={text} onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind today?" style={{ border: "none", background: "transparent", resize: "none", padding: "4px 2px", fontFamily: "'Inter',sans-serif" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {TAGS.map((tg) => (
              <button key={tg.id} className="chip" onClick={() => setTag(tag === tg.id ? null : tg.id)}
                style={tag === tg.id ? { background: tg.color, color: "#fff", borderColor: "transparent" } : {}}>
                <tg.Icon size={12} /> {tg.label}
              </button>
            ))}
          </div>
          <button className="btn" style={{ width: "auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 7 }} disabled={!text.trim()} onClick={share}>
            <Send size={14} /> Share
          </button>
        </div>
      </div>

      {posts.length === 0 && <div style={{ fontSize: 13.5, color: "var(--soft)", fontStyle: "italic", padding: "4px 2px" }}>Nothing yet. Milestone celebrations post here automatically.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {posts.map((p) => {
          const tg = TAGS.find((x) => x.id === p.tag);
          return (
            <div key={p.id} className="card pop" style={{ padding: "14px 16px", ...(p.milestone ? { background: "linear-gradient(135deg,#5C67FF,#8B5CF6)", border: "none" } : {}) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.milestone ? "rgba(255,255,255,.25)" : "rgba(79,91,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.milestone ? <Award size={16} color="#fff" /> : <Sparkles size={15} color="var(--indigo-lt)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{p.milestone ? "Milestone" : "You"}</div>
                  <div style={{ fontSize: 11, color: p.milestone ? "rgba(255,255,255,.8)" : "var(--soft)" }}>{rel(p.date)}</div>
                </div>
                {tg && !p.milestone && <span className="chip" style={{ background: tg.color, color: "#fff", borderColor: "transparent" }}><tg.Icon size={11} />{tg.label}</span>}
                {!p.milestone && <button className="btn-soft" style={{ width: "auto", padding: 7 }} onClick={() => setPosts(posts.filter((x) => x.id !== p.id))}><Trash2 size={13} /></button>}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, fontWeight: p.milestone ? 600 : 400, fontFamily: p.milestone ? "'Poppins',sans-serif" : "'Inter',sans-serif" }}>{p.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- MEETINGS ---------------- */
function MeetingsTab({ openCrisis }) {
  const programs = [
    { n: "Alcoholics Anonymous (AA)", d: "12-step, focused on alcohol. Peer-led and free; formats vary — speaker, discussion, or step study.", u: "https://www.aa.org/find-aa", c: "#4F5BFF" },
    { n: "Narcotics Anonymous (NA)", d: "12-step, open to any substance. Same basic format as AA, run independently.", u: "https://www.na.org/meetingsearch/", c: "#8B5CF6" },
    { n: "SMART Recovery", d: "Secular, tools-based program grounded in CBT rather than a higher-power framework.", u: "https://www.smartrecovery.org/community/", c: "#1FBFD4" },
    { n: "Recovery Dharma", d: "Buddhist-influenced, meditation-centered approach to recovery.", u: "https://recoverydharma.org/meetings", c: "#22C55E" },
    { n: "In The Rooms", d: "Free platform hosting live video meetings across multiple recovery programs, all online.", u: "https://www.intherooms.com", c: "#D97A0F" },
  ];
  return (
    <div className="fade" style={{ padding: "10px 18px 8px" }}>
      <H2 sub="Schedules change constantly and vary by city, so Steady doesn't list specific times — these go to each program's own live meeting finder.">Meetings</H2>

      <button className="btn" style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg,#E4573D,#C0392B)", boxShadow: "0 14px 30px -12px rgba(228,87,61,.7)" }} onClick={openCrisis}>
        <Phone size={16} /> Talk to someone now
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {programs.map((p) => (
          <a key={p.n} href={p.u} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: "15px 17px", display: "flex", gap: 13, alignItems: "center" }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: `${p.c}26`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Users size={20} color={p.c} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "#fff" }}>{p.n}</div>
                <div style={{ fontSize: 12.5, color: "var(--soft)", marginTop: 3, lineHeight: 1.5 }}>{p.d}</div>
              </div>
              <ChevronRight size={18} color="var(--soft)" />
            </div>
          </a>
        ))}
      </div>

      <div className="card" style={{ padding: "18px 19px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 17, marginBottom: 10 }}>What to expect your first time</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--soft)", lineHeight: 1.75 }}>
          <li>You don't have to speak. Most meetings welcome you to just listen your first time.</li>
          <li>If you're asked to introduce yourself, a first name is enough.</li>
          <li>Online meetings usually let you keep your camera off.</li>
          <li>Formats differ meeting to meeting — if one doesn't fit, try another before deciding meetings aren't for you.</li>
          <li>It's normal for the first few to feel awkward. That eases with repetition.</li>
        </ul>
      </div>
    </div>
  );
}

/* ---------------- CHECK-IN ---------------- */
function CheckinTab({ checkins, onSave, openCrisis, goBreathe }) {
  const today = todayISO();
  const had = checkins.find((c) => c.date === today);
  const [craving, setCraving] = useState(had?.craving ?? 0);
  const [mood, setMood] = useState(had?.mood ?? "");
  const [sleep, setSleep] = useState(had?.sleep ?? "");
  const [gratitude, setGratitude] = useState(had?.gratitude ?? "");
  const [plan, setPlan] = useState(had?.plan ?? "");
  const [saved, setSaved] = useState(false);

  const msg = useMemo(() => {
    if (craving >= 7) return "That's a strong pull. Strong cravings are survivable, but not something to sit through solo — this is a good moment to call your sponsor, a support contact, or a helpline before you decide anything.";
    if (craving >= 4) return "Noted and real. Try naming what's underneath it — tired, lonely, bored, stressed — and meet that need directly rather than waiting the urge out alone.";
    if (mood === "Low" || mood === "Anxious") return "Thanks for being honest about where you are. A hard mood isn't a hard day by itself — see if there's one small, doable thing to anchor the next hour.";
    return "Good check-in. Keep doing what's working today.";
  }, [craving, mood]);

  const submit = () => { onSave({ date: today, craving, mood, sleep, gratitude, plan }); setSaved(true); setTimeout(() => setSaved(false), 1800); };
  const history = checkins.slice(0, 7);

  return (
    <div className="fade" style={{ padding: "10px 18px 8px" }}>
      <H2 sub="A short daily read on where you're at. Supplements a sponsor or counselor — it doesn't replace one. +25 sparks.">Daily check-in</H2>

      <div className="card" style={{ padding: "20px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>Craving right now</div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 34, color: craving >= 7 ? "var(--red)" : craving >= 4 ? "#F5B942" : "#22C55E" }}>{craving}<span style={{ fontSize: 16, color: "var(--soft)" }}>/10</span></div>
        <input type="range" min="0" max="10" value={craving} onChange={(e) => setCraving(+e.target.value)} style={{ marginTop: 8 }} />

        <div style={{ fontSize: 13.5, fontWeight: 700, margin: "20px 0 8px" }}>Mood</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {MOODS.map((m) => <button key={m} className={`chip${mood === m ? " on" : ""}`} onClick={() => setMood(m)}>{m}</button>)}
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 700, margin: "20px 0 8px" }}>Sleep last night</div>
        <div style={{ display: "flex", gap: 7 }}>
          {SLEEP.map((s) => <button key={s} className={`chip${sleep === s ? " on" : ""}`} style={{ flex: 1, justifyContent: "center" }} onClick={() => setSleep(s)}>{s}</button>)}
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 700, margin: "20px 0 8px" }}>One thing you're grateful for</div>
        <input className="inp" value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="—" />

        <div style={{ fontSize: 13.5, fontWeight: 700, margin: "16px 0 8px" }}>Your plan for today</div>
        <input className="inp" value={plan} onChange={(e) => setPlan(e.target.value)} placeholder="—" />

        <button className="btn" style={{ marginTop: 20 }} onClick={submit}>{saved ? "Saved ✓" : "Save check-in"}</button>
      </div>

      <div className="card" style={{ padding: "16px 17px", marginBottom: 14, borderLeft: `3px solid ${craving >= 7 ? "var(--red)" : "var(--indigo)"}` }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, color: craving >= 7 ? "var(--red)" : "var(--indigo-lt)", textTransform: "uppercase", marginBottom: 5 }}>Your insight</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{msg}</div>
        {craving >= 4 && <button className="btn-soft" style={{ marginTop: 12 }} onClick={goBreathe}>Try a breathing session →</button>}
        {craving >= 7 && <button className="btn-soft" style={{ marginTop: 8, color: "var(--red)", borderColor: "rgba(228,87,61,.4)" }} onClick={openCrisis}>See support lines →</button>}
      </div>

      {history.length > 1 && (
        <div className="card" style={{ padding: "18px 18px 12px", marginBottom: 14 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Craving trend</div>
          <div style={{ fontSize: 12, color: "var(--soft)", marginBottom: 12 }}>Last {history.length} check-ins, oldest first</div>
          <Sparkline points={[...history].reverse()} />
        </div>
      )}

      {history.length > 0 && (
        <>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 16, margin: "0 0 10px" }}>Last few days</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {history.map((c) => (
              <div key={c.date} className="card2" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", fontSize: 13 }}>
                <span style={{ color: "var(--soft)" }}>{fmtDate(c.date)}</span>
                <span style={{ fontWeight: 600 }}>{c.mood || "—"}</span>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: c.craving >= 7 ? "var(--red)" : c.craving >= 4 ? "#F5B942" : "#22C55E" }}>{c.craving}/10</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- APP ---------------- */
const TABS = [
  { id: "home", label: "Home", Icon: Home },
  { id: "quests", label: "Quests", Icon: Trophy },
  { id: "breathe", label: "Breathe", Icon: Wind },
  { id: "feed", label: "Feed", Icon: Heart },
  { id: "meetings", label: "Meetings", Icon: Users },
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [d, setD] = useState(null);
  const [tab, setTab] = useState("home");
  const [crisis, setCrisis] = useState(false);
  const [settings, setSettings] = useState(false);
  const [readings, setReadings] = useState(false);
  const [practices, setPractices] = useState(false);
  const [journeysOpen, setJourneysOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState(undefined); // undefined=closed, null=new, obj=edit
  const [levelUp, setLevelUp] = useState(null);
  const [toast, setToast] = useState(null);
  const [achieveToast, setAchieveToast] = useState(null);
  const [chestReward, setChestReward] = useState(null);
  const [burst, setBurst] = useState(0);
  const [live, setLive] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => { load().then((x) => { setD(x); setLoading(false); }); }, []);

  const persist = useCallback((next) => { setD(next); save(next); }, []);

  const activeJourney = useMemo(() => {
    if (!d || !d.journeys.length) return null;
    return d.journeys.find((j) => j.id === d.activeJourneyId) || d.journeys.find((j) => j.isPrimary) || d.journeys[0];
  }, [d]);

  // live clock
  useEffect(() => {
    if (!activeJourney) return;
    const tick = () => {
      const start = new Date(activeJourney.quitDate + "T00:00:00");
      const ms = Date.now() - start.getTime();
      setLive({ h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1000) % 60 });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [activeJourney]);

  const days = activeJourney ? daysSince(activeJourney.quitDate) : 0;

  /* award xp once per key */
  const award = useCallback((base, amount, key, label, kind = "spark") => {
    if (base.awarded.includes(key)) return base;
    const before = levelOf(base.xp);
    const next = { ...base, xp: base.xp + amount, awarded: [...base.awarded, key] };
    const after = levelOf(next.xp);
    setToast({ id: Date.now(), amount, label });
    setTimeout(() => setToast(null), 1200);
    if (base.soundOn) CHIMES[kind]?.();
    if (kind !== "spark") setBurst((b) => b + 1);
    if (after.level > before.level) {
      setTimeout(() => setLevelUp(after), 400);
      setTimeout(() => setBurst((b) => b + 1), 420);
      if (base.soundOn) setTimeout(() => CHIMES.level(), 400);
    }
    return next;
  }, []);

  /* challenge state (auto-detect + manual) */
  const challengeState = useMemo(() => {
    if (!d) return [];
    const t = todayISO();
    return todaysChallenges().map((c) => {
      let done = d.manualChallenges.includes(`${t}:${c.id}`);
      if (!done && c.auto) {
        if (c.auto === "pledge") done = d.pledgeDates.includes(t);
        if (c.auto === "breathe") done = d.breathSessions.some((s) => s.date === t);
        if (c.auto === "checkin") done = d.checkins.some((x) => x.date === t);
        if (c.auto === "post") done = d.posts.some((p) => !p.milestone && p.date.slice(0, 10) === t);
        if (c.auto === "read") done = d.readDates.includes(t);
        if (c.auto === "goal") done = d.goals.some((g) => g.done);
      }
      return { ...c, done };
    });
  }, [d]);

  /* Daily login, milestone celebrations, the perfect-day bonus, and achievement
     unlocks are evaluated together in one effect rather than four separate ones.
     Each used to read the same outer `d` and call persist() with a plain object;
     whenever two of them qualified in the same commit (e.g. adding a backdated
     journey instantly clears a milestone AND the Multi-Tracker achievement),
     the second persist() silently clobbered the first's update — XP would be
     awarded but the milestone's celebration post would vanish. Threading a
     single `next` through all four checks makes that impossible. */
  useEffect(() => {
    if (loading || !d || !activeJourney) return;
    const t = todayISO();
    let next = d;
    let changed = false;

    if (!next.loginDates.includes(t)) {
      next = { ...next, loginDates: [...next.loginDates, t] };
      next = award(next, 10, `login:${t}`, "Daily visit");
      changed = true;
    }

    const aj = next.journeys.find((j) => j.id === activeJourney.id);
    if (aj) {
      const freshMs = MILESTONES.filter((m) => m.d <= days && !aj.notifiedMilestones.includes(m.d));
      if (freshMs.length) {
        const journeys = next.journeys.map((j) => j.id === aj.id
          ? { ...j, notifiedMilestones: [...j.notifiedMilestones, ...freshMs.map((m) => m.d)] }
          : j);
        next = {
          ...next, journeys,
          posts: [...freshMs.map((m) => ({ id: uid("post"), date: new Date().toISOString(), text: `${m.label} ${aj.label.toLowerCase()}-free. Another one in the log — on to the next.`, tag: null, milestone: true })), ...next.posts],
        };
        freshMs.forEach((m) => { next = award(next, 100, `ms:${aj.id}:${m.d}`, `${m.label} · ${aj.label}`, "milestone"); });
        changed = true;
      }
    }

    if (challengeState.length && !challengeState.some((c) => !c.done) && !next.perfectDates.includes(t)) {
      next = { ...next, perfectDates: [...next.perfectDates, t] };
      next = award(next, 30, `perfect:${t}`, "Perfect day", "perfect");
      changed = true;
    }

    const freshAch = ACHIEVEMENTS.filter((a) => a.test(next) && !next.earnedAchievements.includes(a.id));
    if (freshAch.length) {
      next = { ...next, earnedAchievements: [...next.earnedAchievements, ...freshAch.map((a) => a.id)] };
      freshAch.forEach((a) => { next = award(next, 50, `ach:${a.id}`, a.label, "achievement"); });
      setAchieveToast({ id: Date.now(), label: freshAch[0].label });
      setTimeout(() => setAchieveToast(null), 2600);
      changed = true;
    }

    if (changed) persist(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, activeJourney && activeJourney.id, days, challengeState, d]);

  /* breathing sessions are logged via a functional setD update since the running
     timer inside BreatheTab can complete well after this closure was created */
  const doBreath = useCallback((preset, secs) => {
    setD((cur) => {
      const next = award({ ...cur, breathSessions: [...cur.breathSessions, { date: todayISO(), preset: preset.id, secs }] },
        25, `breath:${todayISO()}:${cur.breathSessions.length}`, "Breathing session");
      save(next); return next;
    });
  }, [award]);

  if (loading || !d) return <div className="root"><style>{CSS}</style></div>;

  /* actions */
  const t = todayISO();
  const doPledge = () => {
    if (d.pledgeDates.includes(t)) return persist({ ...d, pledgeDates: d.pledgeDates.filter((x) => x !== t) });
    persist(award({ ...d, pledgeDates: [...d.pledgeDates, t] }, 20, `pledge:${t}`, "Practice complete"));
  };
  const doChallenge = (c) => {
    if (c.done) return;
    persist(award({ ...d, manualChallenges: [...d.manualChallenges, `${t}:${c.id}`] }, c.xp, `chal:${t}:${c.id}`, c.label));
  };
  const doRead = () => persist(award({ ...d, readDates: [...d.readDates, t] }, 15, `read:${t}`, "Reading done"));
  const doCheckin = (entry) => {
    const rest = d.checkins.filter((c) => c.date !== entry.date);
    persist(award({ ...d, checkins: [entry, ...rest].sort((a, b) => (a.date < b.date ? 1 : -1)) }, 25, `checkin:${entry.date}`, "Check-in logged"));
  };
  const doPost = () => persist(award({ ...d }, 20, `post:${t}`, "Shared a win"));
  const doChest = () => {
    if (d.chestDates.includes(t)) return;
    const reward = pickChestReward(d.chestBadges);
    let next = { ...d, chestDates: [...d.chestDates, t] };
    if (reward.kind === "badge") next = { ...next, chestBadges: [...next.chestBadges, reward.badge.id] };
    const label = reward.kind === "sparks" ? "Mystery chest"
      : reward.kind === "badge" ? `${reward.badge.label} badge`
      : reward.kind === "meme" ? "A little something"
      : "An affirmation";
    const amount = reward.kind === "sparks" ? reward.amount : 15;
    next = award(next, amount, `chest:${t}`, label, "chest");
    persist(next);
    if (reward.kind !== "sparks") setChestReward(reward);
  };
  const shareProgress = () => setChestReward({ kind: "progress" });
  const toggleSound = (on) => persist({ ...d, soundOn: on });
  const setGoals = (goals) => {
    const newlyDone = goals.filter((g) => g.done && !d.goals.find((x) => x.id === g.id && x.done));
    let next = { ...d, goals };
    newlyDone.forEach((g) => { next = award(next, 20, `goal:${g.id}`, "Goal complete"); });
    persist(next);
  };
  const setPosts = (posts) => persist({ ...d, posts });
  const setReasons = (reasons) => persist({ ...d, reasons });

  /* journeys */
  const addJourney = (draft) => {
    const journey = newJourney(draft, d.journeys.length === 0);
    persist({ ...d, journeys: [...d.journeys, journey], activeJourneyId: journey.id });
  };
  const updateJourney = (id, patch) => persist({ ...d, journeys: d.journeys.map((j) => (j.id === id ? { ...j, ...patch } : j)) });
  const setPrimaryJourney = (id) => persist({ ...d, journeys: d.journeys.map((j) => ({ ...j, isPrimary: j.id === id })) });
  const resetJourney = (id) => {
    const rt = todayISO();
    persist({ ...d, journeys: d.journeys.map((j) => (j.id === id ? { ...j, quitDate: rt, resets: [...j.resets, rt], notifiedMilestones: [] } : j)) });
  };
  const deleteJourney = (id) => {
    if (d.journeys.length <= 1) return;
    let remaining = d.journeys.filter((j) => j.id !== id);
    if (!remaining.some((j) => j.isPrimary)) remaining = remaining.map((j, i) => (i === 0 ? { ...j, isPrimary: true } : j));
    const nextActive = d.activeJourneyId === id ? (remaining.find((j) => j.isPrimary) || remaining[0]).id : d.activeJourneyId;
    persist({ ...d, journeys: remaining, activeJourneyId: nextActive });
  };
  const switchJourney = (id) => persist({ ...d, activeJourneyId: id });
  const openEditJourney = (j) => { setJourneysOpen(false); setEditingJourney(j); };
  const closeEditJourney = () => { setEditingJourney(undefined); setJourneysOpen(true); };

  if (!d.journeys.length) {
    return (<><style>{CSS}</style><Onboarding onDone={(draft) => {
      const journey = newJourney(draft, true);
      persist({ ...d, journeys: [journey], activeJourneyId: journey.id });
    }} /></>);
  }

  const lv = levelOf(d.xp);

  return (
    <div className="root" style={{ display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style>
      <div className="aurora" />
      <Confetti trigger={burst} />
      <div style={{ flex: 1, maxWidth: 480, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
        <TopBar xp={d.xp} streak={streakOf(d.loginDates)} onProfile={() => setTab("quests")} onSettings={() => setSettings(true)} />
        <div style={{ height: 3, background: "rgba(255,255,255,.07)", margin: "0 18px 10px" }} title={`Level ${lv.level} · ${lv.into}/${lv.span} to ${lv.next ? lv.next.name : "max level"}`}>
          <div style={{ height: "100%", width: `${lv.pct * 100}%`, background: "linear-gradient(90deg,#5C67FF,#8B5CF6)", borderRadius: 999, transition: "width .6s cubic-bezier(.22,1,.36,1)" }} />
        </div>
        {tab === "home" && <HomeTab d={d} days={days} live={live} challengeState={challengeState}
          journeys={d.journeys} activeJourney={activeJourney} onSwitchJourney={switchJourney} onManageJourneys={() => setJourneysOpen(true)}
          onChallenge={doChallenge} onPledge={doPledge} onRead={doRead} onOpenChest={doChest} onShareProgress={shareProgress}
          setReasons={setReasons} openReadings={() => setReadings(true)} openPractices={() => setPractices(true)} go={setTab} openCrisis={() => setCrisis(true)} />}
        {tab === "quests" && <QuestsTab d={d} days={days} activeJourney={activeJourney} goals={d.goals} setGoals={setGoals} />}
        {tab === "breathe" && <BreatheTab sessions={d.breathSessions} onComplete={doBreath} />}
        {tab === "feed" && <FeedTab posts={d.posts} setPosts={setPosts} onPost={doPost} />}
        {tab === "meetings" && <MeetingsTab openCrisis={() => setCrisis(true)} />}
        {tab === "checkin" && <CheckinTab checkins={d.checkins} onSave={doCheckin} openCrisis={() => setCrisis(true)} goBreathe={() => setTab("breathe")} />}
      </div>
      <div style={{ maxWidth: 480, margin: "0 auto", width: "100%", position: "relative", zIndex: 3 }}>
        <div className="tabbar">
          {TABS.map((x) => (
            <button key={x.id} className={`tab${tab === x.id ? " on" : ""}`} onClick={() => setTab(x.id)}>
              <x.Icon size={19} strokeWidth={tab === x.id ? 2.4 : 1.9} />
              <span>{x.label}</span>
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div key={`toast-${toast.id}`} className="xp-float" style={{
          position: "fixed", bottom: 110, left: "50%", transform: "translateX(-50%)", zIndex: 70,
          background: "linear-gradient(135deg,#F5B942,#D97A0F)", color: "#221703", padding: "10px 18px",
          borderRadius: 999, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7,
          boxShadow: "0 12px 26px -10px rgba(245,185,66,.8)", fontFamily: "'Poppins',sans-serif",
        }}>
          <Zap size={15} /> +{toast.amount} · {toast.label}
        </div>
      )}
      {achieveToast && (
        <div key={`achieve-${achieveToast.id}`} className="slide-down" style={{
          position: "fixed", top: 14, left: "50%", zIndex: 75, maxWidth: 380, width: "calc(100% - 32px)",
          background: "linear-gradient(135deg,#F5B942,#D97A0F)", color: "#221703", padding: "12px 16px",
          borderRadius: 16, display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 16px 34px -14px rgba(245,185,66,.85)",
        }}>
          <Trophy size={20} />
          <div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13.5 }}>Achievement unlocked</div>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{achieveToast.label} · +50 sparks</div>
          </div>
        </div>
      )}
      {levelUp && <LevelUp lv={levelUp} onClose={() => setLevelUp(null)} />}
      {chestReward && <ChestReward reward={chestReward} journey={activeJourney} days={days} onClose={() => setChestReward(null)} />}
      {settings && <SettingsSheet soundOn={d.soundOn} onToggleSound={toggleSound} onManageJourneys={() => { setSettings(false); setJourneysOpen(true); }} onClose={() => setSettings(false)} />}
      {journeysOpen && <JourneysSheet journeys={d.journeys} activeId={d.activeJourneyId} onSwitch={(id) => { switchJourney(id); setJourneysOpen(false); }} onEdit={openEditJourney} onClose={() => setJourneysOpen(false)} />}
      {editingJourney !== undefined && (
        <JourneyFormSheet
          journey={editingJourney}
          canDelete={d.journeys.length > 1}
          onSave={(draft) => { if (editingJourney) updateJourney(editingJourney.id, draft); else addJourney(draft); }}
          onDelete={deleteJourney}
          onSetPrimary={setPrimaryJourney}
          onReset={resetJourney}
          onClose={closeEditJourney}
        />
      )}
      {readings && <ReadingsSheet onClose={() => setReadings(false)} />}
      {practices && <PracticesSheet onClose={() => setPractices(false)} />}
      {crisis && <Crisis onClose={() => setCrisis(false)} />}
    </div>
  );
}
