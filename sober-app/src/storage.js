import { todayISO, uid } from "./game.js";

export const KEY = "steady:v4";
const OLD_KEY = "steady:v3";

export const BLANK = {
  journeys: [], activeJourneyId: null,
  xp: 0, awarded: [], goals: [], checkins: [], posts: [],
  pledgeDates: [], loginDates: [], breathSessions: [], manualChallenges: [], readDates: [],
  earnedAchievements: [], reasons: [],
  perfectDates: [], chestDates: [], chestBadges: [], soundOn: true,
};

/** Folds a v3 flat single-journey save (or any partial shape) into the v4 multi-journey shape. */
function migrate(raw) {
  let d = { ...BLANK, ...raw };
  if ((!d.journeys || !d.journeys.length) && raw && raw.quitDate) {
    const legacy = {
      id: uid("j"), type: "custom", label: "My Recovery", emoji: "✨", color: "#4F5BFF",
      quitDate: raw.quitDate, dailySpend: raw.dailySpend || 0,
      resets: raw.resets || [], notifiedMilestones: raw.notifiedMilestones || [],
      isPrimary: true,
    };
    d = { ...d, journeys: [legacy], activeJourneyId: legacy.id };
  }
  if (!Array.isArray(d.journeys)) d.journeys = [];
  if (d.journeys.length && !d.journeys.some((j) => j.isPrimary)) {
    d.journeys = d.journeys.map((j, i) => (i === 0 ? { ...j, isPrimary: true } : j));
  }
  if (!d.activeJourneyId || !d.journeys.some((j) => j.id === d.activeJourneyId)) {
    const primary = d.journeys.find((j) => j.isPrimary) || d.journeys[0];
    d.activeJourneyId = primary ? primary.id : null;
  }
  return d;
}

export async function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return migrate(JSON.parse(raw));
    const old = localStorage.getItem(OLD_KEY);
    if (old) return migrate(JSON.parse(old));
  } catch (e) { /* first run */ }
  return { ...BLANK };
}

export async function save(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { console.error("storage", e); }
}

export function newJourney(draft, isPrimary) {
  return { ...draft, id: uid("j"), resets: [], notifiedMilestones: [], isPrimary };
}
