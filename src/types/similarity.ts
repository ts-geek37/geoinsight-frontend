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
