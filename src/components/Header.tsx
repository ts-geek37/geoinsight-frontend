"use client";

import { Activity, MapPin, Search } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobal } from "@/context";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const {
    storeMap: {
      filters,
      dispatch,
      heatmapEnabled,
      setHeatmapEnabled,
      markersEnabled,
      setMarkersEnabled,
    },
  } = useGlobal();

  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-16 items-center gap-6 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-segment-opportunity text-primary-foreground font-bold text-sm">
            GI
          </div>
          <span className="font-semibold text-lg tracking-tight">
            GeoInsight
          </span>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stores, cities, or areas..."
            value={filters.search}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
            className="pl-9 h-10 bg-muted/50"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm font-medium">
            Layers
          </span>

          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            <Button
              size="sm"
              onClick={() => setMarkersEnabled(!markersEnabled)}
              className={cn(
                "h-8 gap-2 px-3 rounded-md transition-all hover:bg-segment-opportunity/80",
                markersEnabled
                  ? "bg-segment-opportunity text-white shadow-sm"
                  : "bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Markers</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setHeatmapEnabled(!heatmapEnabled)}
              className={cn(
                "h-8 gap-2 px-3 rounded-md transition-all hover:bg-segment-opportunity/80",
                heatmapEnabled
                  ? "bg-segment-opportunity text-white shadow-sm"
                  : "bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Heatmap</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
