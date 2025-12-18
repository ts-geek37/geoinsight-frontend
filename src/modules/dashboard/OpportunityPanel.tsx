"use client";

import { ArrowLeft, Download } from "lucide-react";
import React, { memo, useEffect, useMemo, useState } from "react";

import { useGetSimilarityForStoreQuery } from "@/api/similarityApi";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAreaMarkers } from "@/context";
import { cn } from "@/lib/utils";
import { SimilarityResponseDTO } from "@/types";
import { onExport } from "./utils/exportCSV";

const mapToMarker = (item: SimilarityResponseDTO["candidates"][number]) => {
  const populationMetric = item.metrics.find((m) => m.label === "Population (3km)");

  return {
    id: item.area.id,
    name: item.area.name,
    city: item.area.city,
    latitude: item.area.latitude,
    longitude: item.area.longitude,
    similarityScore: item.similarityScore,
    population3km: populationMetric?.candidate,
  };
};

interface OpportunityPanelProps {
  storeId: string;
  onBack: () => void;
}

const ComparisonTable = memo(
  ({ metrics }: { metrics: { label: string; store: string; candidate: string }[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30">
            <TableHead className="text-xs text-muted-foreground">Metric</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">Store Area</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Candidate Area
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.label} className="border-border/20">
              <TableCell className="text-sm">{metric.label}</TableCell>
              <TableCell className="text-right text-sm font-semibold text-segment-champion">
                {metric.store}
              </TableCell>
              <TableCell className="text-right text-sm font-semibold text-segment-opportunity">
                {metric.candidate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
);
ComparisonTable.displayName = "ComparisonTable";

const OpportunityPanel: React.FC<OpportunityPanelProps> = ({ storeId, onBack }) => {
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { addAreaMarker, clearAreaMarkers } = useAreaMarkers();
  const { data, isError, isLoading } = useGetSimilarityForStoreQuery(storeId);

  const candidates = data?.candidates ?? [];

  const sortedAreas = useMemo(
    () => [...candidates].sort((a, b) => b.similarityScore - a.similarityScore),
    [candidates],
  );

  const selectedArea = useMemo(() => {
    if (!sortedAreas.length) return null;
    if (selectedAreaId !== null) {
      return sortedAreas.find((a) => a.area.id === selectedAreaId) ?? null;
    }
    return sortedAreas[0];
  }, [selectedAreaId, sortedAreas]);

  useEffect(() => {
    if (data && !hasLoaded) setHasLoaded(true);
  }, [data, hasLoaded]);

  useEffect(() => {
    clearAreaMarkers();
     if(!sortedAreas.length) return
    sortedAreas.forEach((item) => addAreaMarker(mapToMarker(item)));
    return () => clearAreaMarkers();
  }, [sortedAreas]);

  if (isLoading && !hasLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-destructive">Error loading opportunity data.</p>
      </div>
    );
  }

  if (!data || !sortedAreas.length) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">No opportunity areas found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground">Opportunity Areas</h2>
          <p className="text-sm text-muted-foreground truncate">
            Similar to <span className="font-medium text-foreground">{data.store?.name}</span>
          </p>
        </div>

        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 space-y-4">
          {selectedArea && selectedArea.metrics?.length > 0 && (
            <div className="rounded-xl bg-secondary/30 border border-border/40 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Comparison: Store Area vs {selectedArea.area.name}
              </h3>
              <ComparisonTable metrics={selectedArea.metrics} />
            </div>
          )}

          <div className="bg-secondary/30 rounded-xl p-4 border border-border/40 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Top {sortedAreas.length} Opportunity Areas
            </h3>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {sortedAreas.map((item, index) => {
                const { area, similarityScore } = item;
                const isSelected = selectedAreaId === area.id || (!selectedAreaId && index === 0);

                return (
                  <button
                    key={area.id}
                    onClick={() => setSelectedAreaId(area.id)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg p-3 transition-all text-left",
                      isSelected
                        ? "bg-segment-opportunity-bg border border-segment-opportunity shadow-sm"
                        : "bg-card border border-border/30 hover:border-segment-opportunity/50 hover:shadow-sm",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-segment-opportunity/10 text-segment-opportunity text-xs font-semibold">
                        {index + 1}
                      </span>

                      <div className="flex flex-col leading-tight min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{area.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{area.city}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end leading-tight ml-3">
                      <p className="text-sm font-semibold text-segment-opportunity">
                        {similarityScore}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">match</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-background/95 backdrop-blur-sm">
        <Button
          onClick={() => onExport(sortedAreas, data.store)}
          className="w-full"
          size="lg"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Similar Areas (CSV)
        </Button>
      </div>
    </div>
  );
};

export default memo(OpportunityPanel);
