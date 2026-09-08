import {
  Wind, MessageSquare, Send, BookOpen, Dumbbell, Users, Target, Sparkles,
  HandHeart, Heart, Star, CloudRain,
} from "lucide-react";

/* ---------------- journeys ---------------- */
export const JOURNEY_TYPES = [
  { id: "alcohol", label: "Alcohol", emoji: "🍷", color: "#4F5BFF" },
  { id: "nicotine", label: "Nicotine", emoji: "🚬", color: "#D97A0F" },
  { id: "drugs", label: "Drugs", emoji: "💊", color: "#8B5CF6" },
  { id: "porn", label: "Porn", emoji: "🔒", color: "#E4573D" },
  { id: "social", label: "Social Media", emoji: "📱", color: "#1FBFD4" },
  { id: "gambling", label: "Gambling", emoji: "🎰", color: "#22C55E" },
  { id: "food", label: "Food / Binge Eating", emoji: "🍽", color: "#F5B942" },
  { id: "custom", label: "Custom", emoji: "✨", color: "#8A92FF" },
];

/* ---------------- content ---------------- */
export const MILESTONES = [
  { d: 1, label: "24 Hours" }, { d: 7, label: "1 Week" }, { d: 30, label: "30 Days" },
  { d: 60, label: "60 Days" }, { d: 90, label: "90 Days" }, { d: 180, label: "6 Months" },
  { d: 365, label: "1 Year" }, { d: 545, label: "18 Months" }, { d: 730, label: "2 Years" },
  { d: 1095, label: "3 Years" }, { d: 1825, label: "5 Years" },
];

export const LEVELS = [
  { xp: 0, name: "Day One" }, { xp: 100, name: "Finding Footing" }, { xp: 250, name: "Steady Hands" },
  { xp: 500, name: "Building Momentum" }, { xp: 850, name: "Rooted" }, { xp: 1300, name: "Resilient" },
  { xp: 1900, name: "Anchored" }, { xp: 2700, name: "Lighthouse" }, { xp: 3800, name: "Unshaken" },
  { xp: 5200, name: "Steady, Truly" },
];

export const READINGS = [
  { t: "Honesty first", b: "Most of what gets easier in recovery starts with telling the truth — to yourself, before anyone else. Not the whole truth all at once. Just today's version of it. What's true right now, in this hour, that you've been avoiding saying out loud?" },
  { t: "The next right thing", b: "You don't have to see the whole road today. You just have to find the next right thing and do that. Make the call. Go to the meeting. Say no. Say yes. One decision at a time is a full-time job, and it's the only job today requires." },
  { t: "Asking for help", b: "Asking for help isn't the failure — needing to ask and not doing it is. Every person who's stayed sober for any length of time has, at some point, said the sentence 'I don't think I can do this alone.' It's not weakness. It's the whole method." },
  { t: "Cravings pass", b: "A craving is a wave, not a tide. It rises, it peaks, and — if you don't feed it — it goes back out. It rarely lasts more than twenty minutes at full strength. You are not being asked to want this feeling to end forever. Just to outlast the next twenty minutes." },
  { t: "Shame keeps secrets", b: "Shame tells you to hide the thing that would actually get lighter the moment you said it out loud. Guilt says 'I did something bad.' Shame says 'I am something bad.' Recovery has room for guilt — it points somewhere. Shame just points at you. Put it down." },
  { t: "Gratitude, small size", b: "You don't need a good day to find something to be grateful for. You need a specific one. Not 'my life' — a cup of coffee that was hot when you drank it. A text back. Five minutes of quiet. Gratitude works in small, exact coins, not large abstract ones." },
  { t: "A slip is information", b: "If today didn't go the way you planned, that's data, not a verdict. What was happening in the hour before. Who you were with, or weren't. What you were avoiding. A setback has something to teach you that a clean stretch can't. Get curious before you get down on yourself." },
  { t: "Boredom is a trigger too", b: "Not every trigger is a bad day. Sometimes it's an empty Tuesday afternoon with nothing scheduled and nowhere to be. Boredom isn't a small thing in recovery — it's one of the big ones. Keep something on the calendar, especially on the days that look easy." },
  { t: "Routine is protective", b: "Structure isn't the fun part of getting sober, but it's some of the load-bearing part. A wake time, a meal, a meeting, a bedtime — none of it is glamorous. It's just fewer decisions left open for the part of your brain that used to make bad ones under pressure." },
  { t: "Who you're becoming", b: "You're not just quitting something, you're growing into someone — and that person doesn't exist fully yet. Some days you'll feel like the old version. Some days you'll surprise yourself. Both are part of becoming, not proof that it isn't working." },
  { t: "Service moves the weight", b: "One of the strange, reliable facts of recovery: helping another person carry their weight tends to lighten yours. It doesn't have to be dramatic. Answer a text. Show up early and stack chairs. Being useful to someone else is a good use of a hard day." },
  { t: "Letting go of the outcome", b: "You can do everything right today and still feel restless, irritable, or low. Do it anyway. Recovery asks for your effort, not your certainty about how you'll feel afterward. The feeling is not the measure of whether the day counted." },
  { t: "Connection over willpower", b: "Willpower is a rope; connection is a net. Rely only on the rope and eventually you're hanging on by fingers over a long drop. Build the net — people who know where you are, who you can call badly, at odd hours, without performing that you're fine." },
  { t: "Today is the whole unit", b: "Not this year. Not the rest of your life. Today — this one, the one you're in right now. It's the only size the work actually comes in. Tomorrow will arrive with its own portion. You don't have to carry both at once." },
];

export const QUOTES = [
  "One day at a time.", "Progress, not perfection.", "This too shall pass.", "Easy does it.",
  "You are not required to have this figured out today.",
  "The opposite of addiction isn't sobriety. It's connection.",
  "Small and steady beats big and rare.",
  "You don't have to like it. You just have to do it today.",
  "Ask for help before you need it, not after.",
  "The day you're dreading is just a day with extra support around it.",
  "Rest is not the same as quitting.", "You've survived every hard day you've had so far.",
  "Keep the plans that are boring and small. They're the ones that hold.",
  "Nobody recovers alone, even the people who look like they did.",
];

/* 15 positive daily practices — today's pledge rotates through these */
export const PRACTICES = [
  { t: "Drink a full glass of water first thing", b: "Dehydration mimics fatigue and low mood — often the easiest win of the day." },
  { t: "Get 10 minutes of natural light outside", b: "Morning light helps set your body's clock, which steadies sleep and mood." },
  { t: "Write down one thing you're grateful for", b: "A small, specific gratitude note reliably lifts mood more than a vague one." },
  { t: "Move your body for 15 minutes", b: "A walk, a stretch, anything — movement burns off the stress hormones cravings feed on." },
  { t: "Reach out to one person who supports you", b: "A short text counts. Isolation is a relapse risk; contact is a protective factor." },
  { t: "Eat one real meal today, not just snacks", b: "Steady blood sugar keeps irritability and cravings from compounding each other." },
  { t: "Say one kind thing to yourself, out loud", b: "How you talk to yourself in hard moments is a skill — it gets stronger with practice." },
  { t: "Leave your phone in another room for 30 minutes", b: "A real break from notifications gives your nervous system room to settle." },
  { t: "Do 5 minutes of slow, deliberate breathing", b: "Slow exhales activate your body's own calming response — no app required." },
  { t: "Protect a consistent bedtime tonight", b: "Poor sleep is one of the most reliable relapse triggers there is." },
  { t: "Do one small task you've been avoiding", b: "Finishing something small breaks the freeze that anxiety and shame create." },
  { t: "Spend 10 minutes somewhere with zero screens", b: "A real break, not a scroll break — let your mind actually idle." },
  { t: "Write down what you're looking forward to", b: "Naming something ahead of you gives today's effort a reason." },
  { t: "Do one thing for someone else today", b: "Helping someone else carry weight tends to lighten your own, reliably." },
  { t: "Name one thing that went right today", b: "End the day on evidence, not judgment — however small the win." },
];

/* daily challenge pool — auto = detected from app activity */
export const CHALLENGES = [
  { id: "pledge", label: "Complete today's practice", xp: 20, color: "#4F5BFF", Icon: HandHeart, auto: "pledge" },
  { id: "breathe", label: "Complete a breathing session", xp: 25, color: "#1FBFD4", Icon: Wind, auto: "breathe" },
  { id: "checkin", label: "Log your daily check-in", xp: 25, color: "#8B5CF6", Icon: MessageSquare, auto: "checkin" },
  { id: "post", label: "Share a win in your feed", xp: 20, color: "#D97A0F", Icon: Send, auto: "post" },
  { id: "read", label: "Read today's reflection", xp: 15, color: "#22C55E", Icon: BookOpen, auto: "read" },
  { id: "move", label: "Move for 20 minutes", xp: 20, color: "#1FBFD4", Icon: Dumbbell },
  { id: "reach", label: "Reach out to one person", xp: 30, color: "#E4573D", Icon: Users },
  { id: "goal", label: "Finish one of your goals", xp: 20, color: "#F5B942", Icon: Target, auto: "goal" },
  { id: "water", label: "Drink a full glass of water", xp: 10, color: "#4F5BFF", Icon: Sparkles },
  { id: "outside", label: "Step outside for fresh air", xp: 15, color: "#22C55E", Icon: Wind },
];

export const ACHIEVEMENTS = [
  { id: "first-pledge", label: "First Practice", test: (d) => d.pledgeDates.length >= 1 },
  { id: "pledge-7", label: "7 Practices", test: (d) => d.pledgeDates.length >= 7 },
  { id: "first-breath", label: "First Breath", test: (d) => d.breathSessions.length >= 1 },
  { id: "breath-10", label: "10 Sessions", test: (d) => d.breathSessions.length >= 10 },
  { id: "checkin-5", label: "5 Check-ins", test: (d) => d.checkins.length >= 5 },
  { id: "first-post", label: "First Post", test: (d) => d.posts.some((p) => !p.milestone) },
  { id: "goal-3", label: "3 Goals Done", test: (d) => d.goals.filter((g) => g.done).length >= 3 },
  { id: "streak-7", label: "7-Day Streak", test: (d) => streakOf(d.loginDates) >= 7 },
  { id: "xp-500", label: "500 Sparks", test: (d) => d.xp >= 500 },
  { id: "level-5", label: "Level 5", test: (d) => levelOf(d.xp).level >= 5 },
  { id: "multi-tracker", label: "Multi-Tracker", test: (d) => d.journeys.length >= 2 },
  { id: "badge-collector", label: "Badge Collector", test: (d) => d.chestBadges.length >= 5 },
];

export const BREATH_PRESETS = [
  { id: "box", name: "Box Breathing", sub: "4-4-4-4 · calm and focus", color: "#4F5BFF",
    phases: [["Breathe in", 4], ["Hold", 4], ["Breathe out", 4], ["Hold", 4]] },
  { id: "478", name: "4-7-8 Breathing", sub: "Slow down a racing mind", color: "#8B5CF6",
    phases: [["Breathe in", 4], ["Hold", 7], ["Breathe out", 8]] },
  { id: "urge", name: "Urge Surfing", sub: "Long exhales to ride out a craving", color: "#1FBFD4",
    phases: [["Breathe in", 4], ["Breathe out", 8]] },
  { id: "quick", name: "Quick Reset", sub: "60 seconds, anywhere", color: "#22C55E",
    phases: [["Breathe in", 3], ["Breathe out", 5]] },
];

export const TAGS = [
  { id: "grateful", label: "Grateful", Icon: Heart, color: "#E4573D" },
  { id: "proud", label: "Proud", Icon: Star, color: "#F5B942" },
  { id: "hard", label: "Hard day", Icon: CloudRain, color: "#8B5CF6" },
];

export const MOODS = ["Steady", "Anxious", "Low", "Restless", "Grateful", "Numb"];
export const SLEEP = ["Poor", "Okay", "Good"];

/* ---------------- mystery chest ---------------- */
export const AFFIRMATIONS = [
  "I don't have to have today figured out. I just have to get through it.",
  "Every hour I stay steady is proof, not luck.",
  "I am allowed to be proud of something this small.",
  "My worth isn't measured in a streak number.",
  "I can want this to be easier and still do the hard thing.",
  "Today's effort counts even if today felt average.",
  "I'm not behind. I'm exactly as far as I've actually come.",
  "Asking for help is part of the plan, not a departure from it.",
  "I've outlasted every craving I've ever had. All of them.",
  "This feeling is real, and it is also temporary.",
  "I'm allowed to take up space while I'm still figuring this out.",
  "One steady day is a whole unit of progress.",
  "I am not the worst thing I've done on a hard day.",
  "Showing up today, tired and unsure, still counts as showing up.",
  "I get to decide what today means, not the version of me from before.",
];

export const MEMES = [
  { top: "Me at 3pm", bottom: "craving a nap way more than anything else" },
  { top: "My brain at 2am", bottom: "'remember that thing from 2019?'" },
  { top: "Still haven't", bottom: "used my gym membership OR relapsed today. big day." },
  { top: "Today's achievement", bottom: "drank water instead of making it weird" },
  { top: "Craving shows up", bottom: "me, pretending I don't see it" },
  { top: "Nobody:", bottom: "my brain at 11pm: let's think about EVERYTHING" },
  { top: "Survived the urge", bottom: "10 out of 10 would outlast again" },
  { top: "Mood:", bottom: "functioning adult, allegedly" },
  { top: "Me explaining why", bottom: "I need a snack AND a nap AND silence" },
  { top: "Progress looks like", bottom: "showing up annoyed but still showing up" },
];

export const CHEST_BADGES = [
  { id: "early-bird", label: "Early Bird", emoji: "🌅", color: "#F5B942" },
  { id: "night-owl", label: "Night Owl", emoji: "🌙", color: "#8B5CF6" },
  { id: "storm-rider", label: "Storm Rider", emoji: "⛈", color: "#1FBFD4" },
  { id: "steel-nerve", label: "Steel Nerve", emoji: "🛡", color: "#5B6798" },
  { id: "warm-heart", label: "Warm Heart", emoji: "❤", color: "#E4573D" },
  { id: "clear-head", label: "Clear Head", emoji: "🧠", color: "#22C55E" },
  { id: "deep-roots", label: "Deep Roots", emoji: "🌳", color: "#16A34A" },
  { id: "bright-spark", label: "Bright Spark", emoji: "⚡", color: "#F5B942" },
  { id: "quiet-strength", label: "Quiet Strength", emoji: "🗿", color: "#93A0CE" },
  { id: "north-star", label: "North Star", emoji: "⭐", color: "#4F5BFF" },
];

/** Weighted random chest reward. Badge draws skip ids already owned. */
export function pickChestReward(ownedBadgeIds = []) {
  const roll = Math.random();
  if (roll < 0.40) return { kind: "sparks", amount: 15 + Math.floor(Math.random() * 26) };
  if (roll < 0.65) return { kind: "affirmation", text: AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)] };
  if (roll < 0.85) return { kind: "meme", meme: MEMES[Math.floor(Math.random() * MEMES.length)] };
  const available = CHEST_BADGES.filter((b) => !ownedBadgeIds.includes(b.id));
  if (!available.length) return { kind: "affirmation", text: AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)] };
  return { kind: "badge", badge: available[Math.floor(Math.random() * available.length)] };
}

/* ---------------- helpers ---------------- */
export const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
export const isoOf = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
export const dayIdx = () => { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5); };
export const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
export const daysBetween = (a, b) => Math.round((new Date(b.getFullYear(), b.getMonth(), b.getDate()) - new Date(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);
export const daysSince = (quitDate) => quitDate ? Math.max(0, daysBetween(new Date(quitDate + "T00:00:00"), new Date())) : 0;
export const uid = (prefix = "id") => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export function streakOf(dates) {
  if (!dates || !dates.length) return 0;
  const set = new Set(dates);
  let n = 0; const d = new Date();
  if (!set.has(isoOf(d))) d.setDate(d.getDate() - 1);
  while (set.has(isoOf(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function levelOf(xp) {
  let i = 0;
  for (let k = 0; k < LEVELS.length; k++) if (xp >= LEVELS[k].xp) i = k;
  const cur = LEVELS[i], next = LEVELS[i + 1] || null;
  const span = next ? next.xp - cur.xp : 1;
  const into = xp - cur.xp;
  return { level: i + 1, name: cur.name, into, span, next, pct: next ? Math.min(1, into / span) : 1 };
}

export function todaysChallenges() {
  const seed = dayIdx();
  const pool = [...CHALLENGES];
  const out = [];
  for (let i = 0; i < 3; i++) out.push(pool[(seed * 7 + i * 3) % pool.length]);
  return out.filter((c, i, a) => a.findIndex((x) => x.id === c.id) === i);
}
