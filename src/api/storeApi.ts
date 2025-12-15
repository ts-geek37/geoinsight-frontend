import type { ApiListResponse, ApiResponse, Store, StoreSales } from "@/types";
import { geoinsightApi } from "./geoinsightApi";

export const storeApi = geoinsightApi.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<Store[], void>({
      query: () => "/stores",
      transformResponse: (response: ApiListResponse<Store>) => response.data,
      providesTags: ["Store"],
    }),

    getStore: builder.query<StoreSales, string>({
      query: (storeId) => `/stores/${storeId}`,
      transformResponse: (response: ApiResponse<StoreSales>) => response.data,
      providesTags: (_result, _err, storeId) => [{ type: "Store", id: storeId }],
    }),
  }),
});

export const { useGetStoresQuery, useGetStoreQuery, useLazyGetStoreQuery } = storeApi;
