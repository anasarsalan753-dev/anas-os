# PROJECT_STATUS.md

**Last updated:** 2026-09-03
**Last updated by:** Claude session (claude.ai chat) — architecture
foundation pass. See "Architecture foundation (2026-09-03)" below for what
changed and why. Application code was touched this time, but narrowly:
one migration call removed, three new pure/metadata files added. No
feature UI was built or changed.

This file is the single source of truth for "where are we right now." Every
session must update this before finishing. Keep entries factual and terse —
detailed history belongs in CHANGELOG.md, not here.

---

## Architecture foundation (2026-09-03) — READ THIS FIRST

FocusOS's direction changed: it is no longer a fixed student-productivity
app but a customizable personal operating system (see CLAUDE.md's "What
this project is"). This followed a multi-round architecture design
process and an audit of a commit (`99fb1ca`, "feat: implement study
pomodoro and exercise modules") that had built Study/Work, Pomodoro, and
Exercise using the *old* architectural assumption (a fixed
`studyPrograms → studySubjects → studyContents` schema) because that old
assumption was still what `CLAUDE.md` documented at the time — this was
not a mistake by whoever built it, it was a documentation gap. This
session corrects that gap and lays the foundation for the real rebuild.

**What this session did:**
1. Removed the unconditional, automatic `migrateAcademicsToStudy()` call
   from `App.jsx`'s login/startup flow (`Gate`). It ran on every login
   with no user consent and wrote hardcoded labels ("B.Tech", "(Backlog)",
   "(Sem 5)") into new documents. The function itself was renamed to
   `migrateAcademicsToStudy_DISABLED_DO_NOT_CALL` in `src/lib/data.js` and
   heavily commented — kept as a reference for what NOT to do, not deleted,
   in case any of its logic is useful to look at when building the real
   import feature later.
2. Added `src/domain/progress.js` and `src/domain/nodeTree.js` — pure,
   `node`-testable contracts for the generic node hierarchy and progress
   calculation (see CLAUDE.md "Generic node system"). Verified with
   `scripts/test-progress.mjs` and `scripts/test-nodeTree.mjs` — all
   passing (41 assertions total).
3. Added `src/modules/registry.js` — the closed, FocusOS-controlled list
   of toggleable capabilities. Metadata only; not yet wired into
   `Sidebar.jsx` or `Dashboard.jsx`.
4. Corrected `CLAUDE.md` throughout — removed the stale "Study Program →
   Subject → Content" instruction, added the locked architecture
   decisions (generic nodes, module registry, configuration, layering
   direction), corrected the architecture map and data model sections to
   match what's actually in the repo.

**What this session deliberately did NOT do** (out of scope for this
pass — see "Next Task" below for who does this and when):
- Did not build `src/data/nodes.js` (Firestore CRUD for `nodes`).
- Did not touch `Study.jsx`, `Pomodoro.jsx`, `Exercise.jsx`, or
  `Dashboard.jsx` — all still function exactly as before, on the old
  fixed schema, unchanged and unbroken.
- Did not delete `studyPrograms`/`studySubjects`/`studyContents` or any
  data within them.
- Did not touch `subjects` (Academics data) — never at risk, confirmed
  again this session.
- Did not restore Tasks to navigation — that's a config-driven decision
  pending `config/main` existing (Next Task).
- Did not build `config/main` or wire the module registry into any UI.

**Data risk needing your action, not mine:** if `migrateAcademicsToStudy`
already ran against your real account before this fix (check for
`users/{your-uid}/meta/studyMigrated` in the Firebase console — I don't
have credentials to check this myself), there may already be an
auto-created "B.Tech" `studyPrograms` document with corresponding
`studySubjects`/`studyContents` in your live data. It's inert now (the
function can't run again since it's no longer called), but you should
decide whether to leave it in place (harmless, unused) or delete it
(safe to delete — it's not `subjects`, which is never touched). See
CHANGELOG.md for the full context.

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

### Phase 2 — Batch: Study/Pomodoro/Exercise (commit `99fb1ca`) — PARTIALLY SUPERSEDED
No changelog entry existed for this commit prior to this session. Built
against the (now-corrected) old architectural assumption in `CLAUDE.md`.
- [x] Pomodoro: 25/5 and 50/10 presets, custom presets, start/pause/
      reset, optional linking to a Study item, sessions logged to
      `pomodoroSessions/{id}`, today's total shown on Pomodoro + Home —
      KEEP, this part is architecturally fine (feature-specific data).
      Its `programId`/`subjectId` linking fields will need to change to
      `linkedNodeId` once Study/Work is rebuilt (Next Task).
- [x] Exercise: height (on profile), daily weight history
      (`weightLogs/{date}`), daily exercise log (`exerciseLogs/{id}`),
      today/history views, Home card — KEEP, architecturally fine as-is.
- [x] Dashboard: Tasks card replaced with Pomodoro-today and
      Exercise-today cards — functionally fine; will become
      config-driven rather than hardcoded once `config/main` exists.
- [x] Tasks: route and Sidebar link removed. `tasks` collection and all
      CRUD functions in `data.js` (`addTask`/`toggleTask`/`deleteTask`)
      left fully intact — confirmed again this session, zero data risk.
      `src/pages/Tasks.jsx` still exists on disk, simply unrouted.
- [ ] **Study/Work — SUPERSEDED, needs rebuild.** Built as a fixed
      `studyPrograms → studySubjects → studyContents` schema (2 levels
      of nesting max, `studyContents` always a leaf). Cannot represent
      the required arbitrary depth (e.g. `College → Semester 5 → AI →
      Unit 1 → Neural Networks`, 5 levels). Also included
      `CONTENT_TYPES`, a hardcoded schema-level enum
      (`lecture`/`video`/`book`/etc.) in `src/lib/study.js`. **Do not
      extend this implementation further** — see "Next Task" below for
      the rebuild plan. The existing `Study.jsx`/`studyPrograms`-etc.
      collections are left running, untouched, as a working fallback
      until the generic-node version is ready to replace it.
- [ ] **Automatic Academics→Study migration — REMOVED this session,
      see "Architecture foundation" note above.** Ran unconditionally on
      every login, wrote hardcoded "B.Tech"/"(Backlog)"/"(Sem 5)" labels.

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

### Architecture foundation (2026-09-03) — see full note above
- [x] Automatic Study migration removed from startup flow
- [x] `src/domain/progress.js` — generic progress calculation contract, tested
- [x] `src/domain/nodeTree.js` — generic hierarchy/path contract, tested
- [x] `src/modules/registry.js` — closed module registry (metadata only)
- [x] `CLAUDE.md` corrected to reflect the approved FocusOS architecture

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
5. **Study/Work data model needs a full rebuild**, not a patch — see the
   "Study/Pomodoro/Exercise" entry above. Fixed 2-level schema, cannot
   represent required depth.
6. **`studyPrograms`/`studySubjects`/`studyContents` may already contain
   auto-migrated data** if `migrateAcademicsToStudy` ran against the live
   account before this session's fix. Needs a manual check — see
   "Architecture foundation" note above.
7. **Pomodoro's `programId`/`subjectId` fields** are coupled to the
   flawed Study schema (see issue 5) and will need to become
   `linkedNodeId` once Study/Work is rebuilt.
8. **Tasks unrouted.** `Tasks.jsx` and its `data.js` functions are intact
   but not reachable from the UI. Correct fix is a `config/main`-driven
   toggle (once built), not simply re-adding the route/nav link
   unconditionally.

---

## Next Task

Do these in order — each depends on the one before it.

**1. Confirm live-data state of the disabled migration.** Check the
Firebase console (or a signed-in session) for
`users/{uid}/meta/studyMigrated`. If it exists, decide (with the user)
whether to leave the auto-created `studyPrograms`/etc. documents in place
(harmless, inert) or delete them. This is a data decision, not a code
task — don't act on it without the user's explicit go-ahead. Do NOT touch
`subjects` either way.

**2. Build `src/data/nodes.js`** — Firestore CRUD for
`users/{uid}/nodes/{nodeId}` and `users/{uid}/nodes/{nodeId}/values/{date}`,
built directly against the contracts already implemented and tested in
`src/domain/nodeTree.js` and `src/domain/progress.js` (do not
reimplement path/progress logic here — import and use them). Follow the
CRUD style already established in `src/lib/data.js` (e.g. `addDoc`/
`updateDoc` with `serverTimestamp()`, `writeBatch` for the
re-parent-updates-descendants case). No UI yet.

**3. Rebuild `/study`** on the generic `nodes` model. The existing
`Study.jsx` UI shell (breadcrumb nav, add/edit modals) is a reasonable
visual reference but the data layer underneath must be entirely new —
arbitrary `parentId` depth, no `CONTENT_TYPES` enum, `moduleKey: "study"`
on every node. Do not wire any automatic import from `subjects`; if an
import feature is wanted, it's a separate, explicit, user-triggered,
non-destructive action (see CLAUDE.md's migration rule), and the user
names the imported root themselves — never hardcode an institutional
name. Leave the OLD `Study.jsx`/`studyPrograms`-etc. working and reachable
under a different path (or simply leave the route pointed at the old
version until the new one is verified) so there's a rollback path during
development — don't delete the old implementation until the new one is
confirmed working.

**4. Re-link Pomodoro.** Once step 3 is done, change `Pomodoro.jsx`'s
`programId`/`subjectId` selects to select a node from the `study` module
tree, storing `linkedNodeId` instead. Historical sessions keep their old
fields untouched (don't migrate old data, just stop writing the old
fields going forward).

**5. Build `config/main`** (`src/data/config.js`) and wire
`src/modules/registry.js` into `Sidebar.jsx` (module visibility/order)
and `Dashboard.jsx` (Home widget visibility/order), with a safe fallback
to today's fixed layout when `config/main` doesn't exist. This is also
where Tasks gets properly restored — add its route/nav back
unconditionally in code, gated by `enabledModules.tasks` (default value
still to be decided).

**Do not start step 2 until step 1's data-risk check has at least been
raised with the user** — it doesn't block the code, but skipping it means
nobody ever finds out if the auto-migration already ran.

---

## Environment Reference

- Firebase project: `anas-os` (alias `default`)
- Live URL: `https://anas-os.web.app`
- GitHub repo: `github.com/anasarsalan753-dev/anas-os` (private) —
  corrected 2026-09-02; previously misrecorded as `anas-command-center`
- Local project folder: `C:\Users\rexy2\anas-os`
