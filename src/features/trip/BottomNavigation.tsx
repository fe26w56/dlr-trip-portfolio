import { ListChecks, Timer, Map, Utensils } from "lucide-react";

type BottomTab = "schedule" | "waitTimes" | "map" | "restaurants";

type BottomNavigationProps = {
  activeBottomTab: BottomTab;
  onSelectTab: (tab: BottomTab) => void;
};

export function BottomNavigation({ activeBottomTab, onSelectTab }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 pt-2 pb-[45px] h-[75px] safe-bottom z-50">
      <div className="flex justify-around">
        {[
          {
            icon: ListChecks,
            label: "Schedule",
            tab: "schedule" as const,
          },
          {
            icon: Timer,
            label: "待ち時間",
            tab: "waitTimes" as const,
          },
          {
            icon: Map,
            label: "Map",
            tab: "map" as const,
          },
          {
            icon: Utensils,
            label: "Restaurant",
            tab: "restaurants" as const,
          },
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => onSelectTab(item.tab)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
              activeBottomTab === item.tab ? "text-blue-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
