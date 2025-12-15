import type { ApiResponse, SimilarStoreResult } from "@/types";
import { geoinsightApi } from "./geoinsightApi";

export const similarityApi = geoinsightApi.injectEndpoints({
  endpoints: (builder) => ({
    getSimilarityForStore: builder.query<SimilarStoreResult, string>({
      query: (storeId) => `/similarity/store/${storeId}`,
      transformResponse: (response: ApiResponse<SimilarStoreResult>) =>
        response.data,
      providesTags: (_result, _err, storeId) => [
        { type: "Similarity", id: storeId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetSimilarityForStoreQuery,
  useLazyGetSimilarityForStoreQuery,
} = similarityApi;
