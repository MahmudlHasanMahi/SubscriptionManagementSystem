import InputOutline from "../../InputOutline/InputOutline";
import Label from "../TextFields/Label";
import SingleSelect from "../SelectTable/SingleSelect";
import styles from "./SingleSelect.module.css";
import { useDebouncedCallback } from "use-debounce";
const ClientSelect = ({
  children,
  objects,
  selected,
  setSelected,
  clientFilter,
  setClientFilter,
}) => {
  const isSelected = (option) => {
    return option.id === selected.id;
  };
  const selectEvent = (option, e, row) => {
    if (isSelected(option)) return setSelected([]);
    setSelected(option);
  };
  const currentPlanSelected = (row) => {
    const obj = selected.name;

    return <span>{obj ? obj : "Select Client"}</span>;
  };
  const filter = useDebouncedCallback((e, setSearch) => {
    setSearch(e.target.value);
  }, 500);
  const getTitle = (obj) => {
    return obj.name;
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 3,
      }}
    >
      <Label label={"Client"} />
      <InputOutline>
        <div className={styles["select-wrapper"]}>
          <SingleSelect
            pagination={true}
            row={0}
            currentSelected={currentPlanSelected}
            isSelected={isSelected}
            selectEvent={selectEvent}
            selected={selected}
            objects={objects}
            getTitle={getTitle}
            search={{
              search: clientFilter,
              setSearch: setClientFilter,
              onChange: filter,
            }}
          />
        </div>
      </InputOutline>
    </div>
  );
};

export default ClientSelect;
