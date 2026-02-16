import SelectOption from "../Staff/Filter/SelectOption";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, invariant, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Label from "../Forms/TextFields/Label";
import styles from "./MultiSelect.module.css";
import setDefault from "./setDefault";
import ObjectTag from "./ObjectTag";
import Arrow from "../../svg/Arrow";
import Cross from "../../svg/Cross";
import ItemMenu from "./ItemMenu";
import { useTranslation } from "react-i18next";
const MultiSelect = ({
  children,
  label,
  name,
  objects,
  selected,
  setSelected,
  defaultValue = null,
  setDefaultValue = null,
  ref = null,
  onChange = null,
  search = null,
  type = "multi",
  getTitle,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [show, setShow] = useState(false);
  const { ref: viewRef, inView } = useInView({ triggerOnce: true });
  useEffect(() => {
    objects.fetchNextPage();
  }, [inView]);

  const getModifiedOption = (object) => {
    return setDefault(
      <SelectOption
        style={{ padding: "0.5em 1em" }}
        title={"Set as default"}
      />,
      object,
      setDefaultValue,
      name,
      onChange,
    );
  };

  const toggleShow = (e) => {
    if (search && show) {
      search.setSearch(null);
    }
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
    const if_exists = isSelected(option);
    if (type == "single") {
      setSelected(!if_exists ? [option] : []);
    } else {
      setSelected((prev) => {
        if (!defaultValue) {
          setDefaultValue(option);
          setOnChange(option);
        }

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
    }
  };

  return (
    <div className={styles["multiSelect"]} tabIndex={1}>
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
        ref={containerRef}
        className={styles["multiSelectObjectContainer"]}
        onClick={toggleShow}
        tabIndex={0}
        onBlur={(e) => {
          // e.stopPropagation();
          if (!containerRef.current.contains(e.relatedTarget)) setShow(false);
        }}
      >
        <div className={styles["ObjectTagContainer"]}>
          {selected?.map((object, idx) => {
            if (object === defaultValue)
              return (
                <ObjectTag
                  setDefault={setDefaultValue}
                  defaultTag={true}
                  title={getTitle(object)}
                  key={idx}
                >
                  {getModifiedOption(object)}
                  <SelectOption style={{ padding: "0.5em 1em" }} title={""} />
                </ObjectTag>
              );

            return (
              <ObjectTag title={getTitle(object)} key={idx}>
                {getModifiedOption(object)}
                <SelectOption style={{ padding: "0.5em 1em" }} title={""} />
              </ObjectTag>
            );
          })}

          <AnimatePresence>
            {show && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0.3 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
                style={{ position: "absolute", bottom: "-1em" }}
              >
                <ItemMenu
                  getTitle={getTitle}
                  search={search}
                  onChange={onChange}
                  selectEvent={selectEvent}
                  objects={objects}
                  isSelected={isSelected}
                >
                  {children}
                </ItemMenu>
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
