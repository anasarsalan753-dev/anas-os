# PROJECT_STATUS.md

**Last updated:** 2026-09-02
**Last updated by:** Claude session (claude.ai chat) — documentation sync only,
no application code touched. Previous version of this file was significantly
stale (see note below).

This file is the single source of truth for "where are we right now." Every
session must update this before finishing. Keep entries factual and terse —
detailed history belongs in CHANGELOG.md, not here.

---

## Note on this update

The previous version of this file listed Batch 4 (Timetable) as the *next*
task and made no mention of Batch 5 at all. Direct inspection of the
repository (`src/`, `firestore.rules`, etc.) on 2026-09-02 showed that
Batch 4 and Batches 5A–5C are already implemented in code. This file has
been corrected to match the actual repository state. 5B and 5C in
particular are recorded here based only on reading the current code —
no changelog entries existed for them previously, so their exact
implementation dates are unknown.

---

## Completed

### Phase 1 (original build)
- [x] React + Vite + Tailwind + Firebase (Auth + Firestore + Hosting) scaffold
- [x] Command Center dashboard (deadlines, task/habit progress rings, streaks)
- [x] Academics: Subjects -> Units -> Notes, Backlog/Sem5 tagging
- [x] Tasks: categorized, due-dated, completed-history view
- [x] Habits: 30-day grid, auto streaks
- [x] Firestore security rules (per-uid isolation)
- [x] Deployed to Firebase Hosting, connected to GitHub

### Phase 2 — Batch 1: Profile, Home rebuild, Sidebar
- [x] First-login profile setup (name capture), Firestore-backed
- [x] Dynamic greeting (no hardcoded name)
- [x] Live 12-hour clock on Home
- [x] Hijri date display (with adjustable offset in Settings)
- [x] Collapsible sidebar (desktop toggle + localStorage persistence),
      mobile drawer
- [x] Settings page (name, Hijri adjustment)

### Phase 2 — Batch 2: Calendar
- [x] Gregorian month-grid calendar with Hijri date under every day
- [x] Month navigation, today highlighted
- [x] Hijri math verified against reference date (1 Muharram 1447 AH ≈ late June 2025)

### Phase 2 — Batch 3: Reminders + Recurrence
- [x] Reminder types: birthday, anniversary, exam, assignment, payment,
      personal, custom
- [x] Recurrence: never/daily/weekly/monthly/yearly, stored as structured
      data (not duplicated documents) — recurrence math unit-tested with
      5 scenarios before shipping
- [x] Calendar day markers (colored dots) for reminders, click-day panel,
      add/edit/delete modal
- [x] "Upcoming" reminders on both Calendar page and Home dashboard

### Phase 2 — Batch 4: Timetable system — CONFIRMED COMPLETE
Verified directly against current code (`src/lib/timetable.js`,
`src/pages/Timetables.jsx`, `src/components/TimePicker.jsx`,
`src/lib/data.js`).
- [x] Timetable creation: any number of named timetables, only one active
      at a time (`setActiveTimetable` batch-deactivates the rest)
- [x] Timetable editor: From / To / Task Name / Duration rows; duration is
      always derived (`entryDuration()`), never manually entered
- [x] Validation: scheduled vs unscheduled minutes out of 24h computed by
      `validateEntries()`; overlapping entries detected and flagged with a
      "Schedule Conflict" warning; gaps allowed
- [x] Completion is date-based history: `timetableCompletions/{date}`,
      keyed `${timetableId}:${entryId}` — not stored on the timetable
      document itself
- [x] Dedicated 12-hour `TimePicker` component for entry rows

New Firestore collections confirmed live:
`users/{uid}/timetables/{id}`, `users/{uid}/timetableCompletions/{date}`.

### Phase 2 — Batch 5A: FocusOS rebrand + Home/Dashboard redesign — CONFIRMED COMPLETE
- [x] Product renamed to "FocusOS" in the Sidebar header (old "Command
      Center" branding removed)
- [x] Dashboard rebuilt around a `StatCard`-based grid: Habits, Timetable
      Follow, Tasks, and a new Namaz (5 daily prayers) tracker
- [x] Namaz tracking added: `prayerLogs/{date}` collection, `PRAYERS`
      constant, `setPrayerLog()` — not previously documented in CLAUDE.md's
      data model section
- [x] Dashboard now also surfaces "Timetable Follow" progress for today's
      active timetable, pulling from `timetableCompletions`

### Phase 2 — Batch 5B: Calendar compaction — CONFIRMED COMPLETE (no prior changelog entry)
No changelog entry exists for this batch; the following is inferred from
reading the current `src/pages/Calendar.jsx` and cannot be attributed to a
specific date.
- [x] Calendar grid uses compact cell sizing (`h-11 sm:h-12`) and small
      text (`text-[11px]` day numbers)
- [x] Two-column layout: month grid + side panel (selected-day detail,
      Upcoming list) fit together without excess whitespace

### Phase 2 — Batch 5C: Timetable UX — CONFIRMED COMPLETE (no prior changelog entry)
No changelog entry exists for this batch; the following is inferred from
reading the current `src/pages/Timetables.jsx`,
`src/components/TimePicker.jsx`, and `src/lib/timetable.js`.
- [x] Dedicated hour/minute/AM-PM `TimePicker` component replacing raw
      time inputs
- [x] Conflict/validation summary bar in the timetable editor: scheduled /
      unscheduled / conflict minutes shown as a segmented progress bar,
      plus inline warning text for conflicts and invalid rows

### Branding
- [x] Logo mark designed (geometric "A" monogram, brass/teal, matches
      progress-ring visual language) — applied to Sidebar, Login,
      ProfileSetup, and favicon.svg
- [x] Removed leftover "Command Center" / old tagline branding from Login
      page (was missed in Batch 1, caught during logo work)

### Infrastructure / process
- [x] Git repo cleaned up and re-established at
      `C:\Users\rexy2\anas-os` (previous folder/history chaos resolved —
      see CHANGELOG.md for what happened)
- [x] Multi-session collaboration docs created (this file, CLAUDE.md, CHANGELOG.md)

---

## In Progress

Nothing actively in progress.

---

## Known Issues / Bugs

Identified during a documentation-sync inspection on 2026-09-02. Not yet
fixed — recorded here for a future session to address explicitly.

1. **Case-mismatched Logo import.** `src/components/Sidebar.jsx` imports
   `./Logo`, but the committed file is `src/components/logo.jsx`
   (lowercase). Currently works because it's being built on a
   case-insensitive filesystem (Windows), but is a latent break risk on
   case-sensitive builds/CI/deploy environments.
2. **Inconsistent StatCard filename.** `src/components/StartCard.jsx`
   exports a component named `StatCard`. The filename ("Start") doesn't
   match the export name ("Stat") — likely a typo from whenever this file
   was created during the 5A redesign.
3. **Possible dead code: ProgressRing.** `src/components/ProgressRing.jsx`
   is fully implemented and styled but is not imported anywhere in the
   current codebase. It appears to have been superseded by `StatCard`
   during the Batch 5A dashboard redesign and may now be dead code —
   needs a decision (remove vs. re-use) rather than a silent deletion.
4. **Stale environment reference info.** The "Environment Reference"
   section below previously listed the GitHub repo as
   `github.com/anasarsalan753-dev/anas-command-center`. The actual repo
   is `anasarsalan753-dev/anas-os`. Corrected below.

---

## Next Work

**Batch 5D** is the next major feature. Scope not yet defined in this
file — to be scoped out in a future session/instruction, following on
from the Batch 5 rebrand/UX line of work (5A Home, 5B Calendar, 5C
Timetable UX).

**Study system (Batch 6 in the original spec) is still not built.**
`/study` currently routes to the generic `ComingSoon` placeholder
component (`<ComingSoon title="Study" note="Generic study programs with
lecture progress tracking — coming soon." />` in `src/App.jsx`). No
`studyPrograms` / `studySubjects` / `studyContents` Firestore collections
exist yet. Per CLAUDE.md's dependency order, Study depends on Timetable
existing first — Timetable (Batch 4) is now confirmed complete, so Study
is unblocked whenever it's prioritized, but it has not been started.

Timetable↔Study integration remains un-started and depends on Study
existing first.

---

## Environment Reference

- Firebase project: `anas-os` (alias `default`)
- Live URL: `https://anas-os.web.app`
- GitHub repo: `github.com/anasarsalan753-dev/anas-os` (private) —
  corrected 2026-09-02; previously misrecorded as `anas-command-center`
- Local project folder: `C:\Users\rexy2\anas-os`
