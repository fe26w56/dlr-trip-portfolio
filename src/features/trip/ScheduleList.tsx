import { Check, ChevronDown, ChevronUp, Clock, GripVertical, Pencil, ShoppingBag, Sparkles, Trash2, Users, Utensils, X, Zap, Castle, Coffee, Navigation } from "lucide-react";
import { RestaurantStatusChip } from "@/features/wait-times/RestaurantStatusChip";
import { ShowtimeChip } from "@/features/wait-times/ShowtimeChip";
import { WaitTimeChip } from "@/features/wait-times/WaitTimeChip";
import type { ItemType } from "@/features/trip/types";
import type { ElementType } from "react";

const typeIcons: Record<ItemType, ElementType> = {
  attraction: Castle,
  restaurant: Utensils,
  show: Sparkles,
  break: Coffee,
  move: Navigation,
  shopping: ShoppingBag,
  greeting: Users,
  other: Clock,
};

type ScheduleListProps = {
  dayItems: any[];
  nowItem: any;
  editMode: boolean;
  onSelectItem: (item: any) => void;
  onMoveItem: (itemId: string, direction: "up" | "down") => void;
  onEditItem: (item: any) => void;
  onDeleteItem: (itemId: string) => void;
};

export function ScheduleList({ dayItems, nowItem, editMode, onSelectItem, onMoveItem, onEditItem, onDeleteItem }: ScheduleListProps) {
  return (
    <div className="space-y-2">
      {dayItems.map((item, index) => {
        const Icon = typeIcons[item.type as ItemType] || Clock;
        const isCompleted = item.status === "completed";
        const isSkipped = item.status === "skipped";
        const isDone = isCompleted || isSkipped;
        const isNow = nowItem?.id === item.id;

        return (
          <div
            key={item.id}
            className={`rounded-xl overflow-hidden border transition-all ${
              isDone
                ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-50"
                : isNow
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 shadow-lg"
                  : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
            }`}
          >
            <div className="flex">
              {editMode && (
                <div className="flex flex-col justify-center bg-slate-50 dark:bg-slate-900 px-1">
                  <button
                    aria-label={`${item.titleJa}を前へ移動`}
                    onClick={() => onMoveItem(item.id, "up")}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />
                  <button
                    aria-label={`${item.titleJa}を後ろへ移動`}
                    onClick={() => onMoveItem(item.id, "down")}
                    disabled={index === dayItems.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}

              {item.imageUrl ? (
                <div
                  className="relative w-24 min-h-24 flex-shrink-0 overflow-hidden cursor-pointer active:opacity-80"
                  onClick={() => !editMode && onSelectItem(item)}
                >
                  <img src={item.imageUrl} alt={item.titleEn} className="w-full h-full object-cover" />
                  {item.isLightningLane && (
                    <span className="absolute top-1 left-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                      <Zap className="h-3 w-3" />LL
                    </span>
                  )}
                </div>
              ) : (
                <div
                  className={`relative w-24 min-h-24 flex-shrink-0 flex items-center justify-center cursor-pointer active:opacity-80 ${
                    isDone ? "bg-slate-100 dark:bg-slate-700" : isNow ? "bg-blue-600" : "bg-blue-50 dark:bg-blue-950"
                  }`}
                  onClick={() => !editMode && onSelectItem(item)}
                >
                  <Icon className={`h-8 w-8 ${isDone ? "text-slate-400" : isNow ? "text-white/80" : "text-blue-400"}`} />
                  {item.isLightningLane && (
                    <span className="absolute top-1 left-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                      <Zap className="h-3 w-3" />LL
                    </span>
                  )}
                </div>
              )}

              <div role="button" tabIndex={editMode ? -1 : 0} aria-label={`${item.titleJa}の詳細`} onKeyDown={e=>{if(!editMode && (e.key === "Enter" || e.key === " ")){e.preventDefault();onSelectItem(item);}}} className={`flex-1 p-3 min-w-0 cursor-pointer ${isNow ? "" : "active:bg-slate-50 dark:active:bg-slate-700"}`} onClick={() => !editMode && onSelectItem(item)}>
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className={`text-xs ${isNow ? "text-white/70" : "text-slate-400"}`}>{item.startTime}</span>
                  {item.type === "attraction" && !isDone && <WaitTimeChip attractionName={item.titleEn} attractionId={item.attractionId} />}
                  {item.type === "show" && !isDone && <ShowtimeChip showId={item.attractionId} />}
                  {item.type === "restaurant" && !isDone && <RestaurantStatusChip restaurantId={item.attractionId} />}
                  {isCompleted && <Check className="h-4 w-4 text-green-500" />}
                  {isSkipped && <X className="h-4 w-4 text-amber-500" />}
                </div>
                <h4 className={`font-medium leading-tight ${isDone ? "text-slate-800 dark:text-slate-200 line-through" : isNow ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
                  {item.titleJa}
                </h4>
                <p className={`text-xs truncate mt-0.5 ${isNow ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>{item.titleEn}</p>
              </div>

              {editMode && (
                <div className="flex flex-col justify-center gap-1 pr-2">
                  <button aria-label={`${item.titleJa}を編集`} onClick={() => onEditItem(item)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button aria-label={`${item.titleJa}を削除`} onClick={() => onDeleteItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
