"use client";

import { MapPin } from "lucide-react";
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useGetStoreQuery } from "@/api/storeApi";
import KPICard from "@/components/KPICard";
import { SegmentBadge } from "@/components/badges";
import { SEGMENT_ENUM } from "@/components/badges/SegmentBadge";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { useKpiSummary, useRollingSales } from "./hooks";
import { months, normalizeAreaPoi, normalizeAreaProfile } from "./utils";

interface StoreDetailsPanelProps {
  storeId: string;
  onClose: () => void;
  onFindSimilar: (id: string) => void;
}

const CardSection = memo<{
  title: string;
  hasHeight?: boolean;
  children: React.ReactNode;
}>(({ title, hasHeight = true, children }) => (
  <div className="flex flex-col gap-3 bg-secondary/30 rounded-xl p-4 border border-border/50">
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    {hasHeight ? <div className="h-[180px]">{children}</div> : children}
  </div>
));
CardSection.displayName = "CardSection";

const StoreDetailsPanel: React.FC<StoreDetailsPanelProps> = ({
  storeId,
  onClose,
  onFindSimilar,
}) => {
  const { data, error, isLoading, isFetching } = useGetStoreQuery(storeId);
  const [hasLoaded, setHasLoaded] = useState(false);

  const store = data?.store ?? null;
  const sales = data?.sales ?? null;
  const kpis = useKpiSummary(store);
  const chartSalesData = useRollingSales(sales);

  const demographicRows = useMemo(() => normalizeAreaProfile(store?.area), [store?.area]);
  const poiItems = useMemo(() => normalizeAreaPoi(store?.area), [store?.area]);
  const chartData = useMemo(
    () => chartSalesData.map((item) => ({ ...item, label: months[item.month] })),
    [chartSalesData],
  );

  useEffect(() => {
    if (data && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [data, hasLoaded]);

  if (isLoading && !hasLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">Failed to load store</p>
      </div>
    );
  }

  if (!data || !store || !sales) return null;

  return (
    <div className="flex flex-col h-full">
      {isFetching && hasLoaded && (
        <div className="absolute top-4 right-4 z-20">
          <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      )}

      <div className="flex flex-col gap-3 p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{store.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="line-clamp-2">{store.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <SegmentBadge segment={store.rfm_segment ?? SEGMENT_ENUM.CHAMPION} />
            <Button onClick={onClose} variant="outline" className="px-3 py-1 text-sm rounded-lg">
              Close
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {kpis.map((kpi) => (
              <KPICard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                subtitle={kpi.subtitle}
                trend={kpi.trend}
              />
            ))}
          </div>

          <CardSection title="Revenue Trend">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid grey",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelFormatter={(_, entry) => {
                    const { month, year } = entry?.[0]?.payload ?? {};
                    return `${months[month]} ${year}`;
                  }}
                  formatter={(v: number) => [`₹${(v / 100000).toFixed(1)}L`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={
                    kpis[0]?.trend.isPositive
                      ? "var(--segment-champion)"
                      : "var(--segment-attention)"
                  }
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardSection>

          <CardSection title="Monthly Transactions">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 8, left: 2 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  padding={{ left: 11, right: 11 }}
                />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid grey",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelFormatter={(_, entry) => {
                    const { year, month } = entry?.[0]?.payload ?? {};
                    return `${months[month]} ${year}`;
                  }}
                />
                <Bar dataKey="transactions" fill="#9433ee" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardSection>

          <CardSection title="Demographic Profile" hasHeight={false}>
            <div className="grid grid-cols-2 gap-3">
              {demographicRows.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 rounded-lg border border-border/40 bg-card p-3"
                >
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-base font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardSection>

          <CardSection title="POI Summary (3km radius)" hasHeight={false}>
            <div className="grid grid-cols-4 gap-3">
              {poiItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-card p-3"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <p className="text-xl font-semibold text-foreground leading-none">{item.value}</p>
                  <p className="text-xs text-muted-foreground text-center leading-tight">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </CardSection>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-background/95 backdrop-blur-sm">
        <Button
          onClick={() => onFindSimilar(storeId)}
          className="w-full bg-segment-opportunity text-white hover:bg-segment-opportunity/90"
          size="lg"
        >
          Find Similar Areas
        </Button>
      </div>
    </div>
  );
};

export default memo(StoreDetailsPanel);
