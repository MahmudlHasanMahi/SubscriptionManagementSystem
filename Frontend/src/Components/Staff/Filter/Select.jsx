import styles from "./Select.module.css";
import SelectBtn from "./SelectBtn";
import OptionWrapper from "./OptionWrapper";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
const Select = ({
  children,
  placeholder,
  title,
  property,
  setProperty,
  background_color,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles["selectContainer"]}>
      <span className={styles["title"]}>{title}</span>
      <div
        style={{
          background: background_color,
          border: "0.5px solid rgb(78, 100, 134)",
        }}
        className={styles["select"]}
      >
        <SelectBtn
          setShow={setShow}
          show={show}
          current={children[property?.selected]}
          placeholder={placeholder}
        />
        <AnimatePresence>
          {show && (
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
              {children?.map((option, idx) => {
                return (
                  <OptionWrapper
                    active={property?.selected == idx}
                    setProperty={setProperty}
                    setShow={setShow}
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
