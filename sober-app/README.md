# Steady — one day at a time

A navy/indigo recovery companion built with React + Vite: a sobriety timer, daily challenges,
XP/levels, streaks, badges, guided breathing exercises, a private journal, and crisis resources.
All data is stored locally in the browser (`localStorage`) — nothing leaves the device.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to http://localhost:5173).

## Scripts

- `npm run dev` — start the dev server with hot reload
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run Oxlint

## Tech

- React 19 + Vite
- [lucide-react](https://lucide.dev) for icons
- No backend — state persists via `localStorage`
