import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../../Features/headerState";
import Services from "../../../svg/Services";
import Body from "../../Body/Body";
import FormContainer from "../FormContainer/FormContainer";
import TextFields from "../TextFields/TextFields";
import Button from "../Buttons/Button";
const CreateProductForm = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Product`,
        title2: "Create Product",
        logo: <Services />,
      })
    );
  }, []);
  const onSubmit = () => {};
  return (
    <Body>
      <form onSubmit={onSubmit}>
        <FormContainer title={"Create new products"}>
          <TextFields
            type={"text"}
            required={true}
            name={"name"}
            label={"Name"}
          />
          <TextFields
            type={"email"}
            required={true}
            name={"email"}
            label={"Email address"}
          />
          <TextFields
            type={"number"}
            required={true}
            name={"mobile"}
            label={"Phone number"}
          />

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
