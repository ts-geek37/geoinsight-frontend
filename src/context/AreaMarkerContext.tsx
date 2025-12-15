"use client";

import { AreaProfile } from "@/types";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PanelView, usePanel } from "./PanelContext";

interface AreaMarkerState {
  areaMarkers: AreaProfile[];
  addAreaMarker: (m: AreaProfile) => void;
  removeAreaMarker: (i: number) => void;
  clearAreaMarkers: () => void;
}

const AreaMarkerContext = createContext<AreaMarkerState | null>(null);

export const AreaMarkerProvider = ({ children }: { children: React.ReactNode }) => {
  const [areaMarkers, setAreaMarkers] = useState<AreaProfile[]>([]);

  const addAreaMarker = useCallback(
    (marker: AreaProfile) => setAreaMarkers((prev) => [...prev, marker]),
    [],
  );

  const removeAreaMarker = useCallback(
    (i: number) => setAreaMarkers((prev) => prev.filter((_, idx) => idx !== i)),
    [],
  );

  const clearAreaMarkers = useCallback(() => setAreaMarkers([]), []);

  const value = useMemo(
    () => ({
      areaMarkers,
      addAreaMarker,
      removeAreaMarker,
      clearAreaMarkers,
    }),
    [areaMarkers],
  );
  const { view } = usePanel();
  const isOpportunityPanelOpen = view === PanelView.SIMILAR;

  useEffect(() => {
    if (!isOpportunityPanelOpen) clearAreaMarkers();
  }, [isOpportunityPanelOpen]);

  return <AreaMarkerContext.Provider value={value}>{children}</AreaMarkerContext.Provider>;
};

export const useAreaMarkers = () => {
  const ctx = useContext(AreaMarkerContext);
  if (!ctx) throw new Error("useAreaMarkers must be used within AreaMarkerProvider");
  return ctx;
};
