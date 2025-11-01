import React from "react";
import styles from "./TextFields.module.css";
import { useTranslation } from "react-i18next";
const Label = ({ label }) => {
  const { t } = useTranslation();
  return <label className={styles["label"]}>{t(label)}</label>;
};

export default Label;
