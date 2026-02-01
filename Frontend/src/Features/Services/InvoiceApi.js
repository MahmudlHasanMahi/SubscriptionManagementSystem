import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getHeader } from "../../Utils/headers";
import { API_ROOT } from "../../Utils/enviroment";

const headers = getHeader(true);
export const InvoiceApi = createApi({
  reducerPath: "invoices",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_ROOT}`, headers }),
  endpoints: (builder) => ({
    getInvoice: builder.query({
      query: (id) => `invoice/${id}`,
      providesTags: (result, error, id) => [{ type: "invoice", id }],
    }),
    getInvoices: builder.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: "",
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
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

        const params = `invoices?${paginationParams}${filter}`;
        return params;
      },
      providesTags: (result) => {
        const res = result.pages.flatMap(({ results }) =>
          results.map(({ id }) => ({ type: "invoice", id })),
        );

        return res;
      },
    }),
    createInovice: builder.mutation({
      query: (objects) => ({
        url: "invoice",
        headers,
        method: "POST",
        body: JSON.stringify(objects),
      }),
      invalidatesTags: [{ type: "invoice" }],
    }),
    editInvoice: builder.mutation({
      query: (objects) => ({
        url: `invoice/${objects.id}`,
        headers,
        method: "PATCH",
        body: JSON.stringify(objects),
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Posts", id }],
    }),
    payInvoice: builder.mutation({
      query: (id) => ({
        url: `invoice/${id}/pay`,
        headers,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "invoice", id }],
    }),
    finalizeInvoice: builder.mutation({
      query: (id) => ({
        url: `invoice/${id}/finalize`,
        headers,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => {
        if (!error) return [{ type: "invoice", id }];
        return [];
      },
    }),
  }),
});

export const {
  useGetInvoiceQuery,
  useGetInvoicesInfiniteQuery,
  useCreateInoviceMutation,
  useEditInvoiceMutation,
  useFinalizeInvoiceMutation,
  usePayInvoiceMutation,
} = InvoiceApi;
