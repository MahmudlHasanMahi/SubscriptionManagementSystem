import { useEffect, useRef } from "react";
import Panel from "../Panel/Panel";
import NumericTextBox from "../Card/NumericTextBox";
import TextFields from "../Forms/TextFields/TextFields";
import Select from "../Staff/Filter/Select";
import SelectOption from "../Staff/Filter/SelectOption";
import Button from "../Forms/Buttons/Button";
const ProductsPanel = ({
  filter,
  setfilter,
  setinput,
  fields,
  numeric = 0,
}) => {
  const inputRef = useRef();
  useEffect(() => {
    if (filter.selected == null) {
      setinput(null);
      inputRef.current.value = "";
    }
  }, [filter]);
  return (
    <Panel
      style={{ backgroundColor: "rgba(22, 115, 161, 0.4)" }}
      backgroud_color={"rgba(22, 115, 161, 0.4)"}
    >
      <NumericTextBox title1={numeric} title2={"Total Products"} />
      <TextFields
        type={"text"}
        ref={inputRef}
        placeholder={
          filter.selected == null
            ? "Please select filter"
            : `Filter ${Object.keys(fields)[filter.selected]}...`
        }
        label={"Quick search a product"}
        style={{ margin: 0, width: "20em" }}
        setinput={setinput}
        disabled={filter.selected == null}
      />
      <div style={{ width: "15em" }}>
        <Select
          background_color={"rgba(51, 82, 99, 1)"}
          placeholder={"Select type"}
          title={"Filter By"}
          property={filter}
          setProperty={setfilter}
        >
          {Object.keys(fields).map((data, idx) => (
            <SelectOption key={idx} title={data} />
          ))}
        </Select>
      </div>
      <Button
        link={"/subscription/create-product"}
        style={{ width: "20%" }}
        title={"Create Product"}
      />
    </Panel>
  );
};

export default ProductsPanel;
