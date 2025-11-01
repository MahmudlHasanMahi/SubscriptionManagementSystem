import { useEffect, useRef } from "react";
import Panel from "../Panel/Panel";
import NumericTextBox from "../Card/NumericTextBox";
import TextFields from "../Forms/TextFields/TextFields";
import Select from "../Staff/Filter/Select";
import SelectOption from "../Staff/Filter/SelectOption";
import Button from "../Forms/Buttons/Button";
import { useTranslation } from "react-i18next";
import { Number } from "../../Utils/NumericUtils";
const ProductsPanel = ({
  filter,
  setfilter,
  setinput,
  fields,
  numeric = 0,
}) => {
  const { t, i18n } = useTranslation();
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
      <NumericTextBox
        title1={Number(numeric, false, true)}
        title2={t("Total Products")}
      />
      <TextFields
        type={"text"}
        ref={inputRef}
        placeholder={
          filter.selected == null
            ? t("Filter Field")
            : `Filter ${Object.keys(fields)[filter.selected]}...`
        }
        label={t("Quick search a product")}
        style={{ margin: 0, width: "20em" }}
        setinput={setinput}
        disabled={filter.selected == null}
      />
      <div style={{ width: "15em" }}>
        <Select
          background_color={"rgba(51, 82, 99, 1)"}
          placeholder={t("Filter Field")}
          title={t("Filter By")}
          property={filter}
          setProperty={setfilter}
        >
          {Object.keys(fields).map((data, idx) => (
            <SelectOption key={idx} title={fields[data]} />
          ))}
        </Select>
      </div>
      <Button
        link={"/subscription/create-product"}
        style={{ width: "20%" }}
        title={t("Create Product")}
      />
    </Panel>
  );
};

export default ProductsPanel;
