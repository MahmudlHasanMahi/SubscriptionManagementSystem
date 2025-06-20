import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getCookie from "../../Utils/extractCSRFToken";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": getCookie("csrftoken"),
};

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000" }),
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
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useGetProductQuery,
  usePatchProductMutation,
} = productsApi;
