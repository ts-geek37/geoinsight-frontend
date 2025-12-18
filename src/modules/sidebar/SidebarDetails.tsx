"use client";

import { Download, RotateCcw, StoreIcon } from "lucide-react";
import { memo } from "react";

import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/context/GlobalContext";
import { useExportAllStoresCsv } from "../dashboard/hooks";
import FilterPanel from "./FilterPanel";
import StoreCard from "./StoreCard";

const SidebarHeader = memo(
  ({ count, onReset, onExport }: { count: number; onReset: () => void; onExport: () => void }) => (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <StoreIcon className="w-4 h-4" />
          Filters
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onReset} variant="outline" size="sm" className="h-8 px-3">
            <RotateCcw className="w-3 h-3 mr-1.5" />
            Reset
          </Button>

          <Button onClick={onExport} variant="outline" size="sm" className="h-8 px-3">
            <Download className="w-3 h-3 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      <FilterPanel />

      <div className="flex items-center justify-between text-sm font-semibold border-y border-border/40 px-4 py-3 bg-muted/30 sticky top-[57px] z-10">
        <span>STORES</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
          {count}
        </span>
      </div>
    </>
  ),
);
SidebarHeader.displayName = "SidebarHeader";

interface Props {
  onSelectStore: (id: string) => void;
}

const SidebarDetails: React.FC<Props> = ({ onSelectStore }) => {
  const {
    storeMap: { filteredStores, isLoading, isError, clearFilters },
  } = useGlobal();

  const { exportStoresCsv } = useExportAllStoresCsv(filteredStores);

  if (isLoading) return <Loader className="bg-background" />;

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">Error loading store data.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <SidebarHeader
        count={filteredStores.length}
        onReset={clearFilters}
        onExport={exportStoresCsv}
      />

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredStores.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No stores found
          </div>
        ) : (
          [...filteredStores]
            .sort((a, b) => b.rfmScore - a.rfmScore)
            .map((store) => <StoreCard key={store.id} store={store} onClick={onSelectStore} />)
        )}
      </div>
    </div>
  );
};

export default memo(SidebarDetails);
