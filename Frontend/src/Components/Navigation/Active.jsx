import { motion } from "motion/react";
import styles from "./Navigation.module.css";

const Active = () => {
  return (
    <motion.div layoutId="underline" className={styles["active"]}>
      <div></div>
    </motion.div>
  );
};

export default Active;
