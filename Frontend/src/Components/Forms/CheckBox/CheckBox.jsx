import styles from "./CheckBox.module.css";
import Checkbox from "@mui/material/Checkbox";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
const CheckBox = ({ name, defaultChecked = false }) => {
  const [checked, isChecked] = useState(defaultChecked);
  const sx = {
    color: grey[300],
    "&.Mui-checked": {
      color: grey[300],
    },
  };
  useEffect(() => {
    isChecked(defaultChecked);
  }, [defaultChecked]);
  return (
    <div className={styles["checkBox"]}>
      <Checkbox
        name={name}
        onClick={() => {
          isChecked((prev) => !prev);
        }}
        checked={checked}
        style={{
          transform: "scale(1.2)",
        }}
        sx={sx}
      />

      <span className={styles["title"]}>{"Activate account"}</span>
    </div>
  );
};

export default CheckBox;
