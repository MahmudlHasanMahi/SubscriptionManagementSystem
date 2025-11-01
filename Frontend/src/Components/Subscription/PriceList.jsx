import React from "react";
import Table from "../Table/Table";

const PriceList = () => {
  const fields = {
    price: "price",
    period: "period",
  };
  return (
    <Table
      title={"Prices List"}
      fields={fields}
      action={{ title: "View more", pk: "id" }}
      queryObject={{}}
    />
  );
};

export default PriceList;
