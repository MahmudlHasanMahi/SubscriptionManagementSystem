import React, { useEffect, useState } from "react";
import styles from "./DateField.module.css";
import { DatePicker, CustomProvider } from "rsuite";
import "rsuite/DatePicker/styles/index.css";
import InputOutline from "../../InputOutline/InputOutline";
import Label from "../TextFields/Label";
import NumericInputField from "../TextFields/NumericInputField";
import { isValidNumber, Number } from "../../../Utils/NumericUtils";
import { useTranslation } from "react-i18next";
const DateField = ({
  disable = true,
  period = null,
  dateRef,
  defaultCycle = null,
  beginDefault = null,
  endDateDefault = null,
}) => {
  const { t } = useTranslation();
  const [begin, setBegin] = useState(
    beginDefault ? new Date(beginDefault) : new Date()
  );

  const [cycle, setCycle] = useState();
  const [endDate, setEndDate] = useState(
    endDateDefault ? new Date(endDateDefault) : null
  );
  const disableBeforeToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const updateEndDate = (cycleVal, beginDate) => {
    const futureDate = new Date();
    if (beginDate) {
      futureDate.setDate(beginDate.getDate() + period * cycleVal);
    } else {
      futureDate.setDate(begin.getDate() + period * cycleVal);
    }
    dateRef.current.end = futureDate;
    setEndDate(futureDate);
  };

  const changeEndDate = (e) => {
    const val = Number(e?.target.value, false, true);
    if (val >= 1) {
      updateEndDate(val);
    } else {
      setEndDate(null);
    }
  };
  useEffect(() => {
    dateRef.current = {
      begin: begin,
      end: endDate,
    };
  }, []);

  const handleInvalid = (e) => {
    const value = e.target.value.trim();

    if (value === "") return e.target.setCustomValidity("");

    if (isValidNumber(value)) {
      e.target.setCustomValidity(t("Please provide a valid cycle."));
    } else {
      e.target.setCustomValidity(t("Please provide a cycle."));
    }
  };

  const handleInput = (e) => {
    const value = e.target.value.trim();
    if (value === "" || isValidNumber(value)) {
      e.target.setCustomValidity(""); // allow empty or valid number
    } else {
      e.target.setCustomValidity(t("please enter valid cycle"));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "60%" }}>
      <CustomProvider theme="dark">
        <Label label={"Date"} />
        <InputOutline>
          <div className={styles.date}>
            <DatePicker
              onChange={(val) => {
                setBegin(val);
                dateRef.current.begin = val;
                if (defaultCycle) {
                  updateEndDate(defaultCycle, val);
                }
              }}
              disabled={disable}
              label="Start:"
              className={styles["custom-datepicker"]}
              placement="leftStart"
              defaultValue={begin}
              shouldDisableDate={disableBeforeToday}
            />

            <div className={styles["cycleContainer"]}>
              <span>Cycle → </span>

              <NumericInputField
                value={isNaN(defaultCycle) ? null : defaultCycle}
                placeholder={defaultCycle || "Forever"}
                type={"text"}
                name={"price"}
                disabled={disable || !period}
                onChange={changeEndDate}
                handleInput={handleInput}
                handleInvalid={handleInvalid}
              />
            </div>

            <DatePicker
              label="End:"
              readOnly
              value={endDate}
              className={styles["custom-datepicker"]}
            />
          </div>
        </InputOutline>
      </CustomProvider>
    </div>
  );
};

export default DateField;
