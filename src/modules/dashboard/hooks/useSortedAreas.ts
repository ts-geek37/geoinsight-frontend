"use client";

import { SimilarAreaResult } from "@/types";
import { useMemo } from "react";

export const useSortedAreas = (areas?: SimilarAreaResult[] | null) =>
  useMemo(() => {
    if (!areas) return [];
    return [...areas].sort((a, b) => b.similarityScore - a.similarityScore);
  }, [areas]);

export default useSortedAreas;