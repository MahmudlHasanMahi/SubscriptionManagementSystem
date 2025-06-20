import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "../Features/UserAuth/UserAuth";
import navbarReducer from "../Features/Navbar";
import headerReducer from "../Features/headerState";
import staffSlice from "../Features/staff";
import { productsApi } from "../Features/Services/productApi";
import { periodApi } from "../Features/Services/periodApi";
import { priceListApi } from "../Features/Services/priceListApi";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    navbarState: navbarReducer,
    headerState: headerReducer,
    staffState: staffSlice,
    [productsApi.reducerPath]: productsApi.reducer,
    [periodApi.reducerPath]: periodApi.reducer,
    [priceListApi.reducerPath]: priceListApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productsApi.middleware)
      .concat(periodApi.middleware)
      .concat(priceListApi.middleware),
});

export default store;
