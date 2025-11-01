import React, { useState } from "react";
import styles from "./SelectTable.module.css";
import SingleSelect from "./SingleSelect";
import { useDebouncedCallback } from "use-debounce";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectTableContainer from "./SelectTableContainer";
import InputContainer from "./InputContainer";
import InvoiceSummary from "./InvoiceSummary";
import Background from "./Background";
import NumericInputField from "../TextFields/NumericInputField";
import {
  isValidNumber,
  Number,
  englishToArabic,
} from "../../../Utils/NumericUtils";
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
      update[row] = {
        ...option,
        quantity: 1,
        default_price: option["default_price"],
      };
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
      <InputContainer>Add price . . .</InputContainer>
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
      const price = parseInt(Number(e.target.value));
      prev[idx]["quantity"] = price > 20 ? 1 : price;
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

  const total = selected.reduce(
    (sum, item) => sum + (item.default_price?.price * item.quantity || 0),
    0
  );
  const data = [
    [
      { title: "Subtotal", value: total },
      { title: "Subtotal", value: total },
    ],
    [{ title: "Total", value: total }],
  ];

  const handleInvalid = (e) => {
    e.target.setCustomValidity("Please provide a price.");
    if (isValidNumber(e.target.value)) {
      const number = parseInt(Number(e.target.value));
      if (number > 1 && number < 20) e.target.setCustomValidity("");
      else e.target.setCustomValidity("must be greater 1 and less than 20");
    } else {
      e.target.setCustomValidity("please enter valid price");
    }
  };

  const handleInput = (e) => {
    if (isValidNumber(e.target.value)) {
      const number = parseInt(Number(e.target.value));
      if (number > 1 && number < 20) e.target.setCustomValidity("");
      else e.target.setCustomValidity("must be greater 1 and less than 20");
    } else {
      e.target.setCustomValidity("please enter valid price");
    }
  };

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
                      type={"text"}
                      defaultValue={Number(1, false, true)}
                      onInvalid={handleInvalid}
                      onInput={handleInput}
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
      <InvoiceSummary data={data} />
    </Background>
  );
};

export default SelectTable;
