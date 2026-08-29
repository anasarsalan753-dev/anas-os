# PROJECT_STATUS.md

**Last updated:** 2026-08-29
**Last updated by:** Claude session (claude.ai chat)

This file is the single source of truth for "where are we right now." Every
session must update this before finishing. Keep entries factual and terse —
detailed history belongs in CHANGELOG.md, not here.

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

Nothing actively in progress — last session ended cleanly after logo work.

---

## Known Issues / Bugs

None currently open. (If a session finds a bug it doesn't fix immediately,
log it here with: what's broken, how to reproduce, suspected cause.)

---

## Next Task

**Batch 4 — Timetable system**, per the original Phase 2 spec, steps 6-9:

1. Timetable creation: user can create any number of named timetables
   (e.g. "College Day", "Backlog Prep", "Sunday"), each with active/inactive
   status. Only one active at a time — activating one deactivates the
   previous.
2. Timetable editor: schedule rows with From / To / Task Name / Duration
   (auto-calculated from From-To, never manually entered) / checkbox.
3. Validation: auto-calculate scheduled vs unscheduled time out of 24h,
   detect and block overlapping entries with a clear "Schedule Conflict"
   warning. Gaps are allowed.
4. Checkbox completion must be date-based history
   (`timetableCompletions/{date}`), not permanent state on the timetable
   itself — so a reused timetable gets a fresh checkbox every day while
   history persists.

New Firestore collections needed (see CLAUDE.md data model section):
`users/{uid}/timetables/{id}`, `users/{uid}/timetableCompletions/{date}`.

Do not start on the Study system (Batch 5) or Timetable<->Study integration
(Batch 6) yet — those depend on Timetable existing first, per the original
spec's own dependency order.

---

## Environment Reference

- Firebase project: `anas-os` (alias `default`)
- Live URL: `https://anas-os.web.app`
- GitHub repo: `github.com/anasarsalan753-dev/anas-command-center` (private)
- Local project folder: `C:\Users\rexy2\anas-os`