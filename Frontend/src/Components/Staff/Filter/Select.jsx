import styles from "./Select.module.css";
import SelectBtn from "./SelectBtn";
import OptionWrapper from "./OptionWrapper";
import { motion, AnimatePresence } from "motion/react";
const Select = ({ children, placeholder, title, property, setProperty }) => {
  return (
    <div className={styles["selectContainer"]}>
      <span className={styles["title"]}>{title}</span>
      <div
        style={{ background: "#43526A", border: "0.5px solid rgb(78, 100, 134)" }}
        className={styles["select"]}
      >
        <SelectBtn
          setProperty={setProperty}
          current={children[property?.selected]}
          placeholder={placeholder}
          property={property}
        />
        <AnimatePresence>
          {property?.show && (
            <motion.div
              className={styles["optionsContainer"]}
              animate={{
                scale: 1,
                maxHeight: "10em",
                transition: {
                  duration: 0.1,
                },
              }}
            >
              {children.map((option, idx) => {
                return (
                  <OptionWrapper
                    active={property?.selected == idx}
                    setProperty={setProperty}
                    idx={idx}
                    key={idx}
                    option={option}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Select;
