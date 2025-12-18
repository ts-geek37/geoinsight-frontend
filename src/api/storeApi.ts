import type { ApiResponse, StoreDetailsDTO, StoreMapResponseDTO } from "@/types";
import { geoinsightApi } from "./geoinsightApi";

export const storeApi = geoinsightApi.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<StoreMapResponseDTO, void>({
      query: () => "/stores",
      transformResponse: (res: ApiResponse<StoreMapResponseDTO>) => res.data,
    }),
    getStoreDetails: builder.query<StoreDetailsDTO, string>({
      query: (storeId) => `/stores/${storeId}/details`,
      transformResponse: (response: ApiResponse<StoreDetailsDTO>) => response.data,
      providesTags: (_result, _err, storeId) => [{ type: "Store", id: storeId }],
    }),
  }),
});

export const { useGetStoresQuery, useGetStoreDetailsQuery, useLazyGetStoreDetailsQuery } = storeApi;
