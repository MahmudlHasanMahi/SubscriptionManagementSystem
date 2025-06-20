import { useState } from "react";
import styles from "./MultiSelect.module.css";
import Tick from "../../svg/Tick";
import ThreeDot from "../../svg/ThreeDot";
import SelectOption from "../Staff/Filter/SelectOption";
import Menu from "./Menu";
const ObjectTag = ({ children, title, defaultTag = false }) => {
  const [show, setShow] = useState(false);
  const toggleShow = (e) => {
    e.stopPropagation();
    setShow((prev) => !prev);
  };
  return (
    <div className={styles["objectTag"]}>
      {defaultTag && (
        <div className={styles["tick"]}>
          <Tick />
        </div>
      )}
      {title}
      <div
        style={{ position: "relative" }}
        onClick={toggleShow}
        tabIndex={1}
        onBlur={(e) => {
          setShow(false);
        }}
      >
        <div className={styles["dots"]}>
          <ThreeDot />
        </div>
        {show && (
          <Menu width={"10em"} left={"-0.5em"} top={"1.3em"}>
            {children}
          </Menu>
        )}
      </div>
    </div>
  );
};

export default ObjectTag;
