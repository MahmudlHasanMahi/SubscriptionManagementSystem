import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getCookie from "../../Utils/extractCSRFToken";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": getCookie("csrftoken"),
};
import { API_ROOT } from "../../Utils/enviroment";
export const periodApi = createApi({
  reducerPath: "periodApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_ROOT}` }),
  endpoints: (builder) => ({
    getPeriods: builder.query({
      query: () => "periods",
      providesTags: ["period"],
    }),
    createPeriod: builder.mutation({
      query: (objects) => ({
        url: "periods",
        headers,
        method: "POST",
        body: JSON.stringify(objects),
      }),
      invalidatesTags: ["period"],
    }),
  }),
});

export const { useGetPeriodsQuery, useCreatePeriodMutation } = periodApi;
