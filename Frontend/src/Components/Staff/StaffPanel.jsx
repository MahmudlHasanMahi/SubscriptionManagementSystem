import React, { useEffect } from "react";
import styles from "./Staff.module.css";
import NumericTextBox from "../Card/NumericTextBox";
import TextFields from "../Forms/TextFields/TextFields";
import Button from "../Forms/Buttons/Button";
import Select from "./Filter/Select";
import SelectOption from "./Filter/SelectOption";
import { useSelector } from "react-redux";
import { staffState } from "../../Features/staff";
const StaffPanel = () => {
  const staff = useSelector(staffState);
  return (
    <div className={styles["staffPanel"]}>
      <NumericTextBox
        title1={staff.staffState?.count}
        title2={"Total number of staff"}
      />
      <TextFields
        type={"text"}
        placeholder="Enter search word"
        label={"Quick search a staff"}
        style={{ margin: 0, width: "20em" }}
      />
      <div style={{ width: "15em" }}>
        <Select placeholder={"Select type"} title={"Filter By"}>
          <SelectOption title={"title-1"} />
          <SelectOption title={"title-2"} />
          <SelectOption title={"title-3"} />
          <SelectOption title={"title-4"} />
          <SelectOption title={"title-5"} />
        </Select>
      </div>
      <Button
        link={"add-staff"}
        style={{ width: "20%" }}
        title={"Add New Staff"}
      />
    </div>
  );
};

export default StaffPanel;
