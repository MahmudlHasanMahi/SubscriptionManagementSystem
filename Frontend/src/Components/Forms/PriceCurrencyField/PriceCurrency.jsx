import { useEffect, useState } from "react";
import styles from "../TextFields/TextFields.module.css";
import Label from "../TextFields/Label";
import SingleSelect from "../SelectTable/SingleSelect";

const PriceCurrency = ({
  currencies = [],
  onInvalid,
  onInput,
  selected,
  setSelected,
}) => {
  useEffect(() => {
    if (currencies[0]) setSelected(currencies[0]);
  }, [currencies]);

  const isSelected = (option) => {
    return option.id === selected.id;
  };
  const selectEvent = (option, e, row) => {
    if (isSelected(option)) return;
    setSelected(option);
  };
  const currentPlanSelected = (row) => {
    const obj = selected.code;

    return (
      <div
        style={{
          borderRadius: 0,
          padding: "1em 0",
          width: "11em",
          height: "100%",
          backgroundColor: "#15121291",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "0.8em",
          textWrap: "nowrap",
        }}
      >
        {obj ? obj : "Select Currency"}
      </div>
    );
  };

  const getTitle = (object) => {
    return `${object.native_name} (${object.code})`;
  };

  return (
    <div className={styles["textField"]}>
      <Label label={"Price"} />
      <div className={styles["inputField"]} style={{ padding: 0 }}>
        <input
          type="text"
          name="price"
          required
          onInvalid={onInvalid}
          onInput={onInput}
        ></input>
        <div style={{ border: "none" }}>
          <SingleSelect
            pagination={false}
            row={0}
            currentSelected={currentPlanSelected}
            isSelected={isSelected}
            selectEvent={selectEvent}
            selected={selected}
            objects={currencies}
            getTitle={getTitle}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceCurrency;
