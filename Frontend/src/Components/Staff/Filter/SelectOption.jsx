import React from "react";
import styles from "./Select.module.css";
const SelectOption = ({ title }) => {
  return <div className={styles["option"]}>{title}</div>;
};

export default SelectOption;
