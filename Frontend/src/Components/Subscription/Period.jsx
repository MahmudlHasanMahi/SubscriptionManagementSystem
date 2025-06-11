import React from "react";
import styles from "./Subscription.module.css";
import usePeriodQuery from "../../Hooks/usePeriodQuery";
import Table from "../Table/Table";
const Period = () => {
  const periodObject = usePeriodQuery();
  const fieldnames = ["name", "days"];
  const fields = {
    name: "name",
    days: "days",
  };
  return (
    <Table
      title={"Periods"}
      fields={fields}
      action={{ title: "View more", pk: "id" }}
      queryObject={periodObject}
    />
  );
};

export default Period;
