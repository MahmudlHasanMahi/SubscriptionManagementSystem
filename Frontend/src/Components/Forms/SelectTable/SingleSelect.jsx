import React, { useEffect, useState } from "react";
import ItemMenu from "../../MultiSelect/ItemMenu";
import styles from "./SelectTable.module.css";

const SingleSelect = ({
  isSelected,
  selectEvent,
  selected,
  objects,
  row,
  pagination,
  itemTitle,
  currentSelected,
  search = null,
}) => {
  const [show, setShow] = useState(null);

  return (
    <div
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setShow(null);
          search?.setSearch(null);
        }
      }}
      onClick={() => setShow(show === row ? null : row)}
    >
      {currentSelected(row)}
      {show === row && (
        <div className={styles["optionWrapper"]}>
          <ItemMenu
            row={row}
            pagination={pagination}
            itemTitle={itemTitle}
            search={search}
            onChange={{}}
            isSelected={isSelected}
            selectEvent={selectEvent}
            objects={objects}
          />
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
