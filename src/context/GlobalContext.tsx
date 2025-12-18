"use client";

import { createContext, useContext, useMemo, useReducer, useState } from "react";

import { SEGMENT_ENUM } from "@/components/badges/SegmentBadge";
import { StoreMapItemDTO, StoreMapResponseDTO } from "@/types";
import { useGetStoresQuery } from "@/api";

export type MapStyle = "light" | "dark" | "standard" | "satellite";

interface RevenueRange {
  min: number | null;
  max: number | null;
}

interface FilterState {
  search: string;
  state: string;
  city: string;
  segment: string[];
  revenueRange: RevenueRange;
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_STATE"; payload: string }
  | { type: "SET_CITY"; payload: string }
  | { type: "SET_SEGMENT"; payload: string[] }
  | { type: "SET_REVENUE_RANGE"; payload: RevenueRange }
  | { type: "CLEAR_ALL" };

const initialFilters: FilterState = {
  search: "",
  state: "all",
  city: "all",
  segment: [SEGMENT_ENUM.CHAMPION, SEGMENT_ENUM.PROMISING, SEGMENT_ENUM.NEEDS_ATTENTION],
  revenueRange: { min: null, max: null },
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_STATE":
      return { ...state, state: action.payload, city: "all" };
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_SEGMENT":
      return { ...state, segment: action.payload };
    case "SET_REVENUE_RANGE":
      return { ...state, revenueRange: action.payload };
    case "CLEAR_ALL":
      return initialFilters;
    default:
      return state;
  }
}

interface GlobalContextValue {
  storeMap: {
    raw: StoreMapResponseDTO | null;
    filteredStores: StoreMapItemDTO[];
    isLoading: boolean;
    isError: boolean;
    filters: FilterState;
    dispatch: React.Dispatch<FilterAction>;
    clearFilters: () => void;
  };

  ui: {
    heatmapEnabled: boolean;
    setHeatmapEnabled: (v: boolean) => void;
    markersEnabled: boolean;
    setMarkersEnabled: (v: boolean) => void;
    mapStyle: MapStyle;
    setMapStyle: (v: MapStyle) => void;
  };
}

const GlobalContext = createContext<GlobalContextValue | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, isError } = useGetStoresQuery();
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const [heatmapEnabled, setHeatmapEnabled] = useState(true);
  const [markersEnabled, setMarkersEnabled] = useState(true);
  const [mapStyle, setMapStyle] = useState<MapStyle>("standard");

  const filteredStores = useMemo(() => {
    if (!data) return [];

    const q = filters.search.trim().toLowerCase();

    return data.stores.filter((s) => {
      if (q) {
        const match =
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (filters.state !== "all" && s.state !== filters.state) return false;
      if (filters.city !== "all" && s.city !== filters.city) return false;
      if (!filters.segment.includes(s.rfmSegment)) return false;

      const { min, max } = filters.revenueRange;
      if (min !== null && s.latestRevenue < min) return false;
      if (max !== null && s.latestRevenue > max) return false;

      return true;
    });
  }, [data, filters]);

  const value = useMemo(
    () => ({
      storeMap: {
        raw: data ?? null,
        filteredStores,
        isLoading,
        isError,
        filters,
        dispatch,
        clearFilters: () => dispatch({ type: "CLEAR_ALL" }),
      },
      ui: {
        heatmapEnabled,
        setHeatmapEnabled,
        markersEnabled,
        setMarkersEnabled,
        mapStyle,
        setMapStyle,
      },
    }),
    [data, filteredStores, isLoading, isError, filters, heatmapEnabled, markersEnabled, mapStyle],
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used within GlobalProvider");
  return ctx;
};
