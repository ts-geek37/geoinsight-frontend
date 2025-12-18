import { AreaProfile } from "./areaProfile";
import { Store } from "./store";

export interface SimilarAreaResult {
  area: AreaProfile;
  similarityScore: number;
  priorityScore: number;
}

export interface SimilarStoreResult {
  store: Store;
  baseArea: AreaProfile;
  similarAreas: SimilarAreaResult[];
}

export type StoreSummary = {
  id: string;
  name: string;
  city: string;
  state: string;
  rfm_score: number;
  revenue_latest_year: number;
  rank_score: number;
};

export type StoreAreaSummaryItem = {
  store: StoreSummary;
  baseArea: AreaProfile;
  areas: SimilarAreaResult[];
};

export type StoreAreaSummaryResponse = {
  generated_at: string;
  results: StoreAreaSummaryItem[];
};

export interface SimilarityResponseDTO {
  store: {
    id: string;
    name: string;
  };
  baseArea: {
    id: number;
    name: string;
  };
  candidates: {
    area: {
      id: number;
      name: string;
      city: string;
      latitude: number;
      longitude: number;
    };
    similarityScore: number;
    metrics: {
      label: string;
      store: string;
      candidate: string;
    }[];
  }[];
}

export interface AreaMarkerDTO {
  id: number;
  name: string;
  city: string;
  state?: string;
  latitude: number;
  longitude: number;
  similarityScore: number;
  population3km?: string;
}
