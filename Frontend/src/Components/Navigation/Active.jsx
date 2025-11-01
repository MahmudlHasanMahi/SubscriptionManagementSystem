import { motion } from "motion/react";
import styles from "./Navigation.module.css";

const Active = ({ isResizing }) => {
  return (
    <motion.div
      layoutId="highlight"
      
      transition={{ duration: isResizing.current ? 0 : 0.25 }}
      className={styles["active"]}
    >
      <div></div>
    </motion.div>
  );
};

export default Active;
