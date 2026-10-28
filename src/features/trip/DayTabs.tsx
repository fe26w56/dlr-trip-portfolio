import { useEffect, useRef } from "react";

type DayTabsProps = {
  totalDays: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
};

export function DayTabs({ totalDays, selectedDay, onSelectDay }: DayTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  // 選択されたタブが見えるように自動スクロール
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const btn = container.children[selectedDay - 1] as HTMLElement | undefined;
    if (!btn) return;
    const left = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
    container.scrollTo({ left, behavior: "smooth" });
  }, [selectedDay]);

  return (
    <div className="bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {days.map((day) => (
          <button
            key={day}
            aria-pressed={selectedDay === day}
            onClick={() => onSelectDay(day)}
            className={`flex-1 min-w-[72px] px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              selectedDay === day
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>
    </div>
  );
}
