import React from "react";
import { cn } from "@/lib/utils";
import { Store } from "@/types/store";
import { getFormattedLatestRevenue } from "@/utils/formatRevenue";
import { SegmentBadge } from "@/components/badges";

interface StoreCardProps {
  store: Store;
  onClick?: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  const revenueData = getFormattedLatestRevenue(store.yearly_revenue);
  const revenue = revenueData?.latestRevenue ?? "0";

  return (
    <div
      onClick={() => onClick?.(store)}
      className={cn(
        "flex flex-col gap-2 p-3 rounded-lg border border-border/30 bg-secondary/30 cursor-pointer transition-all hover:border-border hover:bg-accent/30 hover:shadow-sm"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {store.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{store.city}</p>
        </div>

        <SegmentBadge
          segment={store.rfm_segment}
          showLabel
          className="text-xs"
        />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">RFM {store.rfm_score}</p>
        <p className="text-sm font-semibold text-foreground">{revenue}/yr</p>
      </div>
    </div>
  );
};

export default StoreCard;
