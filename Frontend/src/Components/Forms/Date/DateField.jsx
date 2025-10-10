import React, { useEffect, useState } from "react";
import styles from "./DateField.module.css";
import { DatePicker, CustomProvider } from "rsuite";
import "rsuite/DatePicker/styles/index.css";
import InputOutline from "../../InputOutline/InputOutline";
import Label from "../TextFields/Label";
import { notifyError } from "../../../Utils/nofify";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";
const DateField = ({
  title,
  background_color = null,
  disable = true,
  period = 30,
  date,
  beginDefault = null,
}) => {
  const [start, setStart] = useState(
    beginDefault ? new Date(beginDefault) : new Date()
  );

  const [cycle, setCycle] = useState(1);
  const [endDate, setEndDate] = useState(null);
  const disableBeforeToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  useEffect(() => {
    if (date) {
      date.current = {
        begin: start,
        end: endDate,
      };
    }
  }, [start, cycle]);

  const onChange = (e) => {
    const val = Number(e.target.value);
    if (val >= 1) {
      const futureDate = new Date();
      futureDate.setDate(start.getDate() + period * val);
      setEndDate(futureDate);
      setCycle(val);
    } else {
      setEndDate(null);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "60%" }}>
      <CustomProvider theme="dark">
        <Label label={"Date"} />
        <InputOutline>
          <div className={styles.date}>
            <DatePicker
              disabled={disable || beginDefault}
              label="Start:"
              className={styles["custom-datepicker"]}
              placement="leftStart"
              defaultValue={start}
              onChange={setStart}
              shouldDisableDate={disableBeforeToday}
            />

            <div className={styles["cycleContainer"]}>
              <span>Cycle → </span>
              <input
                disabled={disable}
                placeholder="forever"
                type="number"
                min={1}
                onChange={onChange}
                className={styles["cycle"]}
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
