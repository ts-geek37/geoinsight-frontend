"use client";

import { Download, RotateCcw, StoreIcon } from "lucide-react";
import React, { memo } from "react";

import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/context/GlobalContext";
import { Store } from "@/types";
import useExportAllStoresCsv from "../dashboard/hooks/useExportAllStoresCsv";
import FilterPanel from "./FilterPanel";
import StoreCard from "./StoreCard";

interface SidebarDetailsProps {
  onSelectStore: (store: Store) => void;
}

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

const SidebarDetails: React.FC<SidebarDetailsProps> = ({ onSelectStore }) => {
  const {
    storesData: { isLoading, isError },
    storeMap,
  } = useGlobal();

  const filteredStores = storeMap.filteredStores;
  const { exportStoresCsv } = useExportAllStoresCsv(filteredStores);

  if (isLoading) {
    return <Loader className="bg-background" />;
  }

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
        onReset={storeMap.clearFilters}
        onExport={exportStoresCsv}
      />

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredStores.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <StoreIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No stores found</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredStores
            .sort((a, b) => b.rfm_score - a.rfm_score)
            .map((store) => <StoreCard key={store.id} store={store} onClick={onSelectStore} />)
        )}
      </div>
    </div>
  );
};

export default memo(SidebarDetails);
