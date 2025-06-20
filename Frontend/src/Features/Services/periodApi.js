import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getCookie from "../../Utils/extractCSRFToken";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": getCookie("csrftoken"),
};

export const periodApi = createApi({
  reducerPath: "periodApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000" }),
  endpoints: (builder) => ({
    getPeriods: builder.query({
      query: () => "periods",
    }),
    createPeriod: builder.mutation({
      query: (objects) => ({
        url: "products/",
        headers,
        method: "POST",
        body: JSON.stringify(objects),
      }),
    }),
  }),
});

export const { useGetPeriodsQuery, useCreatePeriodMutation } = periodApi;
