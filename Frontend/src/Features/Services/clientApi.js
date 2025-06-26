import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getCookie from "../../Utils/extractCSRFToken";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000" }),
  endpoints: (builder) => ({
    getClients: builder.query({
      query: () => "clients",
    }),
    createClient: builder.mutation({
      query: (objects) => ({
        url: "client/",
        headers,
        method: "POST",
        body: JSON.stringify(objects),
      }),
    }),
  }),
});

export const { useGetClientsQuery, useCreateClientMutation } = clientApi;
