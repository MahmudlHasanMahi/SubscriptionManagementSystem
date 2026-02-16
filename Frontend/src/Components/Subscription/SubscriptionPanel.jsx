import React, { useState } from "react";
import Panel from "../Panel/Panel";
import NumericTextBox from "../Card/NumericTextBox";
import Button from "../Forms/Buttons/Button";
import TextFields from "../Forms/TextFields/TextFields";
import Select from "../Staff/Filter/Select";
import SelectOption from "../Staff/Filter/SelectOption";
import { Number } from "../../Utils/NumericUtils";
import { useTranslation } from "react-i18next";
const SubscriptionPanel = ({ numeric = 0 }) => {
  const { t } = useTranslation();
  const [input, setinput] = useState();
  const [filter, setfilter] = useState();
  return (
    <Panel style={{ backgroundColor: "rgba(22, 115, 161, 0.4)" }}>
      <NumericTextBox
        title1={Number(numeric, false, true)}
        title2={"Total Products"}
      />
      <TextFields
        type={"text"}
        label={t("Quick search a product")}
        style={{ margin: 0, width: "20em" }}
        setinput={setinput}
      />
      <div style={{ width: "15em" }}>
        <Select
          background_color={"rgba(51, 82, 99, 1)"}
          placeholder={t("Select type")}
          title={t("Filter Field")}
          property={filter}
          setProperty={setfilter}
        >
          <SelectOption title={"ASDF"} />
          <SelectOption title={"ASDF"} />
          <SelectOption title={"ASDF"} />
        </Select>
      </div>
      <Button
        link={"/subscription/create-subscription"}
        style={{ width: "20%" }}
        title={"Create Subscription"}
      />
    </Panel>
  );
};

export default SubscriptionPanel;
