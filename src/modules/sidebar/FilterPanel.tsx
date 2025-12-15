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

const FilterPanel = () => {
  const {
    storesData: { stores = [] },
    storeMap: { filters, dispatch, stateOptions, cityOptions },
  } = useGlobal();

  const segments = [SEGMENT_ENUM.CHAMPION, SEGMENT_ENUM.PROMISING, SEGMENT_ENUM.NEEDS_ATTENTION];

  const latestRevenues = stores.map((s) => {
    const yearly = s.yearly_revenue;
    if (!yearly?.length) return 0;
    const latest = yearly.reduce((a, b) => (a.year > b.year ? a : b));
    return Number(latest.revenue_inr);
  });

  const maxRevenue = Math.max(...latestRevenues, 10000000);

  const revenueRange = [
    filters.revenueRange?.min ?? 0,
    filters.revenueRange?.max ?? maxRevenue,
  ] as [number, number];

  const toggleSegment = (segment: SEGMENT_ENUM) => {
    const active = filters.segment || [];
    const updated = active.includes(segment)
      ? active.filter((s) => s !== segment)
      : [...active, segment];

    dispatch({ type: "SET_SEGMENT", payload: updated });
  };

  const formatValue = (v: number) =>
    v >= 10000000
      ? (v / 10000000).toFixed(2) + " Cr"
      : v >= 100000
        ? (v / 100000).toFixed(2) + " L"
        : v.toFixed(0);

  const selectedSegments = filters.segment || [];

  return (
    <div className="flex flex-col gap-4 p-4 border-b border-border/40 bg-background">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <Label className="text-xs text-muted-foreground">State</Label>
          <Select
            value={filters.state}
            onValueChange={(v) => dispatch({ type: "SET_STATE", payload: v })}
          >
            <SelectTrigger className={baseSelect}>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {stateOptions.map((state) => (
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
            value={filters.city}
            onValueChange={(v) => dispatch({ type: "SET_CITY", payload: v })}
          >
            <SelectTrigger className={baseSelect}>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
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
            const active = selectedSegments.includes(segment);
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
          min={0}
          max={maxRevenue}
          step={1000}
          onValueChange={(v) =>
            dispatch({
              type: "SET_REVENUE_RANGE",
              payload: { min: v[0], max: v[1] },
            })
          }
        />

        <div className="flex justify-between">
          {[revenueRange[0], revenueRange[1]].map((v, i) => (
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
