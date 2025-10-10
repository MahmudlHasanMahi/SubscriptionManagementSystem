import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getCookie from "../../Utils/extractCSRFToken";
import { buildCreateSlice } from "@reduxjs/toolkit";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": getCookie("csrftoken"),
};
import { API_ROOT } from "../../Utils/enviroment";
export const priceListApi = createApi({
  reducerPath: "priceListApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_ROOT}` }),
  tagTypes: ["pricelist"],
  endpoints: (builder) => ({
    getPriceList: builder.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: "page_size=2",

        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams
        ) => {
          return lastPage?.next;
        },
      },
      query({ queryArg, pageParam }) {
        const paginationParams = `${pageParam}&page_size=${queryArg.size}`;
        const filter = queryArg.filter
          ? `&filter=${queryArg.filter.replace(/\s*\/\s*/g, "/").trim()}`
          : "";
        return `price-lists?${paginationParams}${filter}`;
      },
      providesTags: (result) => {
        const data = result
          ? [
              ...result.pages[0].map(({ id }) => ({ type: "pricelist", id })),
              "pricelist",
            ]
          : ["pricelist"];
        return data;
      },
    }),

    createPriceList: builder.mutation({
      query: (objects) => ({
        url: "price-lists",
        headers,
        method: "POST",
        body: JSON.stringify(objects),
      }),
      invalidatesTags: ["pricelist"],
    }),
  }),
});

export const { useGetPriceListInfiniteQuery, useCreatePriceListMutation } =
  priceListApi;
