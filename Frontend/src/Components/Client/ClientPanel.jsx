import React from "react";

import { useEffect, useRef, useState } from "react";
import NumericTextBox from "../Card/NumericTextBox";
import TextFields from "../Forms/TextFields/TextFields";
import Button from "../Forms/Buttons/Button";
import Select from "../Staff/Filter/Select";
import SelectOption from "../Staff/Filter/SelectOption";
import { useSelector } from "react-redux";
import { staffState } from "../../Features/staff";
import Panel from "../Panel/Panel";
import { user } from "../../Features/UserAuth/UserAuth";
const ClientPanel = ({ filter, setfilter, setinput, fields }) => {
  const inputRef = useRef();
  const staff = useSelector(staffState);
  const { groups } = useSelector(user);
  useEffect(() => {
    inputRef.current.focus();
  }, [filter]);
  return (
    <Panel style={{ backgroundColor: "rgba(42, 51, 77, 1)" }}>
      <NumericTextBox
        title1={staff.staffState?.count}
        title2={"Total number of client"}
      />

      <TextFields
        type={"text"}
        ref={inputRef}
        placeholder={
          filter.selected == null
            ? "Please select filter"
            : `Filter ${Object.keys(fields)[filter.selected]}...`
        }
        label={"Quick search a client"}
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
      {groups === "Manager" && (
        <Button
          link={"add-client"}  
          style={{ width: "20%" }}
          title={"Add New Client"}
        />
      )}
    </Panel>
  );
};

export default ClientPanel;
