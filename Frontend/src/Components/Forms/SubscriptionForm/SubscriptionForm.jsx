import React, { useState } from "react";
import FormContainer from "../FormContainer/FormContainer";
import CSRFProtect from "../../../Utils/CSRFProtect";
import Body from "../../Body/Body";
import TextFields from "../TextFields/TextFields";
import Select from "../../Staff/Filter/Select";
import SelectOption from "../../Staff/Filter/SelectOption";
import DateField from "../Date/DateField";
import SelectTable from "../SelectTable/SelectTable";
const SubscriptionForm = () => {
  const [client, setClient] = useState();
  const onSubmit = (e) => {
    e.preventDefault();
  };
  const plans = [
    { title: "Email Services", quantity: 9, cost: "SAR100 / year" },
    { title: "Netflix", quantity: 9, cost: "SAR50 / year" },
    { title: "Cloud Hosting", quantity: 10, cost: "SAR50 / year" },
  ];
  return (
    <Body>
      <form onSubmit={onSubmit}>
        <FormContainer title={"Create Subscription"}>
          <CSRFProtect />
          <Select
            background_color={"rgb(66, 89, 125)"}
            placeholder={"Select Client"}
            title={"Client"}
            property={client}
            setProperty={setClient}
          >
            <SelectOption title={"ASDF"} />
            <SelectOption title={"ASDF"} />
            <SelectOption title={"ASDF"} />
          </Select>
          <DateField />
          <SelectTable title={"Plans"} objects={plans} />
        </FormContainer>
      </form>
    </Body>
  );
};

export default SubscriptionForm;
