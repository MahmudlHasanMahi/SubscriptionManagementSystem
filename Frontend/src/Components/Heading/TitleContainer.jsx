import styles from "./Heading.module.css";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const TitleContainer = () => {
  const state = useSelector((state) => state.headerState);
  const location = useLocation();

  const titleVariants = {
    initial: { opacity: 0, y: "10%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "-10%" },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} className={styles["titleContainer"]}>
        <span>
          {state.logo}
          <motion.span
            variants={titleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15 }}
          >
            {state.title1}
          </motion.span>
        </span>

        <motion.span
          variants={titleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.15 }}
        >
          {state.title2}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
};

export default TitleContainer;
