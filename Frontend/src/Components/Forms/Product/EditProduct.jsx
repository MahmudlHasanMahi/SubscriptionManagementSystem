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
import { useGetPriceListQuery } from "../../../Features/Services/priceListApi";

import Button from "../Buttons/Button";
import { notifyError, notifySuccess } from "../../../Utils/nofify";
import { SOMETHING_WENT_WRONG } from "../../../Utils/types";
import ErrorToString from "../../../Utils/ErrorToString";
import ArrayDifference from "../../../Utils/ArrayDifference";
import { useQueryClient } from "@tanstack/react-query";
const EditProduct = () => {
  const { productId } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetProductQuery(productId, {
    refetchOnMountOrArgChange: true,
  });
  const price = useGetPriceListQuery();
  const [patchProduct, patchDetails] = usePatchProductMutation();
  const [selected, setSelected] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const [changedValue, setChangedValue] = useState({});
  const [disable, setDisable] = useState(true);
  const navigate = useNavigate();

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
        console.log(prev, ArrayDifference(data?.price_list, selected));
        return prev && !ArrayDifference(data?.price_list, selected);
      });
  }, [selected, defaultValue]);
  const onChange = (e) => {
    const { name, value } = e.target;
    setChangedValue((prev) => {
      prev[name] = value;
      if (prev[name] === data[name] || prev[name] === data[name].id) {
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
  return (
    <Body>
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
          <Textbox
            label={"Description"}
            name={"description"}
            value={data?.description}
            onChange={onChange}
          />
          <MultiSelect
            label={"Price"}
            name={"default_price"}
            objects={price?.data}
            selected={selected}
            setSelected={setSelected}
            defaultValue={defaultValue}
            setDefaultValue={setDefaultValue}
            onChange={onChange}
          />
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
    </Body>
  );
};

export default EditProduct;
