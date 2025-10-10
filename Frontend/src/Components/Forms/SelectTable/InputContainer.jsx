import React from "react";
import styles from "./SelectTable.module.css";
const InputContainer = ({ children }) => {
  return <div className={styles["plans"]}>{children}</div>;
};

export default InputContainer;
