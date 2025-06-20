import { useEffect, useRef, useState } from "react";
import styles from "./Staff.module.css";
import NumericTextBox from "../Card/NumericTextBox";
import TextFields from "../Forms/TextFields/TextFields";
import Button from "../Forms/Buttons/Button";
import Select from "./Filter/Select";
import SelectOption from "./Filter/SelectOption";
import { useSelector } from "react-redux";
import { staffState } from "../../Features/staff";
import Panel from "../Panel/Panel";
import Menu from "../MultiSelect/Menu";
const StaffPanel = ({ filter, setfilter, setinput, fields }) => {
  const inputRef = useRef();
  const staff = useSelector(staffState);
  useEffect(() => {
    inputRef.current.focus();
  }, [filter]);
  return (
    <Panel backgroud_color={"rgba(77, 109, 172, 0.4)"}>
      <NumericTextBox
        title1={staff.staffState?.count}
        title2={"Total number of staff"}
      />

      <TextFields
        type={"text"}
        ref={inputRef}
        placeholder={
          filter.selected == null
            ? "Please select filter"
            : `Filter ${Object.keys(fields)[filter.selected]}...`
        }
        label={"Quick search a staff"}
        style={{ margin: 0, width: "20em" }}
        setinput={setinput}
        disabled={filter.selected == null}
      />
      <div style={{ width: "15em" }}>
        <Select
          placeholder={"Select type"}
          title={"Filter By"}
          property={filter}
          setProperty={setfilter}
          background_color="rgba(67, 82, 106, 1)"
        >
          {Object.keys(fields).map((data, idx) => (
            <SelectOption key={idx} title={data} />
          ))}
        </Select>
      </div>
      <Button
        link={"add-staff"}
        style={{ width: "20%" }}
        title={"Add New Staff"}
      />
    </Panel>
  );
};

export default StaffPanel;
