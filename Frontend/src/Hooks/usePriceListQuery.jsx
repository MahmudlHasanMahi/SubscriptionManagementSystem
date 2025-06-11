import { priceList } from "../Utils/Subscription";
import { useInfiniteQuery } from "@tanstack/react-query";

const usePriceListQuery = () => {
  const priceListObject = useInfiniteQuery({
    queryKey: ["/price-list"],
    queryFn: priceList,
    initialPageParam: "http://127.0.0.1:8000/price-list",
    getNextPageParam: (props) => {
      return props.next;
    },
    staleTime: 20 * 1000,
  });

  return priceListObject;
};

export default usePriceListQuery;
