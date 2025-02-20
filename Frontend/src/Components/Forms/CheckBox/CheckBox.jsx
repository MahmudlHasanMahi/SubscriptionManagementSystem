import styles from "./CheckBox.module.css";
import Checkbox from "@mui/material/Checkbox";
import { grey } from "@mui/material/colors";
const CheckBox = ({ name, setIsChecked, defaultChecked = false }) => {
  const toggle = () => {
    setIsChecked((prev) => {
      return { ...prev, [value]: !prev[value] };
    });
  };
  const sx = {
    color: grey[300],
    "&.Mui-checked": {
      color: grey[300],
    },
  };
  return (
    defaultChecked && (
      <div className={styles["checkBox"]}>
        <Checkbox
          name={name}
          defaultChecked={defaultChecked}
          style={{
            transform: "scale(1.2)",
          }}
          sx={sx}
        />

        <span className={styles["title"]}>{"Activate account"}</span>
      </div>
    )
  );
};

export default CheckBox;
