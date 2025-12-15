import type { ApiResponse, SimilarStoreResult, StoreAreaSummaryResponse } from "@/types";
import { geoinsightApi } from "./geoinsightApi";

export const similarityApi = geoinsightApi.injectEndpoints({
  endpoints: (builder) => ({
    getSimilarityForStore: builder.query<SimilarStoreResult, string>({
      query: (storeId) => `/similarity/store/${storeId}`,
      transformResponse: (response: ApiResponse<SimilarStoreResult>) => response.data,
      providesTags: (_result, _err, storeId) => [{ type: "Similarity", id: storeId }],
    }),

    getStoreAreaSummary: builder.query<StoreAreaSummaryResponse, void>({
      query: () => `/similarity/summary`,
      transformResponse: (response: ApiResponse<StoreAreaSummaryResponse>) => response.data,
      providesTags: ["Summary"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetSimilarityForStoreQuery,
  useLazyGetSimilarityForStoreQuery,
  useGetStoreAreaSummaryQuery,
  useLazyGetStoreAreaSummaryQuery,
} = similarityApi;
