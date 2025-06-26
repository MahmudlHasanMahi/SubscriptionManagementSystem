import React, { useState } from "react";
import Panel from "../Panel/Panel";
import NumericTextBox from "../Card/NumericTextBox";
import Button from "../Forms/Buttons/Button";
import TextFields from "../Forms/TextFields/TextFields";
import Select from "../Staff/Filter/Select";
import SelectOption from "../Staff/Filter/SelectOption";
const SubscriptionPanel = () => {
  const [input, setinput] = useState();
  const [filter, setfilter] = useState();
  return (
    <Panel backgroud_color={"rgba(22, 115, 161, 0.4)"}>
      <NumericTextBox title1={250} title2={"Total Products"} />
      <TextFields
        type={"text"}
        label={"Quick search a product"}
        style={{ margin: 0, width: "20em" }}
        setinput={setinput}
      />
      <div style={{ width: "15em" }}>
        <Select
          background_color={"rgba(51, 82, 99, 1)"}
          placeholder={"Select type"}
          title={"Filter By"}
          property={filter}
          setProperty={setfilter}
        >
          {/* {Object.keys(fields).map((data, idx) => (
          ))} */}

          <SelectOption title={"ASDF"} />
          <SelectOption title={"ASDF"} />
          <SelectOption title={"ASDF"} />
        </Select>
      </div>
      <Button
        link={"/subscription/create-subscription"}
        style={{ width: "20%" }}
        title={"Create Product"}
      />
    </Panel>
  );
};

export default SubscriptionPanel;
