import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import {
  subscribeCollection,
  subscribeHabitList,
  subscribeHabitLogs,
  subscribeProfile,
} from "../lib/data";
import { daysUntil, formatDate, todayKey, currentStreak } from "../lib/dates";
import { formatHijri } from "../lib/hijri";
import ProgressRing from "../components/ProgressRing";
import LiveClock from "../components/LiveClock";

export default function Dashboard() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [profile, setProfileState] = useState(null);

  useEffect(() => {
    if (!user) return;
    const u1 = subscribeCollection(user.uid, "deadlines", setDeadlines);
    const u2 = subscribeCollection(user.uid, "tasks", setTasks);
    const u3 = subscribeHabitList(user.uid, setHabits);
    const u4 = subscribeHabitLogs(user.uid, setLogs);
    const u5 = subscribeProfile(user.uid, setProfileState);
    return () => {
      u1();
      u2();
      u3();
      u4();
      u5();
    };
  }, [user]);

  const today = todayKey();
  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const doneToday = todayTasks.filter((t) => t.completed).length;
  const taskPercent = todayTasks.length
    ? Math.round((doneToday / todayTasks.length) * 100)
    : 0;

  const todayLog = logs[today] || {};
  const habitsDoneToday = habits.filter((h) => todayLog[h.id]).length;
  const habitPercent = habits.length
    ? Math.round((habitsDoneToday / habits.length) * 100)
    : 0;

  const bestStreak = habits.reduce(
    (max, h) => Math.max(max, currentStreak(logs, h.id)),
    0
  );

  const upcoming = [...deadlines]
    .filter((d) => daysUntil(d.date) >= 0)
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))
    .slice(0, 5);

  const criticalDeadline = upcoming.find((d) => d.type === "critical");

  return (
    <div className="p-8 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold">
            Assalamualaikum{profile?.name ? `, ${profile.name}` : ""} 👋
          </h2>
          <p className="text-xs text-parchment-300 mt-1.5 space-x-2">
            <span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-parchment-300/50">•</span>
            <span>{formatHijri(new Date(), profile?.hijriAdjustmentDays || 0)}</span>
          </p>
        </div>
        <LiveClock className="text-xl font-display font-semibold text-brass-400 tabular-nums" />
      </header>

      {criticalDeadline && (
        <div className="card border-clay-500/50 bg-clay-500/10 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-clay-400">
              {criticalDeadline.title}
            </p>
            <p className="text-xs text-parchment-300">
              {formatDate(criticalDeadline.date)}
            </p>
          </div>
          <p className="text-2xl font-display font-semibold text-clay-400">
            {daysUntil(criticalDeadline.date)}d
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-6 flex items-center gap-5">
          <ProgressRing
            percent={taskPercent}
            size={100}
            stroke={9}
            label={`${doneToday}/${todayTasks.length || 0}`}
            color="#C9A24B"
          />
          <div>
            <p className="text-sm font-semibold">Today's Tasks</p>
            <p className="text-xs text-parchment-300">
              {todayTasks.length === 0
                ? "Nothing scheduled — add tasks"
                : `${taskPercent}% complete`}
            </p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-5">
          <ProgressRing
            percent={habitPercent}
            size={100}
            stroke={9}
            label={`${habitsDoneToday}/${habits.length || 0}`}
            color="#4F9A86"
          />
          <div>
            <p className="text-sm font-semibold">Today's Habits</p>
            <p className="text-xs text-parchment-300">
              {habitPercent}% complete
            </p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-5">
          <ProgressRing
            percent={Math.min(bestStreak * 3, 100)}
            size={100}
            stroke={9}
            label={`${bestStreak}`}
            sublabel="days"
            color="#D9B968"
          />
          <div>
            <p className="text-sm font-semibold">Best Active Streak</p>
            <p className="text-xs text-parchment-300">Keep it going</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-semibold mb-4">Upcoming Deadlines</h3>
        {upcoming.length === 0 ? (
          <p className="text-xs text-parchment-300">No deadlines set.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((d) => {
              const days = daysUntil(d.date);
              const urgent = days <= 7;
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between py-2 border-b border-ink-700/60 last:border-0"
                >
                  <div>
                    <p className="text-sm">{d.title}</p>
                    <p className="text-xs text-parchment-300">
                      {formatDate(d.date)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      urgent ? "text-clay-400" : "text-parchment-200"
                    }`}
                  >
                    {days === 0 ? "Today" : `${days} days`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
