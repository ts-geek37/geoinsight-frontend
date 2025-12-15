import { configureStore } from "@reduxjs/toolkit";

import { geoinsightApi } from "@/api";

export const store = configureStore({
  reducer: {
    [geoinsightApi.reducerPath]: geoinsightApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(geoinsightApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
