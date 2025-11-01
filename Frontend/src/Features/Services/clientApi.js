import { API_ROOT } from "../../Utils/enviroment";
import { getHeader } from "../../Utils/headers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_ROOT}/subscription`,
  }),
  endpoints: (builder) => ({
    getClientList: builder.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: "clients",

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
        const page_size = queryArg.page_size;

        const paginationParams = `${page_size ? `page_size=${page_size}` : ""}${
          pageParam ? `&${pageParam}` : ""
        }`;

        const filter = queryArg.filter?.data
          ? `&filterby=${queryArg.filter.filterBy}&data=${queryArg.filter.data}`
          : "";

        const params = `clients?${paginationParams}${filter}&type=${"client"}`;
        return params;
      },
    }),
    createClient: builder.mutation({
      query: (objects) => ({
        url: "client",
        ...getHeader(true),
        method: "POST",
        body: JSON.stringify(objects),
      }),
    }),
  }),
});

export const { useGetClientListInfiniteQuery, useCreateClientMutation } =
  clientApi;
