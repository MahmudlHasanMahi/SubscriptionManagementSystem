import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SelectOption from "../Staff/Filter/SelectOption";
import styles from "./MultiSelect.module.css";
const ItemMenu = ({
  search = null,
  onChange,
  isSelected,
  selectEvent,
  objects,
  getTitle,
  row = null,
  pagination = true,
  children,
}) => {
  const { ref: viewRef, inView } = useInView({ triggerOnce: true });
  useEffect(() => {
    if (pagination) objects.fetchNextPage();
  }, [inView]);
  return (
    <motion.div
      className={styles["options"]}
      key="modal"
      transition={{
        duration: 0.1,
      }}
      exit={{ opacity: 0 }}
    >
      {search && (
        <input
          style={{ width: "100%" }}
          className={styles["searchBox"]}
          placeholder="Search Price..."
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            if (search) {
              search.onChange(e, search.setSearch);
            }
          }}
        />
      )}
      <div>
        {pagination
          ? objects?.data?.pages.map((obj, idx) => {
              const res = !obj.results ? obj : obj.results;
              return res.map((option, idx) => {
                return (
                  <div
                    key={option.id}
                    className={`${styles["optionWrapper"]} ${
                      isSelected(option, row)
                        ? styles["active"]
                        : styles["highlight"]
                    }`}
                    onClick={(e) => {
                      selectEvent(option, e, row);
                    }}
                  >
                    <SelectOption title={getTitle(option)} />
                  </div>
                );
              });
            })
          : objects?.map((option, idx) => {
              return (
                <div
                  key={option.id}
                  className={`${styles["optionWrapper"]} ${
                    isSelected(option, row)
                      ? styles["active"]
                      : styles["highlight"]
                  }`}
                  onClick={(e) => {
                    selectEvent(option, e, row);
                  }}
                >
                  <SelectOption title={getTitle(option)} />
                </div>
              );
            })}

        <div className={styles["optionWrapper"]}>{children}</div>

        {!objects?.isFetching && <div ref={viewRef}></div>}
      </div>
    </motion.div>
  );
};

export default ItemMenu;
