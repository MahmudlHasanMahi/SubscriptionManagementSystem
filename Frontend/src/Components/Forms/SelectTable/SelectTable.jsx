import React, { useState, useRef, useEffect } from "react";
import styles from "./SelectTable.module.css";
import ItemMenu from "../../MultiSelect/ItemMenu";
import { useGetProductsQuery } from "../../../Features/Services/productApi";
import SingleSelect from "./SingleSelect";
import { useDebouncedCallback } from "use-debounce";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectTableContainer from "./SelectTableContainer";
import InputContainer from "./InputContainer";
import { Number } from "../../../Utils/NumericUtils";
const SelectTable = ({
  title,
  TableHeader,
  plans,
  selected,
  setSelected,
  planFilter,
  setPlanFilter,
}) => {
  const [priceFilter, setPriceFilter] = useState();

  const isSelected = (option) => {
    return selected?.some((item) => item.id === option.id);
  };
  
  const selectEvent = (option, e, row) => {
    if (isSelected(option)) return;
    setSelected((prev) => {
      if (prev == []) return [option];
      const update = [...prev];
      update[row] = { ...option, default_price: option["default_price"] };
      return update;
    });
  };

  const currentPlanSelected = (object) => {
    const obj = object.name;

    return obj ? (
      <InputContainer>{obj}</InputContainer>
    ) : (
      <InputContainer>Add plan . . .</InputContainer>
    );
  };

  const currentPriceSelected = (object) => {
    const obj = object.default_price;

    return obj ? (
      <InputContainer>{`${Number(obj.price, true)}/${
        obj.period.name
      }`}</InputContainer>
    ) : (
      <InputContainer>Add plan . . .</InputContainer>
    );
  };

  const isPriceSelected = (option, row) => {
    return selected[row]?.default_price.id == option.id;
  };
  const selectPriceEvent = (option, e, row) => {
    setSelected((prev) => {
      const update = [...prev];

      update[row].default_price = option;

      return update;
    });
  };

  const setQuantity = (e, idx) => {
    setSelected((prev) => {
      const updated = [...prev];
      prev[idx]["quantity"] = e.target.value;
      return updated;
    });
  };
  const deleteRow = (row) => {
    setSelected((prev) => {
      const update = [...prev.slice(0, row), ...prev.slice(row + 1)];
      if (update.length === 0) return [...update, {}];
      return update;
    });
  };

  const filter = useDebouncedCallback((e, setSearch) => {
    setSearch(e.target.value);
  }, 500);

  return (
    <SelectTableContainer title={title}>
      <thead>
        <tr>
          {TableHeader.map((item, idx) => {
            return <th key={idx}>{item}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {selected.map((data, idx) => {
          return (
            <tr className={styles["row"]} key={idx}>
              <td>
                <SingleSelect
                  pagination={true}
                  row={idx}
                  currentSelected={currentPlanSelected}
                  isSelected={isSelected}
                  selectEvent={selectEvent}
                  selected={selected}
                  objects={plans}
                  search={{
                    search: planFilter,
                    setSearch: setPlanFilter,
                    onChange: filter,
                  }}
                  getTitle={(obj) => obj.name}
                />
              </td>

              <td>
                <div className={styles["text"]}>
                  <input
                    onChange={(e) => {
                      setQuantity(e, idx);
                    }}
                    name="quantity"
                    type="number"
                    min="1"
                    max="20"
                    defaultValue={1}
                  />
                </div>
              </td>

              <td>
                <SingleSelect
                  getTitle={({ period, price }) => {
                    return `${Number(price, true)}/${period.name}`;
                  }}
                  pagination={false}
                  row={idx}
                  currentSelected={currentPriceSelected}
                  isSelected={isPriceSelected}
                  selectEvent={selectPriceEvent}
                  selected={selected}
                  objects={selected[idx].price_list}
                  search={{
                    search: priceFilter,
                    setSearch: setPriceFilter,
                    onChange: filter,
                  }}
                />
              </td>
              <td className={styles["delete"]}>
                <DeleteIcon
                  onClick={() => {
                    deleteRow(idx);
                  }}
                  style={{
                    cursor: "pointer",
                    display: !Object.hasOwn(selected[0], "id") && "none",
                  }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>

      <div
        className={styles["add"]}
        onClick={() => {
          setSelected((prev) => {
            const last = prev.at(-1);
            const isLastEmpty = last && Object.keys(last).length === 0;
            if (!isLastEmpty) {
              return [...prev, {}];
            }
            return prev;
          });
        }}
      >
        + Add product
      </div>
    </SelectTableContainer>
  );
};

export default SelectTable;
