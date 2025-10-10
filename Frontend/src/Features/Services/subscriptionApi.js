import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getCookie from "../../Utils/extractCSRFToken";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": getCookie("csrftoken"),
};
import { API_ROOT } from "../../Utils/enviroment";
export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_ROOT}` }),
  endpoints: (builder) => ({
    getSubscriptions: builder.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: "",
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

        const params = `subscriptions?${paginationParams}${filter}`;
        return params;
      },
      providesTags: (result) => {
        const res = result.pages.flatMap(({ results }) =>
          results.map(({ id }) => ({ type: "subscription", id }))
        );
        return res;
      },
    }),

    getSubscription: builder.query({
      query: (id) => `subscription/${id}`,
      providesTags: (result, error, id) => [{ type: "subscription", id }],
    }),
    createSubscription: builder.mutation({
      query: (objects) => ({
        url: "subscription",
        headers,
        method: "POST",
        body: JSON.stringify(objects),
      }),
    }),
    editSubscription: builder.mutation({
      query: (objects) => ({
        url: `subscription/${objects.id}`,
        headers,
        method: "PATCH",
        body: JSON.stringify(objects),
      }),
      invalidatesTags: (result, error, { id }) => {
        if (!error) return [{ type: "subscription", id }];
        // return [];
      },
    }),
    getSubscriptionApprovals: builder.query({
      query: () => "subscription/unapproved",
      providesTags: (result) => {
        const val = [...result.map(({ id }) => ({ type: "subscription", id }))];
        console.log(val);
        return val;
      },
    }),
    approveSubscription: builder.mutation({
      query: (id) => ({
        url: `subscription/${id}/approve`,
        headers,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => {
        if (!error) return [{ type: "subscription", id }];

        return [];
      },
    }),
    rejectSubscription: builder.mutation({
      query: (id) => ({
        url: `subscription/${id}/reject`,
        headers,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => {
        if (!error) return [{ type: "subscription", id }];
        return [];
      },
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useGetSubscriptionsInfiniteQuery,
  useCreateSubscriptionMutation,
  useGetSubscriptionApprovalsQuery,
  useApproveSubscriptionMutation,
  useRejectSubscriptionMutation,
  useEditSubscriptionMutation,
} = subscriptionApi;
