import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import useProductQuery from "../../Hooks/useProductQuery";
import Table from "../Table/Table";
import Period from "./Period";
import PriceList from "./PriceList";
import ProductsPanel from "./ProductsPanel";
import ActionButton from "../Table/ActionButton";

const Products = () => {
  const productObject = useProductQuery();
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState({
    selected: null,
  });
  const fields = {
    name: "name",
    price: "default_price.title",
    date: "created_at",
  };

  return (
    <div className={styles["product"]}>
      <ProductsPanel
        filter={filter}
        setfilter={setFilter}
        setinput={setInput}
        fields={fields}
      />

      <Table
        title={"Products"}
        endpont={{}}
        fields={fields}
        height={"55vh"}
        actionButton={
          <ActionButton
            url={"/subscription/edit-product"}
            title={"View more"}
          />
        }
        queryObject={productObject}
      />
      <div>
        <Period />
        <PriceList />
      </div>
    </div>
  );
};

export default Products;
