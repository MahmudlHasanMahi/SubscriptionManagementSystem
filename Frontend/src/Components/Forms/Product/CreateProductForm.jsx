import { useEffect, useState } from "react";
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
import { useGetPriceListQuery } from "../../../Features/Services/priceListApi";
import {
  notifyDefault,
  notifyError,
  notifySuccess,
} from "../../../Utils/nofify";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { SOMETHING_WENT_WRONG } from "../../../Utils/types";
import ErrorToString from "../../../Utils/ErrorToString";
const CreateProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const { data, error, isLoading } = useGetPriceListQuery();
  const [createProduct, result] = useCreateProductMutation();
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

  return (
    <Body>
      <form onSubmit={onSubmit}>
        <FormContainer
          title={"Create new products"}
          isLoading={isLoading || result.isLoading}
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
            objects={data}
            selected={selected}
            setSelected={setSelected}
            defaultValue={defaultValue}
            setDefaultValue={setDefaultValue}
          />
          <Textbox label={"Description"} name={"description"} />
          <Button title={"Create Product"} />
          <Button
            title={"Cancel"}
            style={{ background: "#ffffff3b" }}
            link={"/subscription/products"}
          />
        </FormContainer>
      </form>
    </Body>
  );
};

export default CreateProductForm;
