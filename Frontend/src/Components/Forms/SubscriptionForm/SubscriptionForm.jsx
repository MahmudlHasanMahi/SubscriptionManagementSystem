import { useEffect, useState, useRef } from "react";
import FormContainer from "../FormContainer/FormContainer";
import CSRFProtect from "../../../Utils/CSRFProtect";
import Body from "../../Body/Body";
import DateField from "../Date/DateField";
import SelectTable from "../SelectTable/SelectTable";
import { useGetProductListInfiniteQuery } from "../../../Features/Services/productApi";
import Button from "../Buttons/Button";
import { useCreateSubscriptionMutation } from "../../../Features/Services/subscriptionApi";
import { notifyError, notifySuccess } from "../../../Utils/nofify";
import ErrorToString from "../../../Utils/ErrorToString";
import { useNavigate } from "react-router-dom";
import ClientSelect from "./ClientSelect";
import { useGetClientListInfiniteQuery } from "../../../Features/Services/clientApi";
import { user } from "../../../Features/UserAuth/UserAuth";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Sub1 from "../../../svg/sub1";
import { updateHeaderState } from "../../../Features/headerState";
const SubscriptionForm = () => {
  const dispatch = useDispatch();
  const userState = useSelector(user);
  const [clientFilter, setClientFilter] = useState(null);
  const clients = useGetClientListInfiniteQuery({
    page_size: 3,
    filter: clientFilter && {
      filterBy: "name",
      data: clientFilter,
    },
  });
  const [client, setClient] = useState([]);
  const [planFilter, setPlanFilter] = useState(null);
  const [createSubscription, result] = useCreateSubscriptionMutation();
  const navigate = useNavigate();
  const objects = useGetProductListInfiniteQuery({
    size: 3,
    filter: planFilter,
  });

  const TableHeads = ["Product Name", "Quantity", "Cost"];
  const date = useRef();
  const [selected, setSelected] = useState([{}]);
  useEffect(() => {
    if (result.isUninitialized || result.isLoading) return;
    if (result.isSuccess) {
      notifySuccess(result.data.detail);
      navigate("/subscription", { replace: true });
    } else if (result.isError) {
      notifyError(ErrorToString(result));
    } else {
      notifyError(SOMETHING_WENT_WRONG);
    }
  }, [result.isLoading]);
  const onSubmit = (e) => {
    e.preventDefault();
    if (!selected[0].id) return notifyError("Please Select Plans");
    const plans = selected.map((plan) => ({
      product: plan.id,
      quantity: plan?.quantity ? plan.quantity : 1,
      price: plan.default_price.id,
    }));

    const obj = {
      client: client.id,
      subscription_plans: plans,
      created_by: userState?.id,
      begin: date.current.begin?.toISOString(),
      end: date.current.end?.toISOString(),
    };
    createSubscription(obj);
  };
  const isSamePeriod = selected.every(
    (item) => item.default_price?.period === selected[0]?.default_price?.period
  );

  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Subscription`,
        title2: "Create new subscription",
        logo: <Sub1 />,
      })
    );
  }, []);

  return (
    <Body>
      <form onSubmit={onSubmit}>
        <FormContainer
          title={"Create Subscription"}
          style={{ flexDirection: "column" }}
        >
          <CSRFProtect />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              gap: "5%",
            }}
          >
            <DateField
              disable={!isSamePeriod}
              date={date}
              period={parseInt(selected[0]?.default_price?.period)}
            />
            <ClientSelect
              objects={clients}
              selected={client}
              setSelected={setClient}
              clientFilter={clientFilter}
              setClientFilter={setClientFilter}
            />
          </div>

          <div
            style={{
              width: "100%",
            }}
          >
            <SelectTable
              title={"Plans"}
              TableHeader={TableHeads}
              plans={objects}
              planFilter={planFilter}
              setPlanFilter={setPlanFilter}
              selected={selected}
              setSelected={setSelected}
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
            <Button disable={!isSamePeriod} title={"Create Subscription"} />
            <Button
              title={"Cancel"}
              style={{ background: "#ffffff3b" }}
              link={"/subscription"}
            />
          </div>
        </FormContainer>
      </form>
    </Body>
  );
};

export default SubscriptionForm;
