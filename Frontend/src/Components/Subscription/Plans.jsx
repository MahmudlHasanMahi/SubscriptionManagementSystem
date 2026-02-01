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
import { useTranslation } from "react-i18next";
const Plans = () => {
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();
  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: t(`Subscription`),
        title2: t("View, search for and add new subscription"),
        logo: <Sub1 />,
      })
    );
  }, [i18n.language]);
  const SubsctiptionObject = useGetSubscriptionsInfiniteQuery({
    page_size: 10,
  });

  const tableConfig = {
    name: ["fields.begin", (data) => new Date(data.begin).toLocaleDateString()],
    email: ["fields.end", (data) => new Date(data.end).toLocaleDateString()],
    groups: ["fields.created_by", "creator.name"],
    client: ["fields.client", "client_detail.name"],
    status: ["status", "status"],
  };

  return (
    <div>
      <SubscriptionPanel
        numeric={SubsctiptionObject.data?.pages[0].results.length}
      />
      <br />

      <Table
        color={"rgba(24, 55, 73, 1)"}
        title={"Subscription List"}
        height={"50vh"}
        fields={tableConfig}
        queryObject={SubsctiptionObject}
        actionButtons={[
          <ActionButton
            title={"Edit"}
            url={"/subscription/edit-subscription"}
          />,
          <ActionButton title={"Download Invoice"} url={"invoice"} />,
        ]}
      />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Plans;
