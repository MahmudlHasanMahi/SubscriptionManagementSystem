import React from "react";
import styles from "./Card.module.css";
const NumericTextBox = ({ title1, title2 }) => {
  return (
    <div className={styles["NumericTextBox"]}>
      <span>{title1}</span>
      <span>{title2}</span>
    </div>
  );
};

export default NumericTextBox;
