# CHANGELOG.md

Reverse chronological. Every session adds one entry when it finishes a
unit of work. Keep entries factual: what changed, what files, why (if not
obvious).

---

## 2026-08-29 — Process: multi-session collaboration setup

Created `CLAUDE.md`, `PROJECT_STATUS.md`, `CHANGELOG.md` to allow
development to continue across multiple Claude sessions/accounts
sequentially without losing context. See CLAUDE.md for the protocol.

No code changes.

---

## 2026-08-29 — Logo / branding

**Added:**
- `src/components/Logo.jsx` — geometric "A" monogram SVG (brass strokes,
  teal accent dot), matches the existing progress-ring visual language

**Changed:**
- `public/favicon.svg` — replaced default Vite placeholder with the new mark
- `src/components/Sidebar.jsx` — logo added to header; header layout fixed
  to stack vertically when collapsed (was previously going to overflow the
  64px collapsed width)
- `src/pages/ProfileSetup.jsx` — logo added above welcome heading
- `src/pages/Login.jsx` — logo added; also removed leftover old
  "Command Center" title and "Discipline today, freedom tomorrow" tagline
  that should have been updated in the Batch 1 rename but was missed

**Files touched:** 5 (1 new, 4 edited)

---

## 2026-08-29 — Repo/folder cleanup (process, no feature work)

Local project had accumulated multiple disconnected duplicate folders
(zip extractions landing as `anas-command-center (2)`, `-batch1`,
`-batch2` etc. in Downloads) after several rounds of zip handoffs. Root
causes identified:
1. Windows auto-renaming folders on duplicate zip extraction
2. An earlier `git push` had silently failed due to missing GitHub
   authentication — the "empty repo" scare was actually the *first*
   successful push, not data loss

Resolved by: deleting all duplicate folders, deleting and recreating the
GitHub repo for a clean baseline, moving the working folder to
`C:\Users\rexy2\anas-os` (out of Downloads), re-initializing git there,
and pushing a fresh baseline commit.

**Lesson for future sessions:** never hand off full-project zips for
incremental work — file-by-file diffs only (now codified in CLAUDE.md's
File Handoff Rule).

---

## 2026-08-29 — Batch 3: Reminders + Recurrence

**Added:**
- `src/lib/reminders.js` — `occursOnDate()`, `nextOccurrence()`,
  `REMINDER_TYPES`, `REPEAT_OPTIONS`. Recurrence computed on the fly from
  a single anchor date + repeat rule, never expanded into duplicate
  Firestore documents.

**Changed:**
- `src/lib/data.js` — added `addReminder`, `updateReminder`, `deleteReminder`
- `src/pages/Calendar.jsx` — full rebuild: reminder CRUD modal, colored
  day-markers for occurrences, click-day side panel, "Upcoming" list
- `src/pages/Dashboard.jsx` — added "Upcoming Reminders" card

**Firestore:** new collection `users/{uid}/reminders/{id}`. No rules
changes needed (existing wildcard rule already covers it).

**Verification:** recurrence logic tested with 5 scripted scenarios
(yearly birthday, monthly payment, weekly, past non-repeating x2) before
shipping — all correct. Hijri conversion (from Batch 2) also spot-checked
against a published reference date.

**Files touched:** 4 (1 new, 3 edited)

---

## 2026-08-29 — Batch 2: Calendar

**Added:**
- `src/pages/Calendar.jsx` — Gregorian month grid, Hijri date under every
  cell, month navigation, today highlighted

**Changed:**
- `src/lib/dates.js` — added `getMonthGrid()`, `isSameDay()`
- `src/App.jsx` — `/calendar` route wired to real page

**Files touched:** 3 (1 new, 2 edited)

---

## 2026-08-29 — Batch 1: Profile, Home rebuild, Collapsible Sidebar

**Added:**
- `src/pages/ProfileSetup.jsx` — first-login name capture
- `src/pages/Settings.jsx` — name + Hijri adjustment editing
- `src/pages/ComingSoon.jsx` — placeholder for unbuilt routes
- `src/components/LiveClock.jsx` — 12-hour live clock
- `src/lib/hijri.js` — Gregorian<->Hijri conversion (tabular/civil algorithm)

**Changed:**
- `src/lib/data.js` — added `getProfile`, `subscribeProfile`, `setProfile`
- `src/components/Sidebar.jsx` — full rebuild: collapsible, icon-only mode,
  mobile drawer, old tagline/branding removed, new nav links added
- `src/components/Layout.jsx` — mobile top padding for fixed menu button
- `src/pages/Dashboard.jsx` — dynamic greeting, live clock, Hijri date line
- `src/App.jsx` — profile-existence gate added; new routes for
  calendar/timetables/study/settings (placeholders at this point)

**Firestore:** new doc `users/{uid}/profile/main`. No rules changes
needed.

**Packages added:** `lucide-react`

**Files touched:** 9 (5 new, 4 edited)

---

## 2026-08-25 — Phase 1: Initial build

Full initial application built: React + Vite + Tailwind + Firebase
(Auth + Firestore + Hosting). Command Center dashboard, Academics
(Subjects/Units/Notes with Backlog/Sem5 tagging), Tasks (categorized,
history), Habits (30-day grid, streaks). Firestore security rules
established (per-uid isolation). Deployed to Firebase Hosting, connected
to GitHub.

**Design system established:** deep charcoal-ink base, brass/gold accent,
teal (on-track), clay/terracotta (urgent), Source Serif 4 for headings.

This is the foundational commit all subsequent batches build on.