"use client";

import { Sales } from "@/types";
import { useMemo } from "react";

const n = (v: unknown) => Number(v) || 0;

const useRollingSales = (sales?: Sales[] | null) => {
  return useMemo(() => {
    if (!sales || sales.length === 0) return [];

    const sorted = sales
      .map((s) => ({
        month: s.month,
        year: s.year,
        revenue: n(s.revenue_inr),
        transactions: n(s.transaction_count),
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

    const latestYear = sorted[sorted.length - 1].year;

    return sorted.filter((s) => s.year === latestYear);
  }, [sales]);
};

export default useRollingSales;
