import React from "react";
import usePriceListQuery from "../../Hooks/usePriceListQuery";
import Table from "../Table/Table";

const PriceList = () => {
  const priceListObject = usePriceListQuery();
  const fields = {
    price: "price",
    period: "period",
  };
  return (
    <Table
      title={"Prices List"}
      fields={fields}
      action={{ title: "View more", pk: "id" }}
      queryObject={priceListObject}
    />
  );
};

export default PriceList;
