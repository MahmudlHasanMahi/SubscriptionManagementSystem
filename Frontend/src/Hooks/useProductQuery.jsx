import { useInfiniteQuery } from "@tanstack/react-query";
import { products } from "../Utils/Subscription";
import { API_ROOT } from "../Utils/enviroment";
const useProductQuery = () => {
  const productObject = useInfiniteQuery({
    queryKey: ["/products"],
    queryFn: products,
    initialPageParam: `${API_ROOT}/products`,
    getNextPageParam: (props) => {
      // return props.next;
    },
    staleTime: 5 * 1000,
  });

  return productObject;
};

export default useProductQuery;
