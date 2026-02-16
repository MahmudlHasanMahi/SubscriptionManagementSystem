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
import { Number } from "../../Utils/NumericUtils";
import { useTranslation } from "react-i18next";
const StaffPanel = ({ filter, setfilter, setinput, fields }) => {
  const { t, i18n } = useTranslation();
  const inputRef = useRef();
  const staff = useSelector(staffState);

  useEffect(() => {
    inputRef.current.focus();
    if (filter.selected == null) {
      setinput(null);
      inputRef.current.value = "";
    }
  }, [filter]);
  return (
    <Panel style={{ backgroundColor: "rgba(77, 109, 172, 0.4)" }}>
      <NumericTextBox
        title1={Number(staff.staffState?.count, false, true)}
        title2={"Total number of staff"}
      />
      <TextFields
        type={"text"}
        ref={inputRef}
        placeholder={
          filter.selected == null
            ? t("Please select filter")
            : `Filter ${Object.keys(fields)[filter.selected]}...`
        }
        label={t("Search Staff")}
        style={{ margin: 0, width: "20em" }}
        setinput={setinput}
        disabled={filter.selected == null}
      />
      <div style={{ width: "15em" }}>
        <Select
          placeholder={"Filter Field"}
          title={"Filter By"}
          property={filter}
          setProperty={setfilter}
          background_color="rgba(67, 82, 106, 1)"
        >
          {Object.keys(fields).map((data, idx) => (
            <SelectOption key={idx} title={fields[data]} />
          ))}
        </Select>
      </div>
      <Button
        link={"add-staff"}
        style={{ width: "20%" }}
        title={t("Add New Staff")}
      />
    </Panel>
  );
};

export default StaffPanel;
