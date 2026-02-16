import React from "react";
import styles from "./Select.module.css";
import { useTranslation } from "react-i18next";
const SelectOption = (props) => {
  const { t } = useTranslation();
  if (props.disable) return null;
  return (
    <div {...props} className={styles["option"]}>
      {t(props.title)}
    </div>
  );
};

export default SelectOption;
