import React from "react";
import styles from "./SelectTable.module.css";
const SelectTableContainer = ({ title, children }) => {
  return (
    <div className={styles["SelectTable"]}>
      <span>{title}</span>
      <table>{children}</table>
    </div>
  );
};

export default SelectTableContainer;
