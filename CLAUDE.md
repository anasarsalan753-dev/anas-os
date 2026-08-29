# CLAUDE.md — Anas OS Project Instructions

Read this file fully before doing any work. This is the permanent contract
for how this project is built. It does not change often — for what's
currently happening, see `PROJECT_STATUS.md`. For history, see `CHANGELOG.md`.

## What this project is

A private, single-user personal command center: academics (backlog + Sem 5
tracking), a generic Study system (UPSC/RCA and any future subject), a
Calendar with Hijri dates and recurring reminders, Timetables, Tasks, and
Habits. Built for one specific person (Anas), not a multi-tenant product.

## Multi-session collaboration protocol (READ THIS FIRST)

This project is developed across multiple Claude sessions/accounts,
sequentially, never simultaneously. Every session must:

1. Read this file (`CLAUDE.md`) in full.
2. Read `PROJECT_STATUS.md` — specifically the "Next Task" section. That is
   your assignment unless the user says otherwise.
3. Read `CHANGELOG.md` to understand recent history (last 3-5 entries is
   usually enough — don't need the full history for routine work).
4. Inspect the actual current code the user provides/uploads before writing
   anything. Do not assume file contents from the docs — verify against
   the real files, since docs can drift from code if a previous session
   forgot to update them.
5. Do the assigned work. Test it (see Testing Discipline below).
6. Update `PROJECT_STATUS.md` — move completed items, update "Next Task",
   log any new bugs found.
7. Add an entry to `CHANGELOG.md`.
8. Hand the user: updated code files (only what changed, never a full
   zip — see File Handoff Rule), updated `PROJECT_STATUS.md`, updated
   `CHANGELOG.md`.
9. The user applies changes, tests, and runs the git commands themselves
   (pull/commit/push) — Claude in claude.ai chat cannot do this directly.

## File Handoff Rule (hard requirement)

**Never regenerate the whole project.** Only give the user files that
actually changed, clearly labeled: "NEW FILE", "REPLACE ENTIRE FILE", or
"EDIT — <description of what changed>". This project has been broken
before by whole-project zip handoffs causing folder duplication and lost
git history. Small, precise diffs only.

## Critical rules — do not violate

- Do NOT rebuild the project from scratch under any circumstance.
- Do NOT remove or break existing working functionality without explicit
  instruction.
- Do NOT change the Firebase project (`anas-os`).
- Do NOT weaken `firestore.rules` — every user document must stay scoped
  to `users/{uid}/...` with `request.auth.uid == uid`.
- Do NOT hardcode the user's name anywhere — always read from
  `profile.name` via `subscribeProfile`.
- Do NOT hardcode "UPSC" as the only Study program — the Study system must
  stay generic (Study Program → Subject → Content).
- Do NOT expose `.env` or commit real Firebase keys to git (already
  gitignored — keep it that way).
- Do NOT use localStorage for important application data — Firestore only.
  localStorage is fine only for harmless UI prefs (e.g. sidebar collapsed
  state — already implemented this way).
- Do NOT introduce a second Hijri-calendar implementation — reuse
  `src/lib/hijri.js`.

## Tech stack

- React + Vite + Tailwind CSS
- Firebase: Auth (email/password, single user), Firestore, Hosting
- react-router-dom, lucide-react (icons), date-fns (installed, use where
  it simplifies date math over hand-rolled logic)
- No backend server — Firestore is the only persistence layer

## Architecture map

src/
lib/
firebase.js — Firebase app init (reads .env via import.meta.env)
auth.jsx — AuthContext: user, login(), logout()
data.js — ALL Firestore reads/writes live here. Add new
collections' CRUD functions here, not inline in pages.
dates.js — date math: todayKey, daysUntil, formatDate,
getMonthGrid, isSameDay, currentStreak, last30Days
hijri.js — Gregorian<->Hijri conversion (tabular/civil algorithm,
±adjustmentDays offset from profile settings)
reminders.js — recurrence logic: occursOnDate(), nextOccurrence()
components/
Sidebar.jsx — collapsible nav, localStorage-persisted collapse state
Layout.jsx — wraps authenticated pages with Sidebar
Logo.jsx — brand mark (SVG monogram), reused across
Login/ProfileSetup/Sidebar
ProgressRing.jsx — circular progress SVG, the signature visual motif
LiveClock.jsx — 12-hour live-updating clock
pages/
Login.jsx, ProfileSetup.jsx, Settings.jsx
Dashboard.jsx — Home / Command Center
Calendar.jsx — Gregorian+Hijri grid + full reminders CRUD
Academics.jsx — Subjects -> Units -> Notes (Backlog / Sem 5)
Tasks.jsx, Habits.jsx
ComingSoon.jsx — placeholder for not-yet-built routes
App.jsx — routing + Gate component (auth check -> profile check -> render)


## Firestore data model

All data lives under `users/{uid}/...`. Current collections:

users/{uid}/profile/main { name, hijriAdjustmentDays, createdAt }
users/{uid}/meta/habitList { habits: [{id, name}] }
users/{uid}/meta/seeded { seededAt } — guards one-time seed
users/{uid}/habitLogs/{YYYY-MM-DD} { [habitId]: true }
users/{uid}/subjects/{id} { name, type: 'backlog'|'sem5',
units: [{id,name,topics,notes,done}] }
users/{uid}/tasks/{id} { title, category, dueDate, completed,
completedAt, createdAt }
users/{uid}/deadlines/{id} { title, date, type }
users/{uid}/reminders/{id} { title, description, date, time, type,
repeat, createdAt }


Planned (not yet built — see PROJECT_STATUS.md): `timetables`,
`timetableCompletions`, `studyPrograms`, `studySubjects`, `studyContents`.

## Design system

- Colors (Tailwind config, do not introduce ad-hoc hex values elsewhere):
  `ink` (950-500, dark backgrounds), `parchment` (100-300, text),
  `brass` (400-600, primary accent/CTA), `teal` (400-600, success/on-track),
  `clay` (400-600, urgent/danger)
- Fonts: `font-display` (Source Serif 4, headings), `font-body` (Inter, everything else)
- Card pattern: use the `.card` utility class (`bg-ink-800 border border-ink-600/60 rounded-card shadow-card`)
- Icons: lucide-react only, size 16-18 inline

## Testing discipline (required before handing off any batch)

1. `npm run build` must complete with 0 errors (warnings about chunk size are fine, ignore).
2. `npx oxlint src/` should show 0 errors (pre-existing warnings about
   `useAuth` fast-refresh and similar are known and fine to ignore).
3. Manually reason through the feature's logic — e.g. recurrence math for
   reminders was verified with node one-off scripts before shipping, not
   just "looks right."
4. Never claim something is tested/working without actually running the
   build command in this session.

## Git & deploy commands (for reference — user runs these, not Claude)

```powershell
npm install
npm run dev        # test locally first
npm run build
firebase deploy
git add .
git commit -m "..."
git push
```

Firebase project alias: `default` -> `anas-os`. Local project folder:
`C:\Users\rexy2\anas-os` (moved out of Downloads to avoid duplicate-folder
issues encountered earlier in development).