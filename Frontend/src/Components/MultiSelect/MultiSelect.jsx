import { useEffect, useRef, useState } from "react";
import Label from "../Forms/TextFields/Label";
import styles from "./MultiSelect.module.css";
import ObjectTag from "./ObjectTag";
import SelectOption from "../Staff/Filter/SelectOption";
import { AnimatePresence, motion } from "motion/react";
import Arrow from "../../svg/Arrow";
import Cross from "../../svg/Cross";
import setDefault from "./setDefault";
const MultiSelect = ({
  children,
  label,
  name,
  objects,
  selected,
  setSelected,
  defaultValue,
  setDefaultValue,
  ref = null,
  onChange = null,
}) => {
  const [show, setShow] = useState(false);
  const getModifiedOption = (object) => {
    return setDefault(
      <SelectOption
        style={{ padding: "0.5em 1em" }}
        title={"Set as default"}
      />,
      object,
      setDefaultValue,
      name,
      onChange
    );
  };
  const toggleShow = (e) => {
    setShow((prev) => !prev);
  };

  const isSelected = (option, e) => {
    return selected?.some((item) => item.id === option.id);
  };
  const setOnChange = (option) => {
    onChange?.({
      target: {
        name,
        value: option?.id,
      },
    });
  };
  const selectEvent = (option, e) => {
    e.stopPropagation();

    setSelected((prev) => {
      if (!defaultValue) {
        setDefaultValue(option);
        setOnChange(option);
      }
      const if_exists = isSelected(option);

      if (!if_exists) {
        return [...prev, option];
      } else {
        const filtered = prev.filter((item) => item.id !== option.id);
        if (!filtered.some((item) => item.id === defaultValue.id)) {
          const data = filtered.length > 0 ? filtered[0] : null;
          setDefaultValue(data);
          setOnChange(data);
        }

        return filtered;
      }
    });
  };

  return (
    <div className={styles["multiSelect"]}>
      <input
        ref={ref}
        type="number"
        required={true}
        readOnly
        hidden
        name={name}
        value={defaultValue?.id}
      />
      <Label label={label} />
      <div
        className={styles["multiSelectObjectContainer"]}
        tabIndex={0}
        onBlur={() => {
          setShow(false);
        }}
        onClick={toggleShow}
      >
        <div className={styles["ObjectTagContainer"]}>
          {selected?.map((object, idx) => {
            if (object === defaultValue)
              return (
                <ObjectTag
                  setDefault={setDefaultValue}
                  defaultTag={true}
                  title={object.title}
                  key={idx}
                >
                  {getModifiedOption(object)}
                  <SelectOption style={{ padding: "0.5em 1em" }} title={""} />
                </ObjectTag>
              );

            return (
              <ObjectTag title={object.title} key={idx}>
                {getModifiedOption(object)}
                <SelectOption style={{ padding: "0.5em 1em" }} title={""} />
              </ObjectTag>
            );
          })}
          <AnimatePresence>
            {show && (
              <motion.div
                className={styles["options"]}
                animate={{
                  scale: 1,
                  maxHeight: "10em",
                  transition: {
                    duration: 0.1,
                  },
                }}
                onMouseLeave={toggleShow}
              >
                {objects?.map((option) => {
                  return (
                    <div
                      key={option.id}
                      className={`${styles["optionWrapper"]} ${
                        isSelected(option)
                          ? styles["active"]
                          : styles["highlight"]
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectEvent(option, e);
                      }}
                    >
                      <SelectOption title={option.title} />
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <motion.div
            initial={{ rotateZ: 0 }}
            animate={{
              rotateZ: show ? 180 : 0,
              transition: { duration: 0.2 },
            }}
            className={styles["arrow"]}
          >
            <Arrow color={"white"} />
          </motion.div>
          <div className={styles["caret"]}></div>
          <div
            className={styles["cross"]}
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
              setDefaultValue();
              setSelected([]);
              onChange?.({ target: { name, value: "" } });
            }}
          >
            <Cross />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
