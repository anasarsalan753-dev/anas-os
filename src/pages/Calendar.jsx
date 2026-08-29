import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../lib/auth";
import { subscribeProfile } from "../lib/data";
import { getMonthGrid, isSameDay } from "../lib/dates";
import { toHijri, HIJRI_MONTHS } from "../lib/hijri";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [cursor, setCursor] = useState(new Date());

  useEffect(() => {
    if (!user) return;
    return subscribeProfile(user.uid, setProfile);
  }, [user]);

  const adjustment = profile?.hijriAdjustmentDays || 0;
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const today = new Date();
  const cells = getMonthGrid(year, month);

  function goMonth(delta) {
    setCursor(new Date(year, month + delta, 1));
  }

  // Hijri month/year label for the currently viewed Gregorian month,
  // taken from the 15th to represent the "typical" Hijri month in view.
  const midMonthHijri = toHijri(new Date(year, month, 15), adjustment);

  return (
    <div className="p-8 space-y-6">
      <header>
        <h2 className="text-2xl font-display font-semibold">Calendar</h2>
        <p className="text-xs text-parchment-300 mt-1">
          Gregorian dates shown with corresponding Hijri dates (approximate —
          adjust in Settings if it drifts from your local moon-sighting).
        </p>
      </header>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => goMonth(-1)}
            className="p-2 rounded-lg hover:bg-ink-700 text-parchment-300 hover:text-parchment-100"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <h3 className="text-lg font-display font-semibold">
              {cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </h3>
            <p className="text-xs text-brass-400 mt-0.5">
              {HIJRI_MONTHS[midMonthHijri.month - 1]} {midMonthHijri.year} AH
            </p>
          </div>

          <button
            onClick={() => goMonth(1)}
            className="p-2 rounded-lg hover:bg-ink-700 text-parchment-300 hover:text-parchment-100"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-[11px] font-medium text-parchment-300 py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell) => {
            const isToday = isSameDay(cell.date, today);
            const h = toHijri(cell.date, adjustment);
            return (
              <div
                key={cell.key}
                className={`aspect-square rounded-lg p-1.5 flex flex-col ${
                  isToday
                    ? "bg-brass-500/20 border border-brass-500"
                    : cell.inMonth
                    ? "bg-ink-700/40 border border-transparent"
                    : "bg-transparent border border-transparent opacity-30"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    isToday ? "text-brass-400" : cell.inMonth ? "text-parchment-100" : "text-parchment-300"
                  }`}
                >
                  {cell.date.getDate()}
                </span>
                <span className="text-[9px] text-parchment-300 mt-auto leading-tight">
                  {h.day} {HIJRI_MONTHS[h.month - 1]?.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
