import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../../Features/headerState";
import Services from "../../../svg/Services";
import Body from "../../Body/Body";
import FormContainer from "../FormContainer/FormContainer";
import TextFields from "../TextFields/TextFields";
import Button from "../Buttons/Button";
import Textbox from "../TextFields/Textbox";
import MultiSelect from "../../MultiSelect/MultiSelect";
import { useCreateProductMutation } from "../../../Features/Services/productApi";
import { useGetPriceListInfiniteQuery } from "../../../Features/Services/priceListApi";
import {
  notifyDefault,
  notifyError,
  notifySuccess,
} from "../../../Utils/nofify";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { SOMETHING_WENT_WRONG } from "../../../Utils/types";
import ErrorToString from "../../../Utils/ErrorToString";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";
import SelectOption from "../../Staff/Filter/SelectOption";
import { AnimatePresence } from "framer-motion";
import AddPriceForm from "../AddPriceForm/AddPriceForm";
import formatCurrency from "../../../Utils/CurrencyFormater";
const CreateProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);
  const [defaultValue, setDefaultValue] = useState(null);
  const [addPrice, setAddPrice] = useState(false);
  const objects = useGetPriceListInfiniteQuery({
    size: 3,
    filter: priceFilter,
  });

  const [createProduct, result] = useCreateProductMutation();
  const { ref, inView } = useInView();

  useEffect(() => {
    objects.fetchNextPage();
  }, [inView]);

  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Product`,
        title2: "Create Product",
        logo: <Services />,
      })
    );
  }, []);

  useEffect(() => {
    console.log(result);
    if (result.isUninitialized || result.isLoading) return;
    if (result.isSuccess) {
      notifySuccess(result.data.detail);
      queryClient.removeQueries({
        queryKey: ["/products"],
      });
      navigate("/subscription/products", { replace: true });
    } else if (result.isError) {
      notifyError(ErrorToString(result));
    } else {
      notifyError(SOMETHING_WENT_WRONG);
    }
  }, [result.isLoading]);
  const onSubmit = (e) => {
    e.preventDefault();
    if (!defaultValue) return notifyDefault("Please select price");
    const name = e.target.name.value;
    const newProduct = {
      name: name,
      description: e.target.description.value,
      price_list: selected.map((obj) => obj.id),
      default_price: e.target.defaultValue.value,
    };
    createProduct(newProduct);
  };

  const onChange = useDebouncedCallback((e, setSearch) => {
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
      onClick={(prev) => setAddPrice(true)}
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

  const getMultiSelectTitle = (obj) => {
    const x = formatCurrency(obj.price);
    return `${x}/${obj.period.name}`;
  };

  return (
    <Body>
      <div style={{ position: "relative" }}>
        <form onSubmit={onSubmit}>
          <FormContainer
            title={"Create new products"}
            isLoading={objects.isLoading || result.isLoading}
          >
            <TextFields
              type={"text"}
              required={true}
              name={"name"}
              label={"Name"}
            />
            <MultiSelect
              label={"Price"}
              name={"defaultValue"}
              objects={objects}
              selected={selected}
              setSelected={setSelected}
              defaultValue={defaultValue}
              setDefaultValue={setDefaultValue}
              viewRef={ref}
              getTitle={getMultiSelectTitle}
              search={{
                search: priceFilter,
                setSearch: setPriceFilter,
                onChange: onChange,
              }}
            >
              {Addprice}
            </MultiSelect>
            <div style={{ marginTop: "1em" }}>
              <Textbox label={"Description"} name={"description"} />
            </div>
            <div style={{ width: "100%", display: "flex", gap: "1em" }}>
              <Button title={"Create Product"} />
              <Button
                title={"Cancel"}
                style={{ background: "#ffffff3b" }}
                link={"/subscription/products"}
              />
            </div>
          </FormContainer>
        </form>
        <AnimatePresence>
          {addPrice && <AddPriceForm state={setAddPrice} />}
        </AnimatePresence>
      </div>
    </Body>
  );
};

export default CreateProductForm;
