import React, { useState } from "react";
import styles from "./DateField.module.css";
import { DatePicker, CustomProvider } from "rsuite";
import "rsuite/DatePicker/styles/index.css";
const DateField = ({ title, background_color = null, period = 30 }) => {
  const [start, setStart] = useState(new Date());
  const [cycle, setCycle] = useState(1);
  const [endDate, setEndDate] = useState(null);
  const disableBeforeToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div>
      <span className={styles["label"]}>{"Date"}</span>
      <div className={styles["date"]}>
        <CustomProvider theme="dark">
          <DatePicker
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
              placeholder="forever"
              type="number"
              min={2}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1) {
                  const futureDate = new Date();
                  futureDate.setDate(start.getDate() + period * val);
                  setEndDate(futureDate);
                  setCycle(val);
                } else {
                  setEndDate(null);
                }
              }}
              className={styles["cycle"]}
            />
          </div>

          <DatePicker
            label="End:"
            readOnly
            value={endDate}
            className={styles["custom-datepicker"]}
          />
        </CustomProvider>
      </div>
    </div>
  );
};

export default DateField;
