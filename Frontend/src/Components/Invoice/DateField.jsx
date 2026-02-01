import { DatePicker, CustomProvider } from "rsuite";
import Label from "../Forms/TextFields/Label";
import styles from "./Invoice.module.css";
const DateField = ({
  label,
  onChange,
  defaultValue,
  disableDatesTill = null,
  disable = false,
  name = null,
}) => {
  const disableBeforeToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (disableDatesTill) {
      return date < today || date > disableDatesTill;
    }

    return date < today;
  };

  return (
    <div>
      <Label label={label} />
      <CustomProvider theme="dark">
        <div className={styles["date"]}>
          <DatePicker
            name={name}
            defaultValue={defaultValue}
            shouldDisableDate={disableBeforeToday}
            onChange={onChange}
            disabled={disable}
            placement="top"
          />
        </div>
      </CustomProvider>
    </div>
  );
};

export default DateField;
