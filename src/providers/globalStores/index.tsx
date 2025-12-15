"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";

import { useGetStoresQuery } from "@/api/storeApi";
import { SEGMENT_ENUM } from "@/components/badges/SegmentBadge";
import { RevenueFilter, Store } from "@/types";
import matchesRevenueFilter from "@/utils/revenue";

type MarkerType = "store" | "area";

export interface Marker {
  type: MarkerType;
  latitude: number;
  longitude: number;
  rfmScore: number | null;
  storeId?: string | number;
  content?: {
    store?: string;
    storeLocation?: string;
    storeRevenue?: string;
    areaName?: string;
    areaPopulation?: number;
    areaSimilarity?: number;
  };
}

interface FilterState {
  search: string;
  state: string;
  city: string;
  segment: string;
  revenue: RevenueFilter;
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_STATE"; payload: string }
  | { type: "SET_CITY"; payload: string }
  | { type: "SET_SEGMENT"; payload: string }
  | { type: "SET_REVENUE"; payload: RevenueFilter }
  | { type: "CLEAR_FILTERS" };

interface StoreMapState {
  filters: FilterState;
  setSearch: (v: string) => void;
  setStateFilter: (v: string) => void;
  setCityFilter: (v: string) => void;
  setSegmentFilter: (v: string) => void;
  setRevenueFilter: (v: RevenueFilter) => void;

  heatmapEnabled: boolean;
  setHeatmapEnabled: (v: boolean) => void;

  stateOptions: string[];
  cityOptions: string[];
  filteredStores: Store[];
  heatmapPoints: [number, number, number][];
  segmentCounts: Record<string, number>;

  clearFilters: () => void;

  markers: Marker[];
  setMarkers: (m: Marker[]) => void;
  addMarker: (m: Marker) => void;
  removeMarker: (index: number) => void;
  clearMarkers: () => void;
}

interface GlobalContext {
  storesData: {
    stores?: Store[];
    isLoading: boolean;
    isError: boolean;
  };
  storeMap: StoreMapState;
}

const GlobalContext = createContext<GlobalContext | null>(null);

const initialFilterState: FilterState = {
  search: "",
  state: "all",
  city: "all",
  segment: "all",
  revenue: "all",
};

const filterReducer = (
  state: FilterState,
  action: FilterAction
): FilterState => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_STATE":
      return { ...state, state: action.payload, city: "all" };
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_SEGMENT":
      return { ...state, segment: action.payload };
    case "SET_REVENUE":
      return { ...state, revenue: action.payload };
    case "CLEAR_FILTERS":
      return initialFilterState;
    default:
      return state;
  }
};

const RFM_SEGMENTS = {
  CHAMPION: SEGMENT_ENUM.CHAMPION,
  PROMISING: SEGMENT_ENUM.PROMISING,
  ATTENTION: SEGMENT_ENUM.NEEDS_ATTENTION,
} as const;

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: stores = [], isLoading, isError } = useGetStoresQuery();
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);
  const [heatmapEnabled, setHeatmapEnabled] = useState(true);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const addMarker = useCallback((marker: Marker) => {
    setMarkers((prev) => [...prev, marker]);
  }, []);

  const removeMarker = useCallback((index: number) => {
    setMarkers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearMarkers = useCallback(() => setMarkers([]), []);

  const stateOptions = useMemo(
    () => Array.from(new Set(stores.map((s) => s.state))).sort(),
    [stores]
  );

  const cityOptions = useMemo(() => {
    if (filters.state === "all") {
      return Array.from(new Set(stores.map((s) => s.city))).sort();
    }
    return Array.from(
      new Set(
        stores.filter((s) => s.state === filters.state).map((s) => s.city)
      )
    ).sort();
  }, [stores, filters.state]);

  const filteredStores = useMemo(() => {
    const searchLower = filters.search.trim().toLowerCase();

    return stores.filter((store) => {
      if (searchLower) {
        const searchMatch =
          store.name.toLowerCase().includes(searchLower) ||
          store.city.toLowerCase().includes(searchLower) ||
          store.state.toLowerCase().includes(searchLower);
        if (!searchMatch) return false;
      }

      if (filters.state !== "all" && store.state !== filters.state)
        return false;
      if (filters.city !== "all" && store.city !== filters.city) return false;
      if (filters.segment !== "all" && store.rfm_segment == filters.segment)
        return false;
      if (!matchesRevenueFilter(store, filters.revenue)) return false;

      return true;
    });
  }, [stores, filters]);

  const heatmapPoints = useMemo(
    () =>
      filteredStores.map(
        (s) =>
          [s.latitude, s.longitude, s.rfm_score] as [number, number, number]
      ),
    [filteredStores]
  );

  const segmentCounts = useMemo(() => {
    const counts: Record<string, number> = {
      champion: 0,
      promising: 0,
      attention: 0,
    };

    for (const store of filteredStores) {
      switch (store.rfm_segment) {
        case RFM_SEGMENTS.CHAMPION:
          counts.champion++;
          break;
        case RFM_SEGMENTS.PROMISING:
          counts.promising++;
          break;
        case RFM_SEGMENTS.ATTENTION:
          counts.attention++;
          break;
      }
    }

    return counts;
  }, [filteredStores]);

  const setSearch = useCallback(
    (v: string) => dispatch({ type: "SET_SEARCH", payload: v }),
    []
  );
  const setStateFilter = useCallback(
    (v: string) => dispatch({ type: "SET_STATE", payload: v }),
    []
  );
  const setCityFilter = useCallback(
    (v: string) => dispatch({ type: "SET_CITY", payload: v }),
    []
  );
  const setSegmentFilter = useCallback(
    (v: string) => dispatch({ type: "SET_SEGMENT", payload: v }),
    []
  );
  const setRevenueFilter = useCallback(
    (v: RevenueFilter) => dispatch({ type: "SET_REVENUE", payload: v }),
    []
  );
  const clearFilters = useCallback(
    () => dispatch({ type: "CLEAR_FILTERS" }),
    []
  );

  const storeMap: StoreMapState = {
    filters,
    setSearch,
    setStateFilter,
    setCityFilter,
    setSegmentFilter,
    setRevenueFilter,
    heatmapEnabled,
    setHeatmapEnabled,
    stateOptions,
    cityOptions,
    filteredStores,
    heatmapPoints,
    segmentCounts,
    clearFilters,
    markers,
    setMarkers,
    addMarker,
    removeMarker,
    clearMarkers,
  };

  return (
    <GlobalContext.Provider
      value={{
        storesData: { stores, isLoading, isError },
        storeMap,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used within GlobalProvider");
  return ctx;
};
