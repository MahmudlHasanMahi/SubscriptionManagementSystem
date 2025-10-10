import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getCookie from "../../Utils/extractCSRFToken";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": getCookie("csrftoken"),
};
import { API_ROOT } from "../../Utils/enviroment";
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_ROOT}` }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "products",
    }),
    createProduct: builder.mutation({
      query: (objects) => ({
        url: "product",
        headers,
        method: "POST",
        body: JSON.stringify(objects),
      }),
    }),
    getProduct: builder.query({
      query: (id) => `product/${id}`,
    }),
    patchProduct: builder.mutation({
      query: ({ id, patchData }) => ({
        url: `product/${id}`,
        headers,
        method: "PATCH",
        body: JSON.stringify(patchData),
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getProductList: builder.infiniteQuery({
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
        const filter = queryArg.filter?.data
          ? `&filterby=${queryArg.filter.filterBy}&data=${queryArg.filter.data}`
          : "";
        return `products?${paginationParams}${filter}`;
      },
    }),
  }),
});

export const {
  useGetProductListInfiniteQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetProductQuery,
  usePatchProductMutation,
} = productsApi;
