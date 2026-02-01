import { useEffect, useRef, useState } from "react";
import FormContainer from "../FormContainer/FormContainer";
import Body from "../../Body/Body";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../../Features/headerState";
import DateField from "../Date/DateField";
import { useGetSubscriptionQuery } from "../../../Features/Services/subscriptionApi";
import { useNavigate, useParams } from "react-router-dom";
import TextFields from "../TextFields/TextFields";
import get from "lodash/get";
import DotMenu from "./DotMenu";
import SelectOption from "../../Staff/Filter/SelectOption";
import Menu from "../../MultiSelect/Menu";
import EditIcon from "@mui/icons-material/Edit";
import { useGetProductListInfiniteQuery } from "../../../Features/Services/productApi";
import {
  useEditSubscriptionMutation,
  useCancelSubscriptionMutation,
} from "../../../Features/Services/subscriptionApi";
import Button from "../Buttons/Button";
import EditSelectTable from "./EditSelectTable";
import { notifyError, notifySuccess } from "../../../Utils/nofify";
import useModal from "../../Modal/useModal";
import styles from "./EditSubscription.module.css";
const EditSubscription = () => {
  const navigate = useNavigate();
  const [CancelSubscription] = useCancelSubscriptionMutation();
  const [sub, setSub] = useState();
  const [plans, setPlans] = useState([]);
  const { subscriptionId } = useParams();
  const subscription = useGetSubscriptionQuery(subscriptionId);
  const [EditSubscription] = useEditSubscriptionMutation();
  const dispatch = useDispatch();
  const dateRef = useRef({ begin: null, end: null });
  const planObjects = useGetProductListInfiniteQuery({
    size: 3,
  });

  const { showModal, openModal, closeModal, Modal } = useModal({
    custom: false,
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
        }),
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
      }),
    );
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const obj = {
      ...sub,
      ...(dateRef.current.begin && {
        begin: dateRef.current.begin.toISOString(),
      }),
      ...(dateRef.current.end && {
        end: dateRef.current.end.toISOString(),
      }),

      subscription_plans: plans.map((data) => ({
        id: data.subscription_plan_id,
        product: data.id,
        price: data.price.id,
        status: data.status,
        quantity: data.quantity,
      })),
    };
    // return;
    try {
      const data = await EditSubscription(obj).unwrap();
      notifySuccess(data.detail);
      navigate("/subscription");
    } catch (err) {
      notifyError(err.data.detail);
    }
  };

  const disabledFrom =
    subscription?.data?.status === "CANCELLED" ||
    subscription?.data?.status === "REJECTED" ||
    subscription?.data?.status === "EXPIRED";

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

  const isSamePeriod = plans.every(({ default_price, price }) => {
    return price?.period.days === plans[0]?.price.period.days;
  });

  const canEditDate = () => {
    const status = sub?.["status"];
    const allowed_status = ["SCHEDULED", "PENDING"];
    return allowed_status.includes(status) && isSamePeriod;
  };

  const cancelSubscription = async () => {
    const result = await showModal();
    if (result) {
      try {
        const data = await CancelSubscription(sub.id).unwrap();
        notifySuccess(data.detail);
        navigate("/subscription");
      } catch (err) {
        notifyError(err.data.detail);
      }
    }
  };

  return (
    <Body>
      <Modal>
        <div className={styles["modalTitle"]}>
          <span>Are you sure you want to cancel this subscription ?</span>
          <br />
          <ul>
            <li>
              * Lorem labore ipsum sit amet consectetur, adipisicing elit.
              Maxime, labore?
            </li>
            <li>
              * Lorem sit dolor sit amet consectetur adipisicing elit. Nam.
            </li>
            <li>
              * Lorem dolor dolor sit amet consectetur, adipisicing elit. Atque
            </li>
          </ul>
        </div>
      </Modal>
      <form onSubmit={submit} style={{ position: "relative" }}>
        <FormContainer
          title={"Edit Subscription"}
          isLoading={subscription.isLoading}
        >
          <div
            style={{
              position: "absolute",
              zIndex: "3",
              right: "2em",
              top: "1em",
            }}
          >
            <DotMenu icon={icon} disable={disabledFrom}>
              <Menu left={-150}>
                <SelectOption
                  onClick={cancelSubscription}
                  style={{ ...optionStyles, color: "red" }}
                  title={"Cancel Subscription"}
                />
                <></>
              </Menu>
            </DotMenu>
          </div>
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
                dateRef={dateRef}
                disable={!canEditDate()}
                defaultCycle={subscription.data?.cycle}
                beginDefault={subscription.data?.begin}
                endDateDefault={subscription.data?.end}
                period={parseInt(plans[0]?.price.period.days)}
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
