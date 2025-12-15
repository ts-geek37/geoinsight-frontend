"use client";

import { StoreIcon } from "lucide-react";
import React from "react";

import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/context/GlobalContext";
import { Store } from "@/types";
import useExportAllStoresCsv from "../dashboard/hooks/useExportAllStoresCsv";
import FilterPanel from "./FilterPanel";
import StoreCard from "./StoreCard";

const SidebarDetails: React.FC<{ onSelectStore: (store: Store) => void }> = ({ onSelectStore }) => {
  const {
    storesData: { isLoading, isError },
    storeMap,
  } = useGlobal();

  const filteredStores = storeMap.filteredStores;
  const { exportStoresCsv } = useExportAllStoresCsv(filteredStores);

  if (isLoading) return <Loader />;

  if (isError) return <p className="p-4 text-sm text-red-500">Error loading store data.</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border/40">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <StoreIcon className="w-4 h-4" />
          Filters
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={storeMap.clearFilters} variant="outline" className="text-xs rounded-lg">
            Reset
          </Button>

          <Button onClick={exportStoresCsv} variant="outline" className="text-xs rounded-lg">
            Export
          </Button>
        </div>
      </div>
      <FilterPanel />

      <div className="flex items-center justify-between text-sm font-semibold border-t border-b border-border/40 px-4 py-3 sticky top-0 z-10">
        <span>STORES</span>
        <span className="text-xs px-2 py-0.5 rounded-full text-muted-foreground">
          {filteredStores.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto p-3">
        {filteredStores
          .sort((a, b) => b.rfm_score - a.rfm_score)
          .map((store) => (
            <StoreCard key={store.id} store={store} onClick={onSelectStore} />
          ))}
      </div>
    </div>
  );
};

export default SidebarDetails;
