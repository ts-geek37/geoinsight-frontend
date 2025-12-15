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
