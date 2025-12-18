"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { AreaMarkerDTO } from "@/types";
import { PanelView, usePanel } from "./PanelContext";

interface AreaMarkerState {
  areaMarkers: AreaMarkerDTO[];
  addAreaMarker: (m: AreaMarkerDTO) => void;
  removeAreaMarker: (i: number) => void;
  clearAreaMarkers: () => void;
}

const AreaMarkerContext = createContext<AreaMarkerState | null>(null);

export const AreaMarkerProvider = ({ children }: { children: React.ReactNode }) => {
  const [areaMarkers, setAreaMarkers] = useState<AreaMarkerDTO[]>([]);

  const addAreaMarker = useCallback(
    (marker: AreaMarkerDTO) => setAreaMarkers((prev) => [...prev, marker]),
    [],
  );

  const removeAreaMarker = useCallback(
    (i: number) => setAreaMarkers((prev) => prev.filter((_, idx) => idx !== i)),
    [],
  );

  const clearAreaMarkers = useCallback(() => {
    setAreaMarkers((prev) => (prev.length ? [] : prev));
  }, []);

  const value = useMemo(
    () => ({
      areaMarkers,
      addAreaMarker,
      removeAreaMarker,
      clearAreaMarkers,
    }),
    [areaMarkers, addAreaMarker, removeAreaMarker, clearAreaMarkers],
  );

  const { view } = usePanel();
  const isOpportunityPanelOpen = view === PanelView.SIMILAR;

  useEffect(() => {
    if (!isOpportunityPanelOpen && areaMarkers.length > 0) {
      clearAreaMarkers();
    }
  }, [isOpportunityPanelOpen, areaMarkers.length, clearAreaMarkers]);

  return <AreaMarkerContext.Provider value={value}>{children}</AreaMarkerContext.Provider>;
};

export const useAreaMarkers = () => {
  const ctx = useContext(AreaMarkerContext);
  if (!ctx) throw new Error("useAreaMarkers must be used within AreaMarkerProvider");
  return ctx;
};
