import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getCookie from "../../Utils/extractCSRFToken";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": getCookie("csrftoken"),
};

export const priceListApi = createApi({
  reducerPath: "priceListApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000" }),
  endpoints: (builder) => ({
    getPriceList: builder.query({
      query: () => "price-lists",
    }),
    createPriceList: builder.mutation({
      query: (objects) => ({
        url: "price-list/",
        headers,
        method: "POST",
        body: JSON.stringify(objects),
      }),
    }),
  }),
});

export const { useGetPriceListQuery, useCreatePriceList } = priceListApi;
