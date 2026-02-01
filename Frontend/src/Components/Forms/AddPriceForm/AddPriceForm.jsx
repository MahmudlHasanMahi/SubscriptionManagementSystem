import React, { useState } from "react";
import FormContainer from "../FormContainer/FormContainer";
import TextFields from "../TextFields/TextFields";
import SingleSelect from "../SelectTable/SingleSelect";
import Label from "../TextFields/Label";
import InputOutline from "../../InputOutline/InputOutline";
import Button from "../Buttons/Button";
import { motion } from "framer-motion";
import PriceCurrency from "../PriceCurrencyField/PriceCurrency";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetPeriodsQuery } from "../../../Features/Services/periodApi";
import { useCreatePriceListMutation } from "../../../Features/Services/priceListApi";
import { useDebouncedCallback } from "use-debounce";
import { notifyError } from "../../../Utils/nofify";
import { isValidNumber, Number } from "../../../Utils/NumericUtils";
import { useTranslation } from "react-i18next";
import { useGetCurrenciesQuery } from "../../../Features/Services/currencyApi";
const AddPriceForm = ({ state }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const object = useGetPeriodsQuery();
  const currencyObject = useGetCurrenciesQuery();
  const [createPeriod, result] = useCreatePriceListMutation();
  const [selected, setSelected] = useState([]);
  const [currencySelected, setCurrencySelected] = useState([]);
  const isSelected = (option) => {
    return option.id === selected.id;
  };
  const selectEvent = (option, e, row) => {
    if (isSelected(option)) return setSelected([]);
    setSelected(option);
  };
  const currentPlanSelected = (row) => {
    const obj = selected.name;

    return <span>{obj ? obj : "Select Period"}</span>;
  };

  const getTitle = (object) => {
    return object.name;
  };

  const filter = useDebouncedCallback((e, setSearch) => {
    setSearch(e.target.value);
  }, 500);

  const create = (e) => {
    e.preventDefault();
    if (!selected.id) return notifyError(t("Please Select a Period"));
    if (!currencySelected.id) return notifyError(t("Please Select a currency"));
    const data = {
      period: selected.id,
      price: Number(e.target.price.value),
      currency: currencySelected.id,
    };
    createPeriod(data).then((data) => {
      state(false);
    });
  };

  const handleInvalid = (e) => {
    if (isValidNumber(e.target.value))
      e.target.setCustomValidity(t("Please provide a valid price."));
    else e.target.setCustomValidity(t("Please provide a price."));
  };

  const handleInput = (e) => {
    if (isValidNumber(e.target.value)) {
      e.target.setCustomValidity("");
    } else {
      e.target.setCustomValidity(t("please enter valid price"));
    }
  };

  return (
    <motion.div
      key={location.pathname}
      initial={{ x: -20, y: -20 }}
      exit={{ opacity: 0, x: -20, y: -20 }}
      animate={{
        x: 0,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          mass: 0.5,
        },
      }}
      style={{
        position: "absolute",
        display: "flex",
        top: "0.8em",
        left: "0.8em",
        zIndex: "2",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          boxShadow: " 2px 3px 11px -1px  #b1b1b1ff",
          borderRadius: "1.25em",
          width: "100%",
        }}
      >
        <form onSubmit={create} style={{ height: "100%" }}>
          <FormContainer title={"Add price"}>
            <PriceCurrency
              currencies={currencyObject?.data}
              onInvalid={handleInvalid}
              onInput={handleInput}
              selected={currencySelected}
              setSelected={setCurrencySelected}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Label label={"Period"} />
              <InputOutline>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SingleSelect
                    pagination={false}
                    row={0}
                    currentSelected={currentPlanSelected}
                    isSelected={isSelected}
                    selectEvent={selectEvent}
                    selected={selected}
                    objects={object.data}
                    getTitle={getTitle}
                  />
                </div>
              </InputOutline>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: "1em",
                marginTop: "8em",
              }}
            >
              <Button title={"Create Price"} />
              <Button
                title={"Cancel"}
                style={{ background: "#ffffff3b" }}
                onClick={() => {
                  state(false);
                }}
              />
            </div>
          </FormContainer>
        </form>
      </div>
    </motion.div>
  );
};

export default AddPriceForm;
