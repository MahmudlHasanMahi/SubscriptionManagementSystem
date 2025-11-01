import React, { useEffect, useState } from "react";
import ItemMenu from "../../MultiSelect/ItemMenu";
import styles from "./SelectTable.module.css";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
const SingleSelect = ({
  isSelected,
  selectEvent,
  selected,
  objects,
  row,
  pagination,
  currentSelected,
  search = null,
  getTitle,
}) => {
  const [show, setShow] = useState(null);
  return (
    <div
      className={styles["singleSelect"]}
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setShow(null);
          search?.setSearch(null);
        }
      }}
      onClick={() => setShow(show === row ? null : row)}
    >
      {currentSelected(selected[row])}
      {show === row && objects && (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.5, opacity: 0.3 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.1 }}
            className={styles["optionWrapper"]}
          >
            <ItemMenu
              row={row}
              pagination={pagination}
              getTitle={getTitle}
              search={search}
              onChange={{}}
              isSelected={isSelected}
              selectEvent={selectEvent}
              objects={objects}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default SingleSelect;
