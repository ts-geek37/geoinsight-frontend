import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const geoinsightApi = createApi({
  reducerPath: "geoinsightApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  }),

  tagTypes: ["Store", "Similarity"],

  endpoints: () => ({}),
});

export default geoinsightApi;
