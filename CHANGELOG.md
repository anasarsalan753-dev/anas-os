# CHANGELOG.md

Reverse chronological. Every session adds one entry when it finishes a
unit of work. Keep entries factual: what changed, what files, why (if not
obvious).

---

## 2026-09-02 — Process: documentation sync (PROJECT_STATUS.md, CHANGELOG.md)

A repository inspection found that `PROJECT_STATUS.md` and this
changelog had drifted significantly out of date: Batch 4 (Timetable) was
still listed as "Next Task" and Batch 5 wasn't mentioned at all, while
the actual code in `src/` shows both are implemented. This session
updated `PROJECT_STATUS.md` and added the four retroactive entries below
(Batch 4, 5A, 5B, 5C) based on reading the current code. No application
code, Firebase config, or Firestore rules were changed.

**Files touched:** 2 (`PROJECT_STATUS.md`, `CHANGELOG.md`), both edited,
no code changes.

---

## Retroactive entry — Batch 4: Timetable system

**Note:** No changelog entry existed for this batch prior to this sync.
Original implementation date is unknown. Details below are reconstructed
from reading the current code on 2026-09-02, not from a session log.

**Added (per current code):**
- `src/lib/timetable.js` — `timeToMinutes()`, `formatTime12()`,
  `formatDuration()`, `entryDuration()` (derives duration from from/to,
  never stored), `validateEntries()` (detects overlaps, computes
  scheduled/unscheduled/conflict minutes out of a 24h day)
- `src/components/TimePicker.jsx` — hour/minute/AM-PM picker used in the
  timetable editor
- `src/pages/Timetables.jsx` — timetable list, create/edit modal with
  row-based entry editor, active-timetable toggle, today's checklist for
  the active timetable

**Changed (per current code):**
- `src/lib/data.js` — `addTimetable`, `updateTimetable`, `deleteTimetable`,
  `setActiveTimetable` (batch-writes so only one timetable is ever
  active), `setTimetableCompletion`, `subscribeTimetableCompletions`
- `src/App.jsx` — `/timetables` route wired to the real page
- `src/pages/Dashboard.jsx` — added a "Timetable Follow" stat card reading
  from the active timetable + today's completions

**Firestore:** new collections `users/{uid}/timetables/{id}` and
`users/{uid}/timetableCompletions/{date}`, confirmed live in
`src/lib/data.js`.

---

## Retroactive entry — Batch 5A: FocusOS rebrand + Home/Dashboard redesign

**Note:** No changelog entry existed for this batch prior to this sync.
Original implementation date is unknown. Details below are reconstructed
from reading the current code on 2026-09-02.

**Changed (per current code):**
- `src/components/Sidebar.jsx` — header text changed to "FocusOS"
- `src/pages/Dashboard.jsx` — rebuilt around a `StatCard` grid (Habits,
  Timetable Follow, Tasks, Namaz), replacing whatever the prior dashboard
  layout was
- `src/components/StartCard.jsx` — new component (exports `StatCard`);
  filename does not match the exported name

**Added (per current code):**
- Namaz (5 daily prayers) tracking: `PRAYERS` constant and
  `setPrayerLog()` / `subscribePrayerLogs()` in `src/lib/data.js`, new
  `users/{uid}/prayerLogs/{date}` collection, inline prayer-toggle UI on
  the Dashboard

This collection and feature were not previously documented in
CLAUDE.md's Firestore data model section — flagged for that file to be
updated separately (out of scope for this documentation-sync session,
which touches only PROJECT_STATUS.md and CHANGELOG.md).

---

## Retroactive entry — Batch 5B: Calendar compaction

**Note:** No changelog entry existed for this batch prior to this sync,
and no prior version of `Calendar.jsx` was available for comparison.
This entry records the current state only — it cannot describe what
specifically changed or when.

**Observed in current code (`src/pages/Calendar.jsx`):**
- Compact month-grid cell sizing and small type scale for day numbers
- Two-column layout combining the month grid with a side panel (selected
  day detail + "Upcoming" reminders list)

---

## Retroactive entry — Batch 5C: Timetable UX

**Note:** No changelog entry existed for this batch prior to this sync.
This entry records the current state only, reconstructed from code.

**Observed in current code:**
- `src/components/TimePicker.jsx` — dedicated hour/minute/AM-PM picker
  used in place of raw `<input type="time">` fields in the timetable
  editor
- `src/pages/Timetables.jsx` — segmented progress bar showing scheduled /
  conflict minutes, plus inline "Schedule Conflict" and "End time must be
  after start time" warnings, driven by `validateEntries()` from
  `src/lib/timetable.js`

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

**Note added 2026-09-02:** the committed file is actually
`src/components/logo.jsx` (lowercase), not `Logo.jsx` as recorded here —
see Known Issues in PROJECT_STATUS.md.

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
