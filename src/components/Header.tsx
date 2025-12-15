"use client";

import { Layers, Map, Search, FileDown } from "lucide-react";
import React from "react";

import { Input } from "@/components/ui/input";
import { useGlobal } from "@/context";
import { cn } from "@/lib/utils";
import { MAP_STYLE_URLS } from "@/utils/mapStyle";
import { useStoreAreaSummaryPdf } from "@/modules/dashboard/hooks";

const Header: React.FC = () => {
  const {
    storeMap: {
      filters,
      dispatch,
      heatmapEnabled,
      setHeatmapEnabled,
      markersEnabled,
      setMarkersEnabled,
      mapStyle,
      setMapStyle,
    },
  } = useGlobal();

  const { createPdf, isLoading } = useStoreAreaSummaryPdf();

  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-16 items-center gap-6 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-segment-opportunity text-primary-foreground font-bold text-sm">
            GI
          </div>
          <span className="font-semibold text-lg tracking-tight">GeoInsight</span>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stores, cities, or areas..."
            value={filters.search}
            onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
            className="pl-9 h-10 border bg-secondary/40"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-secondary/40 p-1">
            <div className="flex items-center px-2 text-muted-foreground">
              <Map className="h-4 w-4" />
            </div>

            {Object.entries(MAP_STYLE_URLS).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setMapStyle(key as any)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  mapStyle === key
                    ? "bg-segment-opportunity text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {style.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-secondary/40 p-1">
            <div className="flex items-center px-2 text-muted-foreground">
              <Layers className="h-4 w-4" />
            </div>

            <button
              onClick={() => setMarkersEnabled(!markersEnabled)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                markersEnabled
                  ? "bg-segment-opportunity text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Markers
            </button>

            <button
              onClick={() => setHeatmapEnabled(!heatmapEnabled)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                heatmapEnabled
                  ? "bg-segment-opportunity text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Heatmap
            </button>
          </div>

          <button
            onClick={createPdf}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-1 rounded-lg border border-border/40 bg-secondary/40 px-3 py-2 text-xs font-medium transition-colors",
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-segment-opportunity hover:text-white",
            )}
          >
            <FileDown className="h-4 w-4" />
            Report
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
