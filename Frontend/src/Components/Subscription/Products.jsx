import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import Table from "../Table/Table";
import Period from "./Period";
import PriceList from "./PriceList";
import ProductsPanel from "./ProductsPanel";
import ActionButton from "../Table/ActionButton";
import { useGetProductListInfiniteQuery } from "../../Features/Services/productApi";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../Features/headerState";
import Sub1 from "../../svg/sub1";
import zeropad from "../../Utils/zeropad";
const Products = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState(null);
  const [filter, setFilter] = useState({
    selected: null,
  });
  const fields = {
    name: "name",
    price: "default_price.title",
  };
  const filterField = {
    name: "name",
  };
  const products = useGetProductListInfiniteQuery({
    size: 0,
    filter: {
      filterBy: Object.values(filterField)[filter.selected],
      data: input,
    },
  });

  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Product`,
        title2: "View, search for and add new product",
        logo: <Sub1 />,
      })
    );
  }, []);

  console.log(products);
  return (
    <>
      <ProductsPanel
        filter={filter}
        setfilter={setFilter}
        setinput={setInput}
        fields={filterField}
        numberic={zeropad(products.data?.pages[0].length)}
      />

      <Table
        color={"rgba(24, 55, 73, 1)"}
        title={"Products"}
        endpont={{}}
        fields={fields}
        height={"45vh"}
        actionButtons={[
          <ActionButton
            url={"/subscription/edit-product"}
            title={"View more"}
          />,
        ]}
        queryObject={products}
      />
      <br />
      <br />
      <div>
        {/* <Period />
        <PriceList /> */}
      </div>
    </>
  );
};

export default Products;
