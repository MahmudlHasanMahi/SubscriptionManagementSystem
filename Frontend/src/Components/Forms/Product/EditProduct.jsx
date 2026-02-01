import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormContainer from "../FormContainer/FormContainer";
import Body from "../../Body/Body";
import CSRFProtect from "../../../Utils/CSRFProtect";
import TextFields from "../TextFields/TextFields";
import MultiSelect from "../../MultiSelect/MultiSelect";
import Textbox from "../TextFields/Textbox";
import {
  useGetProductQuery,
  usePatchProductMutation,
} from "../../../Features/Services/productApi";
import { useGetPriceListInfiniteQuery } from "../../../Features/Services/priceListApi";

import Button from "../Buttons/Button";
import { notifyError, notifySuccess } from "../../../Utils/nofify";
import { SOMETHING_WENT_WRONG } from "../../../Utils/types";
import ErrorToString from "../../../Utils/ErrorToString";
import ArrayDifference from "../../../Utils/ArrayDifference";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../../Features/headerState";
import { useDebouncedCallback } from "use-debounce";
import AddPriceForm from "../AddPriceForm/AddPriceForm";
import { AnimatePresence } from "framer-motion";
import SelectOption from "../../Staff/Filter/SelectOption";
import { Number } from "../../../Utils/NumericUtils";
const EditProduct = () => {
  const { productId } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetProductQuery(productId, {
    refetchOnMountOrArgChange: true,
  });

  const [priceFilter, setPriceFilter] = useState(null);
  const price = useGetPriceListInfiniteQuery({ size: 3, filter: priceFilter });
  const [showPriceFrom, setShowPriceFrom] = useState(false);
  const [patchProduct, patchDetails] = usePatchProductMutation();
  const [selected, setSelected] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const [changedValue, setChangedValue] = useState({});
  const [disable, setDisable] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Edit products`,
        title2: "Edit and delete Products",
        logo: null,
      })
    );
  }, []);

  useEffect(() => {
    if (patchDetails.isUninitialized || patchDetails.isLoading) return;
    if (patchDetails.isSuccess) {
      notifySuccess(patchDetails.data.detail);
      queryClient.removeQueries({
        queryKey: ["/products"],
      });
      navigate("/subscription/products");
    } else if (patchDetails.isError) {
      notifyError(ErrorToString(patchDetails));
    } else {
      notifyError(SOMETHING_WENT_WRONG);
    }
  }, [patchDetails.isLoading]);

  useEffect(() => {
    const prices = data?.price_list;
    const defaultPrice = data?.default_price;
    const val = prices?.find((val) => val.id === defaultPrice.id);
    setSelected(prices);
    setDefaultValue(val);
  }, [data]);

  useEffect(() => {
    if (selected?.length !== 0)
      setDisable((prev) => {
        return prev && !ArrayDifference(data?.price_list, selected);
      });
  }, [selected, defaultValue]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setChangedValue((prev) => {
      prev[name] = value;
      if (prev[name] === data[name] || prev[name] === data[name]?.id) {
        delete prev[name];
      }
      setDisable(Object.keys(prev).length === 0);
      return prev;
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();

    const price_list = ArrayDifference(data.price_list, selected) && {
      price_list: selected.map((item) => item.id),
    };
    const object = {
      ...changedValue,
      ...price_list,
    };

    patchProduct({ id: productId, patchData: object });
  };

  const onPriceListSearch = useDebouncedCallback((e, setSearch) => {
    setSearch(e.target.value);
  }, 500);

  const Addprice = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "0 0 0 1em",
        textDecoration: "none",
        color: "white",
      }}
      onClick={() => setShowPriceFrom(true)}
    >
      <span style={{ fontSize: "1.4em" }}>+</span>
      <SelectOption
        title="Add Price"
        style={{
          fontSize: "0.9em",
          textDecoration: "underline",
          fontWeight: "700",
        }}
      />
    </div>
  );

  return (
    <Body>
      <div style={{ position: "relative" }}>
        <form onSubmit={onSubmit} onChange={onChange}>
          <FormContainer
            isLoading={isLoading || price.isLoading}
            title={"Edit Product"}
          >
            <CSRFProtect />
            <TextFields
              type={"text"}
              name={"name"}
              label={"Name"}
              value={data?.name}
              editField
              required
            />

            <MultiSelect
              label={"Price"}
              name={"default_price"}
              objects={price}
              selected={selected}
              setSelected={setSelected}
              defaultValue={defaultValue}
              setDefaultValue={setDefaultValue}
              onChange={onChange}
              getTitle={(obj) => {
                return `${obj.formatted}`;
              }}
              search={{
                search: priceFilter,
                setSearch: setPriceFilter,
                onChange: onPriceListSearch,
              }}
            >
              {Addprice}
            </MultiSelect>
            <div style={{ marginTop: "1em" }}>
              <Textbox
                label={"Description"}
                name={"description"}
                value={data?.description}
                onChange={onChange}
              />
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                gap: "1em",
                paddingBlockStart: "3em",
              }}
            >
              <Button title={"Save"} disable={disable} />

              <Button
                title={"Cancel"}
                style={{ background: "#ffffff3b" }}
                link={"/subscription/products"}
              />
            </div>
          </FormContainer>
        </form>
        <AnimatePresence>
          {showPriceFrom && <AddPriceForm state={setShowPriceFrom} />}
        </AnimatePresence>
      </div>
    </Body>
  );
};

export default EditProduct;
