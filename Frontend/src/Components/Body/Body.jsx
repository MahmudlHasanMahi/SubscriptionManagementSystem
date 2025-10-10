import styles from "./Body.module.css";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
const Body = (props) => {
  return (
    <motion.div
      key="page"
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // transition={{ delay: 0, duration: 0.3 }}
      {...props}
      className={styles["body"]}
    >
      {props.children}
    </motion.div>
  );
};

export default Body;
