import React from "react";
import styles from "./TextFields.module.css";
const Label = ({ label }) => {
  return <label className={styles["label"]}>{label}</label>;
};

export default Label;
