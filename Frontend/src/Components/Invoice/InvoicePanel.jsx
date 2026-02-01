import React, { useEffect, useRef } from "react";
import Panel from "../Panel/Panel";
import NumericTextBox from "../Card/NumericTextBox";
import TextFields from "../Forms/TextFields/TextFields";
import Button from "../Forms/Buttons/Button";
const InvoicePanel = ({ filter, setfilter, setinput, fields }) => {
  const inputRef = useRef();

  return (
    <Panel style={{ backgroundColor: "rgb(32 47 63)" }}>
      <NumericTextBox title1={0} title2={"Total number of invoice"} />

      <TextFields
        type={"text"}
        ref={inputRef}
        // placeholder={
        //   filter.selected == null
        //     ? "Please select filter"
        //     : `Filter ${Object.keys(fields)[filter.selected]}...`
        // }
        label={"Quick search a invoice"}
        style={{ margin: 0, width: "20em" }}
        // setinput={setinput}
        // disabled={filter.selected == null}
      />
      <div style={{ width: "15em" }}>
        {/* <Select
          placeholder={"Select type"}
          title={"Filter By"}
          property={filter}
          setProperty={setfilter}
          background_color="rgba(67, 82, 106, 1)"
        >
          {Object.keys(fields).map((data, idx) => (
            <SelectOption key={idx} title={fields[data]} />
          ))}
        </Select> */}
      </div>
      <Button
        link={"create-invoice"}
        style={{ width: "20%" }}
        title={"Create Invoice"}
      />
    </Panel>
  );
};

export default InvoicePanel;
