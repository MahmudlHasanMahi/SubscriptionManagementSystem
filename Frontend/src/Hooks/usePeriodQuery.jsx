import { useInfiniteQuery } from "@tanstack/react-query";
import { periods } from "../Utils/Subscription";
import { API_ROOT } from "../Utils/enviroment";
const usePeriodQuery = () => {
  const periodObject = useInfiniteQuery({
    queryKey: ["/period"],
    queryFn: periods,
    initialPageParam: `${API_ROOT}/periods`,
    getNextPageParam: (props) => {
      return props.next;
    },
    staleTime: 20 * 1000,
  });
  return periodObject;
};

export default usePeriodQuery;
