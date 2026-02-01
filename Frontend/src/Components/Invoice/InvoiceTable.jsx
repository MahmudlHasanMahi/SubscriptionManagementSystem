import { useState } from "react";
import styles from "../Forms/SelectTable/SelectTable.module.css";
import SingleSelect from "../Forms/SelectTable/SingleSelect";
import { useDebouncedCallback } from "use-debounce";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectTableContainer from "../Forms/SelectTable/SelectTableContainer";
import InputContainer from "../Forms/SelectTable/InputContainer";
import DotMenu from "../Forms/EditSubscription/DotMenu";
import SelectOption from "../Staff/Filter/SelectOption";

import Menu from "../MultiSelect/Menu";
import { notifyDefault, notifyError, notifySuccess } from "../../Utils/nofify";

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Number } from "../../Utils/NumericUtils";
import Background from "../Forms/SelectTable/Background";

const InvoiceTable = ({
  title,
  TableHeader,
  plans,
  selected,
  setSelected,
  planFilter,
  setPlanFilter,
  initalLength,
  showAdd = true,
}) => {
  const [priceFilter, setPriceFilter] = useState();
  const isSelected = (option) => {
    return false;
  };

  const selectEvent = (option, e, row) => {
    if (isSelected(option)) return;
    setSelected((prev) => {
      if (prev == []) return [option];
      const update = [...prev];
      update[row] = {
        ...option,
        price: option["default_price"],
        default_price: option["default_price"],
      };
      return update;
    });
  };

  const currentPlanSelected = (row) => {
    const obj = row.name;
    return obj ? (
      <InputContainer>{obj}</InputContainer>
    ) : (
      <InputContainer>Add plan . . .</InputContainer>
    );
  };

  const currentPriceSelected = (object) => {
    const obj = object.price;

    return obj ? (
      <InputContainer>{`${Number(obj.price, true)}/${
        obj.period.name
      }`}</InputContainer>
    ) : (
      <InputContainer>Add plan . . .</InputContainer>
    );
  };

  const isPriceSelected = (option, row) => {
    return selected[row]?.price
      ? selected[row]?.price.id == option.id
      : selected[row]?.default_price.id == option.id;
  };
  const selectPriceEvent = (option, e, row) => {
    setSelected((prev) => {
      const update = [...prev];
      update[row] = { ...update[row], price: option };
      return update;
    });
  };

  const setQuantity = (e, idx) => {
    setSelected((prev) => {
      const update = [...prev];
      update[idx] = { ...update[idx], quantity: e.target.value };
      return update;
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
    <Background>
      <SelectTableContainer title={title}>
        <thead>
          <tr>
            {TableHeader.map((item, idx) => {
              return <th key={idx}>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {selected?.map((data, idx) => {
            return (
              <tr className={styles["row"]} key={idx}>
                {idx > initalLength - 1 ? (
                  <td>
                    <SingleSelect
                      getTitle={(obj) => {
                        return obj.name;
                      }}
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
                    />
                  </td>
                ) : (
                  <td>{selected[idx].product?.name}</td>
                )}
                <td>
                  <div className={styles["text"]}>
                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      max="20"
                      onChange={(e) => {
                        setQuantity(e, idx);
                      }}
                      key={data.id}
                      defaultValue={data.quantity ?? 1}
                      readOnly={idx <= initalLength - 1}
                    />
                  </div>
                </td>
                <td>
                  <div className={styles["text"]}>
                    {/* {currentPriceSelected(selected[idx])} */}
                    <td>
                      <SingleSelect
                        pagination={false}
                        row={idx}
                        currentSelected={currentPriceSelected}
                        isSelected={isPriceSelected}
                        selectEvent={selectPriceEvent}
                        selected={selected}
                        objects={selected[idx].price_list}
                        getTitle={({ period, price }) => {
                          return `${Number(price, true)}/${period.name}`;
                        }}
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
                          display: idx <= initalLength - 1 && "none",
                        }}
                      />
                    </td>
                  </div>
                </td>
                <td
                  className={styles["delete"]}
                  style={{ opacity: data.status === "CANCELLED" && "0" }}
                ></td>
              </tr>
            );
          })}
        </tbody>

        {showAdd && (
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
        )}
      </SelectTableContainer>
    </Background>
  );
};
export default InvoiceTable;
