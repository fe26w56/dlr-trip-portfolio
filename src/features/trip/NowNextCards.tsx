import { Button } from "@/components/ui/button";
import { MapPin, Check } from "lucide-react";
import { RestaurantStatusBadge } from "@/features/wait-times/RestaurantStatusBadge";
import { ShowStatusBadge } from "@/features/wait-times/ShowStatusBadge";
import { WaitTimeBadge } from "@/features/wait-times/WaitTimeBadge";
import type { SelectableItem } from "./item-detail/types";

type NowNextCardsProps = {
  nowItem: SelectableItem | null;
  nextItem: SelectableItem | null;
  editMode: boolean;
  onOpenMaps: (item: SelectableItem) => void;
  onCompleteNow: (itemId: string) => void;
};

export function NowNextCards({ nowItem, nextItem, editMode, onOpenMaps, onCompleteNow }: NowNextCardsProps) {
  if (editMode) return null;

  return (
    <>
      {nowItem && (
        <div className="mx-4 mt-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">NOW</span>
            <span className="text-xs opacity-80">
              {nowItem.startTime} - {nowItem.endTime}
            </span>
            {nowItem.type === "attraction" && (
              <WaitTimeBadge attractionName={nowItem.titleEn} attractionId={nowItem.attractionId} className="!bg-white/20 !text-white" />
            )}
            {nowItem.type === "show" && <ShowStatusBadge showId={nowItem.attractionId} className="!bg-white/20 !text-white" />}
            {nowItem.type === "restaurant" && (
              <RestaurantStatusBadge restaurantId={nowItem.attractionId} className="!bg-white/20 !text-white" />
            )}
          </div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-0.5">{nowItem.titleJa}</h3>
              <p className="text-sm opacity-80">{nowItem.titleEn}</p>
              {nowItem.location && (
                <p className="text-xs opacity-60 mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {nowItem.location}
                </p>
              )}
            </div>
            {nowItem.isLightningLane && <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">LL</span>}
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="secondary" className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0" onClick={() => onOpenMaps(nowItem)}>
              <MapPin className="h-4 w-4 mr-1" />
              Maps
            </Button>
            <Button size="sm" className="flex-1 bg-white text-blue-600 hover:bg-white/90" onClick={() => onCompleteNow(nowItem.id!)}>
              <Check className="h-4 w-4 mr-1" />
              完了
            </Button>
          </div>
        </div>
      )}

      {nextItem && (
        <div className="mx-4 mt-3 bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">NEXT</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {nextItem.startTime} - {nextItem.endTime}
            </span>
            {nextItem.type === "attraction" && <WaitTimeBadge attractionName={nextItem.titleEn} attractionId={nextItem.attractionId} />}
            {nextItem.type === "show" && <ShowStatusBadge showId={nextItem.attractionId} />}
            {nextItem.type === "restaurant" && <RestaurantStatusBadge restaurantId={nextItem.attractionId} />}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{nextItem.titleJa}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{nextItem.titleEn}</p>
            </div>
            {nextItem.isLightningLane && <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium px-2 py-1 rounded-full">LL</span>}
          </div>
        </div>
      )}
    </>
  );
}
