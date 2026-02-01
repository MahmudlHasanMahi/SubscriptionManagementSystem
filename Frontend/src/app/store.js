import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "../Features/UserAuth/UserAuth";
import headerReducer from "../Features/headerState";
import staffSlice from "../Features/staff";
import { productsApi } from "../Features/Services/productApi";
import { periodApi } from "../Features/Services/periodApi";
import { priceListApi } from "../Features/Services/priceListApi";
import { subscriptionApi } from "../Features/Services/subscriptionApi";
import { clientApi } from "../Features/Services/clientApi";
import { staffApi } from "../Features/Services/staffApi";
import { currenciesApi } from "../Features/Services/currencyApi";
import { InvoiceApi } from "../Features/Services/InvoiceApi";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    headerState: headerReducer,
    staffState: staffSlice,
    [productsApi.reducerPath]: productsApi.reducer,
    [periodApi.reducerPath]: periodApi.reducer,
    [priceListApi.reducerPath]: priceListApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [currenciesApi.reducerPath]: currenciesApi.reducer,
    [InvoiceApi.reducerPath]: InvoiceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productsApi.middleware)
      .concat(periodApi.middleware)
      .concat(priceListApi.middleware)
      .concat(subscriptionApi.middleware)
      .concat(clientApi.middleware)
      .concat(staffApi.middleware)
      .concat(currenciesApi.middleware)
      .concat(InvoiceApi.middleware),
});

export default store;
