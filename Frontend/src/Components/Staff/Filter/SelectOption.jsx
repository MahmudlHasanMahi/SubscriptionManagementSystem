import React from "react";
import styles from "./Select.module.css";
const SelectOption = (props) => {
  if (props.disable) return null;
  return (
    <div {...props} className={styles["option"]}>
      {props.title}
    </div>
  );
};

export default SelectOption;
