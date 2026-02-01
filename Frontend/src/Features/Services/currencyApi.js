import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getHeader } from "../../Utils/headers";
import { API_ROOT } from "../../Utils/enviroment";

export const currenciesApi = createApi({
  reducerPath: "currencies",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_ROOT}` }),
  endpoints: (builder) => ({
    getCurrencies: builder.query({
      query: () => "currencies",
      providesTags: ["currencies"],
    }),
  }),
});

export const { useGetCurrenciesQuery } = currenciesApi;
