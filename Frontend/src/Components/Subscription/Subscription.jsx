import React, { useEffect } from "react";
import Body from "../Body/Body";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../Features/headerState";
import styles from "./Subscription.module.css";
import Sub1 from "../../svg/sub1";
import Card from "../Card/Card";
import Services from "../../svg/Services";
import Subplan from "../../svg/Subplan";
import Sub from "../../svg/Sub";
import { matchPath, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Subscription = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const routes = {
    services: "/subscription/products",
    plans: "/subscription/plans",
    subscription: "/subscription",
  };
  const matchRoute = (path) => {
    return !!matchPath(routes[path], location.pathname);
  };
  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Subscription`,
        title2: "View, search for and add new subscription",
        logo: <Sub1 />,
      })
    );
  }, []);
  return (
    <Body>
      <div className={styles["cardRow"]}>
        <Card
          title1={"Products"}
          title2="Create Product"
          logo={<Services />}
          style={{
            background: "rgba(22, 161, 112, 0.4)",
            width: "30%",
            cursor: "pointer",
          }}
          link={routes.services}
          highlight={matchRoute("services")}
        />
        <Card
          title1={"Subscription Plan"}
          title2="Subscription Plan and Type"
          logo={<Subplan />}
          style={{
            background: "rgba(147, 126, 205, 0.4)",
            width: "30%",
            cursor: "pointer",
          }}
          link={routes.plans}
          highlight={matchRoute("plans")}
        />
        <Card
          title1={"Subscription"}
          title2="Create Subscription"
          logo={<Sub />}
          style={{
            background: "rgba(255, 119, 121, 0.4)",
            width: "30%",
            cursor: "pointer",
          }}
          link={routes.subscription}
          highlight={matchRoute("subscription")}
        />
      </div>
      <Outlet />
    </Body>
  );
};

export default Subscription;
