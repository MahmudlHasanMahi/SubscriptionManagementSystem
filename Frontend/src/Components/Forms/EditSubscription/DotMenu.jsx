import React, { useState } from "react";
import styles from "./EditSubscription.module.css";

import { Tab } from "@mui/material";
const DotMenu = ({ children, disable = false, icon }) => {
  const [show, setShow] = useState(false);
  return (
    !disable && (
      <div className={styles["dotMenu-container"]}>
        <div
          className={styles["dotMenu"]}
          tabIndex={0}
          onClick={() => {
            setShow((prev) => !prev);
          }}
        >
          {icon}
        </div>
        {show && (
          <div
            tabIndex={1}
            onBlur={() => {
              setShow(false);
            }}
            onClick={() => {
              setShow(false);
            }}
          >
            {children}
          </div>
        )}
      </div>
    )
  );
};

export default DotMenu;
