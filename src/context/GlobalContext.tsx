"use client";

import { createContext, useCallback, useContext, useMemo, useReducer } from "react";

import { useGetStoresQuery } from "@/api";
import { SEGMENT_ENUM } from "@/components/badges/SegmentBadge";
import { Store } from "@/types";

export type MapStyle = "light" | "dark" | "standard" | "satellite";

interface RevenueRange {
  min: number | null;
  max: number | null;
}

interface FilterState {
  search: string;
  state: string;
  city: string;
  segment: SEGMENT_ENUM[];
  revenueRange: RevenueRange;
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_STATE"; payload: string }
  | { type: "SET_CITY"; payload: string }
  | { type: "SET_SEGMENT"; payload: SEGMENT_ENUM[] }
  | { type: "SET_REVENUE_RANGE"; payload: RevenueRange }
  | { type: "CLEAR_ALL" };

interface StoreMapState {
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;

  heatmapEnabled: boolean;
  setHeatmapEnabled: (v: boolean) => void;

  markersEnabled: boolean;
  setMarkersEnabled: (v: boolean) => void;

  mapStyle: MapStyle;
  setMapStyle: (v: MapStyle) => void;

  stateOptions: string[];
  cityOptions: string[];
  filteredStores: Store[];
  heatmapPoints: [number, number, number][];
  segmentCounts: { champion: number; promising: number; attention: number };

  clearFilters: () => void;
}

interface GlobalContextValue {
  storesData: {
    stores: Store[];
    isLoading: boolean;
    isError: boolean;
  };
  storeMap: StoreMapState;
}

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

const GlobalContext = createContext<GlobalContextValue | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: stores = [], isLoading, isError } = useGetStoresQuery();

  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const [heatmapEnabled, setHeatmapEnabled] = useReducer((_: boolean, next: boolean) => next, true);

  const [markersEnabled, setMarkersEnabled] = useReducer((_: boolean, next: boolean) => next, true);

  const [mapStyle, setMapStyle] = useReducer((_: MapStyle, next: MapStyle) => next, "standard");

  const stateOptions = useMemo(() => [...new Set(stores.map((s) => s.state))].sort(), [stores]);

  const cityOptions = useMemo(() => {
    const cities = stores
      .filter((s) => filters.state === "all" || s.state === filters.state)
      .map((s) => s.city);
    return [...new Set(cities)].sort();
  }, [stores, filters.state]);

  const filteredStores = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return stores.filter((store) => {
      if (q) {
        const match =
          store.name.toLowerCase().includes(q) ||
          store.city.toLowerCase().includes(q) ||
          store.state.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (filters.state !== "all" && store.state !== filters.state) return false;
      if (filters.city !== "all" && store.city !== filters.city) return false;
      if (!filters.segment.includes(store.rfm_segment)) return false;

      if (filters.revenueRange.min !== null || filters.revenueRange.max !== null) {
        const yearly = store.yearly_revenue;
        if (yearly?.length) {
          const latest = yearly.reduce((a, b) => (a.year > b.year ? a : b));
          const revenue = Number(latest.revenue_inr);

          if (filters.revenueRange.min !== null && revenue < filters.revenueRange.min) return false;
          if (filters.revenueRange.max !== null && revenue > filters.revenueRange.max) return false;
        }
      }

      return true;
    });
  }, [stores, filters]);

  const heatmapPoints = useMemo(
    () =>
      filteredStores.map((s) => [s.latitude, s.longitude, s.rfm_score] as [number, number, number]),
    [filteredStores],
  );

  const segmentCounts = useMemo(
    () => ({
      champion: filteredStores.filter((s) => s.rfm_segment === SEGMENT_ENUM.CHAMPION).length,
      promising: filteredStores.filter((s) => s.rfm_segment === SEGMENT_ENUM.PROMISING).length,
      attention: filteredStores.filter((s) => s.rfm_segment === SEGMENT_ENUM.NEEDS_ATTENTION)
        .length,
    }),
    [filteredStores],
  );

  const clearFilters = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  const storeMap = useMemo<StoreMapState>(
    () => ({
      filters,
      dispatch,
      heatmapEnabled,
      setHeatmapEnabled,
      markersEnabled,
      setMarkersEnabled,
      mapStyle,
      setMapStyle,
      stateOptions,
      cityOptions,
      filteredStores,
      heatmapPoints,
      segmentCounts,
      clearFilters,
    }),
    [
      filters,
      heatmapEnabled,
      markersEnabled,
      mapStyle,
      stateOptions,
      cityOptions,
      filteredStores,
      heatmapPoints,
      segmentCounts,
      clearFilters,
    ],
  );

  const value = useMemo<GlobalContextValue>(
    () => ({
      storesData: { stores, isLoading, isError },
      storeMap,
    }),
    [stores, isLoading, isError, storeMap],
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used within GlobalProvider");
  return ctx;
};
