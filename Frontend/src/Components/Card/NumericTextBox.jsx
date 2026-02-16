import React from "react";
import styles from "./Card.module.css";
import { useTranslation } from "react-i18next";

const NumericTextBox = ({ title1, title2 }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className={styles["NumericTextBox"]}>
      <span>{title1 ? t(title1) : "0"}</span>
      <span>{t(title2)}</span>
    </div>
  );
};

export default NumericTextBox;
