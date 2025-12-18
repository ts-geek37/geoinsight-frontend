"use client";

import { SegmentBadge } from "@/components/badges";
import { SEGMENT_ENUM } from "@/components/badges/SegmentBadge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGlobal } from "@/context/GlobalContext";
import { cn } from "@/lib/utils";

const baseSelect =
  "bg-secondary/30 border-border/40 text-foreground transition-colors hover:bg-accent w-full rounded-lg";

const formatValue = (v: number) =>
  v >= 1_00_00_000
    ? (v / 1_00_00_000).toFixed(2) + " Cr"
    : v >= 1_00_000
      ? (v / 1_00_000).toFixed(2) + " L"
      : v.toFixed(0);

const FilterPanel = () => {
  const {
    storeMap: { filters, dispatch, raw },
  } = useGlobal();

  if (!raw) return null;

  const { states, citiesByState, revenueMin, revenueMax } = raw.filters;

  const cityOptions = filters.state === "all" ? [] : (citiesByState[filters.state] ?? []);

  const segments = [SEGMENT_ENUM.CHAMPION, SEGMENT_ENUM.PROMISING, SEGMENT_ENUM.NEEDS_ATTENTION];

  const revenueRange: [number, number] = [
    filters.revenueRange.min ?? revenueMin,
    filters.revenueRange.max ?? revenueMax,
  ];

  const toggleSegment = (segment: SEGMENT_ENUM) => {
    const active = filters.segment;
    dispatch({
      type: "SET_SEGMENT",
      payload: active.includes(segment)
        ? active.filter((s) => s !== segment)
        : [...active, segment],
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-b border-border/40">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <Label className="text-xs text-muted-foreground">State</Label>
          <Select
            value={filters.state ?? "all"}
            onValueChange={(v) => dispatch({ type: "SET_STATE", payload: v })}
          >
            <SelectTrigger className={baseSelect}>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>

            <SelectContent position="popper" className="z-[1000]">
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <Label className="text-xs text-muted-foreground">City</Label>
          <Select
            value={filters.city ?? "all"}
            onValueChange={(v) => dispatch({ type: "SET_CITY", payload: v })}
          >
            <SelectTrigger className={baseSelect}>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>

            <SelectContent position="popper" className="z-[1000]">
              <SelectItem value="all">All Cities</SelectItem>
              {cityOptions.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">RFM Segment</Label>
        <div className="flex flex-wrap gap-1.5">
          {segments.map((segment) => {
            const active = filters.segment.includes(segment);
            return (
              <button key={segment} onClick={() => toggleSegment(segment)}>
                <SegmentBadge
                  showDot={false}
                  segment={segment}
                  showLabel
                  className={cn(
                    !active && "border border-border/40 bg-background-background text-foreground",
                    "px-4 py-2",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Revenue Range</Label>

        <Slider
          value={revenueRange}
          min={revenueMin}
          max={revenueMax}
          step={1000}
          onValueChange={(v) =>
            dispatch({
              type: "SET_REVENUE_RANGE",
              payload: { min: v[0], max: v[1] },
            })
          }
        />

        <div className="flex justify-between">
          {revenueRange.map((v, i) => (
            <span key={i} className="text-xs bg-background-background px-2 py-0.5 rounded">
              ₹{formatValue(v)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
