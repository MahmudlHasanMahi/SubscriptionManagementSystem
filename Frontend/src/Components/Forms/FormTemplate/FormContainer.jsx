import React from "react";
import styles from "./FormContainer.module.css";
import Logo from "../../../Yasier.png";
import { useTranslation } from "react-i18next";
const FormContainer = ({ children, postTitle, title }) => {
  const { t } = useTranslation();
  return (
    <div className={styles["signInContainer"]}>
      <div>
        <div className={styles["logoContainer"]}>
          <img src={Logo} alt="" srcSet="" />
          <span>Yasier Systems</span>
        </div>
        <div className={styles["title"]}>
          <span>{t(postTitle)}</span>
          <span>{t(title)}</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
