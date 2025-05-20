import React from "react";
import styles from "./FormContainer.module.css";
import Logo from "../../../Yasier.png";
const FormContainer = ({ children, postTitle, title }) => {
  return (
    <div className={styles["signInContainer"]}>
      <div>
        <div className={styles["logoContainer"]}>
          <img src={Logo} alt="" srcSet="" />
          <span>Yasier Systems</span>
        </div>
        <div className={styles["title"]}>
          <span>{postTitle}</span>
          <span>{title}</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
