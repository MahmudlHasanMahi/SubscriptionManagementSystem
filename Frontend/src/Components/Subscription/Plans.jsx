import React from "react";
import Body from "../Body/Body";
import FormContainer from "../Forms/FormContainer/FormContainer";
import SubscriptionPanel from "./SubscriptionPanel";
import {
  subscriptionApi,
  useGetSubscriptionsInfiniteQuery,
} from "../../Features/Services/subscriptionApi";
import ActionButton from "../Table/ActionButton";
import Table from "../Table/Table";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../Features/headerState";
import { useEffect } from "react";
import Sub1 from "../../svg/sub1";
import zeropad from "../../Utils/zeropad";
const Plans = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Subscription`,
        title2: "View, search for and add new subscription",
        logo: <Sub1 />,
      })
    );
  }, []);
  const SubsctiptionObject = useGetSubscriptionsInfiniteQuery({
    page_size: 10,
  });
  const fields = {
    client: "client_detail.name",
    creator: "creator.name",
    begin: "begin",
    status: "status",
  };
  console.log(SubsctiptionObject);
  return (
    <div>
      <SubscriptionPanel
        numeric={zeropad(SubsctiptionObject.data?.pages[0].results.length)}
      />
      <br />

      <Table
        color={"rgba(24, 55, 73, 1)"}
        title={"Subscription List"}
        height={"50vh"}
        fields={fields}
        queryObject={SubsctiptionObject}
        actionButtons={[
          <ActionButton
            title={"Edit"}
            url={"/subscription/edit-subscription"}
          />,
          <ActionButton title={"Download Invoice"} url={"invoice"} />,
        ]}
      />
      <br /><br /><br />
    </div>
  );
};

export default Plans;
