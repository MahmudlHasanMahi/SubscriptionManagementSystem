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
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Subscription = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const routes = {
    services: "/subscription/products",
    plans: "/subscription",
    subscription: "/subscription/plans",
  };

  const matchRoute = (path) => {
    return !!matchPath(routes[path], location.pathname);
  };

  return (
    <Body>
      <div className={styles["cardRow"]}>
        <Card
          title1={t("Products")}
          title2={t("Create Product")}
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
          title1={t("Subscription")}
          title2={t("Create Subscription, Review Status")}
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
          title1={t("Subscription")}
          title2={t("Create Subscription")}
          logo={<Sub />}
          style={{
            background: "rgba(255, 119, 121, 0.4)",
            width: "30%",
            cursor: "pointer",
          }}
          // link={routes.subscription}
          highlight={matchRoute("subscription")}
        />
      </div>

      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 0.3 }}
        className={styles["outletContainer"]}
      >
        <Outlet />
      </motion.div>
    </Body>
  );
};

export default Subscription;
