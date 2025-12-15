"use client";

import { ArrowLeft, Download } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

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
import { useComparisonMetrics } from "./hooks";
import { onExport } from "./utils/exportCSV";

interface OpportunityPanelProps {
  storeId: string;
  onBack: () => void;
}

const OpportunityPanel: React.FC<OpportunityPanelProps> = ({
  storeId,
  onBack,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const { addAreaMarker, clearAreaMarkers } = useAreaMarkers();
  const { data, isError, isLoading } = useGetSimilarityForStoreQuery(storeId);

  const { baseArea, store, similarAreas } = data ?? {};

  const sortedAreas = useMemo(
    () =>
      similarAreas
        ? [...similarAreas].sort(
            (a, b) => b.similarityScore - a.similarityScore
          )
        : [],
    [similarAreas]
  );

  const selectedArea = useMemo(() => {
    if (!sortedAreas.length) return null;
    if (selectedAreaId !== null)
      return sortedAreas.find((a) => a.area.id === selectedAreaId) || null;
    return sortedAreas[0];
  }, [selectedAreaId, sortedAreas]);

  const comparisonMetrics = useComparisonMetrics(baseArea, selectedArea);

  useEffect(() => {
    clearAreaMarkers();
    sortedAreas.forEach(({ area }) => addAreaMarker(area));
    return () => clearAreaMarkers();
  }, [sortedAreas, addAreaMarker, clearAreaMarkers]);

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="p-4 text-sm text-red-500">Error loading data.</p>;
  if (!data || !store) return null;

  return (
    <div className="flex flex-col h-full bg-background border-l border-border animate-slide-in-right">
      <div className="flex flex-col gap-3 p-4 border-b border-border/40">
        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">
              Opportunity Areas
            </h2>
            <p className="text-sm text-muted-foreground">
              Areas similar to{" "}
              <span className="font-medium text-foreground">{store.name}</span>
            </p>
          </div>

          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto p-4">
        {selectedArea && (
          <div className="flex flex-col gap-3 rounded-xl bg-secondary/30 border border-border/40 p-4">
            <h3 className="text-base font-semibold text-foreground">
              Comparison: Store Area vs {selectedArea.area.area_name}
            </h3>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30">
                    <TableHead className="text-xs text-muted-foreground">
                      Metric
                    </TableHead>
                    <TableHead className="text-right text-xs text-muted-foreground">
                      Store Area
                    </TableHead>
                    <TableHead className="text-right text-xs text-muted-foreground">
                      Candidate Area
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {comparisonMetrics.map((metric) => (
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
          </div>
        )}

        <div className="flex flex-col gap-3 bg-secondary/30 rounded-xl p-4 border border-border/40">
          <h3 className="text-sm font-semibold text-foreground">
            Top {sortedAreas.length} Opportunity Areas
          </h3>

          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {sortedAreas.map(({ area, similarityScore }, index) => {
              const isSelected =
                selectedAreaId === area.id || (!selectedAreaId && index === 0);

              return (
                <div
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id!)}
                  className={cn(
                    "flex items-center justify-between rounded-lg p-3 cursor-pointer transition-all",
                    isSelected
                      ? "bg-segment-opportunity-bg border border-segment-opportunity"
                      : "bg-card border border-border/30 hover:border-segment-opportunity/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-segment-opportunity/10 text-segment-opportunity text-xs font-semibold">
                      {index + 1}
                    </span>

                    <div className="flex flex-col leading-tight">
                      <p className="text-sm font-medium text-foreground">
                        {area.area_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {area.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end leading-tight">
                    <p className="text-sm font-semibold text-segment-opportunity">
                      {similarityScore}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">match</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <Button
          onClick={() => onExport(sortedAreas)}
          className="w-full"
          size="lg"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Opportunity List (CSV)
        </Button>
      </div>
    </div>
  );
};

export default OpportunityPanel;
