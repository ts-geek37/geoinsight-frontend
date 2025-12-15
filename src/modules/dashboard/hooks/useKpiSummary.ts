"use client";

import { Store } from "@/types";
import { formatIndianNumber } from "@/utils/formatRevenue";
import { useMemo } from "react";

const n = (v: unknown) => Number(v) || 0;

const calcTrend = (curr: number, prev?: number) => {
  if (!prev || prev === 0) return { value: 0, isPositive: true };
  const pct = ((curr - prev) / prev) * 100;
  return { value: Number(pct.toFixed(2)), isPositive: pct >= 0 };
};

const useKpiSummary = (store?: Store | null) =>
  useMemo(() => {
    if (!store) return [];

    const records = [...store.yearly_revenue].sort((a, b) => a.year - b.year);
    if (records.length === 0) {
      return [
        {
          title: "Total Revenue",
          value: "₹0",
          trend: { value: 0, isPositive: true },
        },
        {
          title: "Transactions",
          value: "0",
          subtitle: "/year",
          trend: { value: 0, isPositive: true },
        },
        {
          title: "Avg Ticket",
          value: "₹0",
          trend: { value: 0, isPositive: true },
        },
      ];
    }

    const current = records.at(-1)!;
    const prev = records.at(-2);

    const revenue = n(current.revenue_inr);
    const txn = n(current.transaction_count);
    const avg = n(current.avg_ticket_size);

    return [
      {
        title: "Total Revenue",
        value: formatIndianNumber(revenue),
        trend: calcTrend(revenue, prev?.revenue_inr),
      },
      {
        title: "Transactions",
        value: txn.toLocaleString(),
        subtitle: "/year",
        trend: calcTrend(txn, prev?.transaction_count),
      },
      {
        title: "Avg Ticket",
        value: formatIndianNumber(avg),
        trend: calcTrend(avg, prev?.avg_ticket_size),
      },
    ];
  }, [store]);

export default useKpiSummary;
