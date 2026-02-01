import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import Table from "../Table/Table";
import Period from "./Period";
import ProductsPanel from "./ProductsPanel";
import ActionButton from "../Table/ActionButton";
import { useGetProductListInfiniteQuery } from "../../Features/Services/productApi";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../Features/headerState";
import Sub1 from "../../svg/sub1";
import { useTranslation } from "react-i18next";
import { Number } from "../../Utils/NumericUtils";
const Products = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [input, setInput] = useState(null);
  const [filter, setFilter] = useState({
    selected: null,
  });

  const filter_fields = ["name", "description"];

  const products = useGetProductListInfiniteQuery({
    size: 5,
    filter: {
      filterBy: filter_fields[filter?.selected],
      data: input,
    },
  });

  const tableConfig = {
    name: ["fields.name", "name"],
  };
  const fields2 = Object.fromEntries(
    filter_fields.map((key) => [
      key,
      products.data?.pages?.[0][0]?.fields[key],
    ]),
  );
  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: t(`Product`),
        title2: t("View, search for and add new product"),
        logo: <Sub1 />,
      }),
    );
  }, [i18n.language]);

  return (
    <>
      <ProductsPanel
        filter={filter}
        setfilter={setFilter}
        setinput={setInput}
        fields={fields2}
        numberic={Number(products.data?.pages[0].length, false, true)}
      />

      <Table
        color={"rgba(24, 55, 73, 1)"}
        title={t("Products")}
        endpont={{}}
        fields={tableConfig}
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
