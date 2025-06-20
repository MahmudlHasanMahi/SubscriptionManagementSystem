import { useInfiniteQuery } from "@tanstack/react-query";
import { products } from "../Utils/Subscription";
const useProductQuery = () => {
  const productObject = useInfiniteQuery({
    queryKey: ["/products"],
    queryFn: products,
    initialPageParam: "http://127.0.0.1:8000/products",
    getNextPageParam: (props) => {
      return props.next;
    },
    staleTime: 5 * 1000,
  });

  return productObject;
};

export default useProductQuery;
