import { priceList } from "../Utils/Subscription";
import { useInfiniteQuery } from "@tanstack/react-query";
import { API_ROOT } from "../Utils/enviroment";
const usePriceListQuery = () => {
  const baseurl = `${API_ROOT}/price-lists`;
  const pagination = `?page=${btoa(null)}&page_size=${7}`;
  const url = baseurl + pagination;
  const priceListObject = useInfiniteQuery({
    queryKey: ["/price-list"],
    queryFn: priceList,
    initialPageParam: url,
    getNextPageParam: (props) => {
      return props.next;
    },
    staleTime: 20 * 1000,
  });

  return priceListObject;
};

export default usePriceListQuery;
