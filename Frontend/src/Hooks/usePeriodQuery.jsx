import { useInfiniteQuery } from "@tanstack/react-query";
import { periods } from "../Utils/Subscription";

const usePeriodQuery = () => {
  const periodObject = useInfiniteQuery({
    queryKey: ["/period"],
    queryFn: periods,
    initialPageParam: "http://127.0.0.1:8000/periods",
    getNextPageParam: (props) => {
      return props.next;
    },
    staleTime: 20 * 1000,
  });
  return periodObject;
};

export default usePeriodQuery;
