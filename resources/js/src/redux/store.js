import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { eCommerceApi } from "./services/eCommerceApi";

const store = configureStore({
  reducer: {
    [eCommerceApi.reducerPath]: eCommerceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(eCommerceApi.middleware),
});

setupListeners(store.dispatch);

export default store;
