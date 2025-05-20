import React from "react";
import styles from "./Select.module.css";
import Arrow from "../../../svg/Arrow";
import { motion } from "motion/react";
const SelectBtn = ({ current, placeholder, property, setProperty }) => {
  return (
    <motion.div
      className={styles["selectBtn"]}
      onClick={() => {
        setProperty((prev) => {
          return { ...prev, show: !prev.show };
        });
      }}
    >
      {current != null ? (
        current
      ) : (
        <div className={styles["placeholder"]}>{placeholder}</div>
      )}
      <motion.span
        initial={{ rotateZ: 0 }}
        animate={{
          rotateZ: property?.show ? 180 : 0,
          transition: { duration: 0.2 },
        }}
        style={{ display: "flex" }}
      >
        <Arrow color={"white"} />
      </motion.span>
    </motion.div>
  );
};

export default SelectBtn;
