import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getCookie from "../../Utils/extractCSRFToken";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
import { API_ROOT } from "../../Utils/enviroment";
export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_ROOT}/user`,
  }),
  endpoints: (builder) => ({
    getStaffList: builder.infiniteQuery({
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

        const params = `staff-list?${paginationParams}${filter}&type=${queryArg.usertype}`;
        return params;
      },
    }),
    createStaff: builder.mutation({
      query: (objects) => ({
        url: "client",
        headers,
        method: "POST",
        body: JSON.stringify(objects),
      }),
    }),
    getStaffCount: builder.query({}),
  }),
});

export const {
  useGetStaffListInfiniteQuery,
  useGetStaffCountQuery,
  useCreateStaffMutation,
} = staffApi;
