"use client";

import { FileDown, PanelLeft, Search, Settings } from "lucide-react";
import React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGlobal, useSidebar } from "@/context";
import { cn } from "@/lib/utils";
import { useStoreAreaSummaryPdf } from "@/modules/dashboard/hooks";
import { MAP_STYLE_URLS } from "@/utils/mapStyle";

const Header: React.FC = () => {
  const {
    storeMap: { filters, dispatch },
    ui: {
      heatmapEnabled,
      setHeatmapEnabled,
      markersEnabled,
      setMarkersEnabled,
      mapStyle,
      setMapStyle,
    },
  } = useGlobal();

  const { open, toggleSidebar } = useSidebar();
  const { createPdf, isLoading } = useStoreAreaSummaryPdf();

  return (
    <header className="border-b border-border bg-background h-[64px]">
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
              open ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <PanelLeft className="h-4 w-4" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-segment-opportunity text-primary-foreground font-bold text-sm">
            GI
          </div>

          <span className="hidden text-sm font-semibold md:block">GeoInsight</span>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            value={filters.search}
            onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
            className="h-9 border bg-secondary/40 pl-9"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="ml-auto flex h-9 w-9 items-center justify-center rounded-md border transition hover:bg-muted">
              <Settings className="h-4 w-4" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="z-[1000] w-fit space-y-2 p-4 text-sm"
          >
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground/80">Map style</div>

              <div className="flex gap-2">
                {Object.entries(MAP_STYLE_URLS).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => setMapStyle(key as any)}
                    className={cn(
                      "w-full rounded-md px-3 py-1.5 font-medium transition-colors",
                      mapStyle === key
                        ? "bg-segment-opportunity/90 text-white"
                        : "border border-border/30 text-foreground/70 hover:bg-muted",
                    )}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground/80">Layers</div>

              <div className="flex gap-2">
                <label
                  htmlFor="markers"
                  className="flex flex-1 cursor-pointer items-center justify-between rounded-md border border-border/30 px-2.5 py-2 transition hover:bg-muted"
                >
                  <span className="font-medium text-foreground/80">Markers</span>
                  <Checkbox
                    id="markers"
                    checked={markersEnabled}
                    onCheckedChange={(v) => setMarkersEnabled(!!v)}
                    className="data-[state=checked]:border-segment-opportunity data-[state=checked]:bg-segment-opportunity"
                  />
                </label>

                <label
                  htmlFor="heatmap"
                  className="flex flex-1 cursor-pointer items-center justify-between rounded-md border border-border/30 px-2.5 py-2 transition hover:bg-muted"
                >
                  <span className="font-medium text-foreground/80">Heatmap</span>
                  <Checkbox
                    id="heatmap"
                    checked={heatmapEnabled}
                    onCheckedChange={(v) => setHeatmapEnabled(!!v)}
                    className="data-[state=checked]:border-segment-opportunity data-[state=checked]:bg-segment-opportunity"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={createPdf}
              disabled={isLoading}
              className={cn(
                "flex w-full items-center justify-between pt-1 font-medium transition-colors",
                isLoading
                  ? "cursor-not-allowed text-muted-foreground opacity-50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Export report</span>
              <FileDown className="h-4 w-4" />
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
