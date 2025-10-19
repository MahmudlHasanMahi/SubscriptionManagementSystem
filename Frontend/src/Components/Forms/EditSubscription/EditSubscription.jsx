import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer/FormContainer";
import Body from "../../Body/Body";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../../Features/headerState";
import DateField from "../Date/DateField";
import { useGetSubscriptionQuery } from "../../../Features/Services/subscriptionApi";
import { useNavigate, useParams } from "react-router-dom";
import TextFields from "../TextFields/TextFields";
import get from "lodash/get";
import SelectTableContainer from "../SelectTable/SelectTableContainer";
import styles from "./EditSubscription.module.css";
import InputContainer from "../SelectTable/InputContainer";
import DotMenu from "./DotMenu";
import SelectOption from "../../Staff/Filter/SelectOption";
import Menu from "../../MultiSelect/Menu";
import EditIcon from "@mui/icons-material/Edit";
import { useGetProductListInfiniteQuery } from "../../../Features/Services/productApi";
import { useEditSubscriptionMutation } from "../../../Features/Services/subscriptionApi";
import Button from "../Buttons/Button";
import {
  border,
  display,
  fontSize,
  fontWeight,
  height,
  letterSpacing,
  padding,
  textAlign,
} from "@mui/system";
import EditSelectTable from "./EditSelectTable";
import { notifyError, notifySuccess } from "../../../Utils/nofify";
const EditSubscription = () => {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();
  const subscription = useGetSubscriptionQuery(subscriptionId);
  const [EditSubscription, result] = useEditSubscriptionMutation();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [sub, setSub] = useState();
  const planObjects = useGetProductListInfiniteQuery({
    size: 3,
  });
  useEffect(() => {
    if (subscription.data?.subscription_plans) {
      setSub(() => {
        const val = { ...subscription.data };
        delete val["subscription_plans"];
        return val;
      });
      const products = subscription.data?.subscription_plans.map(
        ({ product, status, id, quantity, price }) => ({
          ...product,
          status: status,
          subscription_plan_id: id,
          quantity: quantity,
          price: price,
        })
      );
      setPlans(products);
    }
  }, [subscription]);

  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Update Subscription`,
        title2: "Update account of staff",
        logo: null,
      })
    );
  }, []);

  useEffect(() => {
    if (result.isLoading) return;
    if (result.isSuccess) {
      notifySuccess(result?.data.detail);
      navigate("/subscription");
    } else if (result.isError) {
      notifyError(result.error?.data.detail);
      // navigate("/subscription/plans");
    }
  }, [result]);

  const submit = (e) => {
    e.preventDefault();
    const obj = {
      ...sub,
      subscription_plans: plans.map((data) => ({
        id: data.subscription_plan_id,
        product: data.id,
        price: data.price.id,
        status: data.status,
        quantity: data.quantity,
      })),
    };
    // console.log(obj);
    EditSubscription(obj);
  };
  const isSamePeriod = plans.every(({ default_price, price }) => {
    console.log(plans);
    return price?.period.days === plans[0]?.price.period.days;
  });

  const disabledFrom =
    subscription?.data?.status === "CANCELLED" ||
    subscription?.data?.status === "REJECTED";
  const icon = <EditIcon style={{ fontSize: "1.1em", margin: "0.4em" }} />;
  const optionStyles = {
    padding: "0.5em 1em",
    fontSize: "1em",
    textAlign: "center",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "1px",
    textWrap: "nowrap",
  };

  return (
    <Body>
      <form onSubmit={submit} style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            zIndex: "3",
            right: "2em",
            top: "1em",
          }}
        >
          <DotMenu icon={icon}>
            <Menu left={-150}>
              <SelectOption
                onClick={() => {
                  setSub((prev) => {
                    prev.status = "CANCELLED";
                    return prev;
                  });
                }}
                style={{ ...optionStyles, color: "red" }}
                title={"Cancel Subscription"}
              />
              <></>
            </Menu>
          </DotMenu>
        </div>
        <FormContainer
          title={"Edit Subscription"}
          isLoading={subscription.isLoading}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexGrow: "1",
              justifyContent: "space-between",
            }}
          >
            {subscription.data && (
              <DateField
                disable={true}
                beginDefault={subscription.data?.begin}
              />
            )}

            <TextFields
              type={"text"}
              name={"Client"}
              label={"Client"}
              style={{ width: "20em" }}
              value={get(subscription.data, "client_detail.name")}
            />
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            <EditSelectTable
              showAdd={!disabledFrom}
              title={"Update Plans"}
              TableHeader={["Product Name", "Quantity", "Cost"]}
              selected={plans}
              setSelected={setPlans}
              plans={planObjects}
              subscription={sub}
              initalLength={subscription.data?.subscription_plans.length}
            />
          </div>
          <div
            style={{
              marginBlock: "2em 1em",
              width: "100%",
              display: "flex",
              gap: "1em",
            }}
          >
            <Button
              title={"Confirm changes"}
              disable={!isSamePeriod || disabledFrom}
            />
            <Button
              title={"Cancel"}
              style={{ background: "#ffffff3b" }}
              link={"/subscription"}
            />
          </div>
        </FormContainer>
      </form>
      <br />
      <br />
      <br />
      <br />
    </Body>
  );
};

export default EditSubscription;
