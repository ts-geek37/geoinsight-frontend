import React from "react";

import { SegmentBadge } from "@/components/badges";
import { cn } from "@/lib/utils";
import { StoreMapItemDTO } from "@/types";

interface StoreCardProps {
  store: StoreMapItemDTO;
  onClick: (id: string) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(store.id)}
      className={cn(
        "flex flex-col gap-2 p-3 rounded-lg border border-border/30 bg-secondary/30 cursor-pointer transition-all hover:border-border hover:bg-accent/30 hover:shadow-sm",
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{store.name}</p>
          <p className="text-xs text-muted-foreground truncate">{store.city}</p>
        </div>

        <SegmentBadge segment={store.rfmSegment as any} showLabel className="text-xs" />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">RFM {store.rfmScore}</p>
        <p className="text-sm font-semibold text-foreground">{store.latestRevenueFormatted}/yr</p>
      </div>
    </div>
  );
};

export default StoreCard;
