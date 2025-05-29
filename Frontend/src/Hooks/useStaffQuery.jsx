import { useInfiniteQuery } from "@tanstack/react-query";
import fetchStaff from "../Utils/GetStaff";
const useStaffQuery = ({ filterby, data }) => {
  const baseurl = `http://127.0.0.1:8000/user/staff-list`;
  const pagination = `?page=${btoa(null)}&page_size=${10}`;
  const filterParams = filterby ? `&filterby=${filterby}&data=${data}` : "";
  const url = baseurl + pagination + filterParams;
  const staffObject = useInfiniteQuery({
    queryKey: ["staff/fetchStaff", data],
    queryFn: fetchStaff,
    initialPageParam: url,
    getNextPageParam: (props) => {
      return props.next;
    },
    staleTime: 20 * 1000,
  });
  return staffObject;
};
export default useStaffQuery;
