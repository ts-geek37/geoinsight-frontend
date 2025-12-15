"use client";

import { AreaProfile, SimilarAreaResult } from "@/types";
import { useMemo } from "react";

const n = (v: unknown) => Number(v) || 0;
const pct = (v: unknown) => `${Math.round(n(v))}%`;
const kValue = (v: unknown) => `${Math.round(n(v) / 1000)}k`;

const totalPoi = (a: AreaProfile | SimilarAreaResult["area"]) =>
  n(a.bars) + n(a.restaurants) + n(a.hotels) + n(a.clubs);

const useComparisonMetrics = (
  baseArea?: AreaProfile | null,
  candidate?: SimilarAreaResult | null,
) =>
  useMemo(() => {
    if (!baseArea || !candidate) return [];

    const cand = candidate.area;

    return [
      {
        label: "Similarity Score",
        store: "100%",
        candidate: `${Math.round(candidate.similarityScore)}%`,
      },
      {
        label: "Population (3km)",
        store: kValue(baseArea.population_3km),
        candidate: kValue(cand.population_3km),
      },
      {
        label: "Income High %",
        store: pct(baseArea.income_high_percentage),
        candidate: pct(cand.income_high_percentage),
      },
      {
        label: "Age 25–55 %",
        store: pct(baseArea.age_25_55_pct),
        candidate: pct(cand.age_25_55_pct),
      },
      {
        label: "POI Activity Score",
        store: totalPoi(baseArea),
        candidate: totalPoi(cand),
      },
      {
        label: "Road Connectivity",
        store: n(baseArea.urban_score),
        candidate: n(cand.road_connectivity_score),
      },
      {
        label: "Priority Score",
        store: "100",
        candidate: n(cand.priority_score),
      },
    ];
  }, [baseArea, candidate]);

export default useComparisonMetrics;
