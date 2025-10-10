import styles from "./Navigation.module.css";
import LOGO from "../../Yasier.png";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Dashboard from "../../svg/Dashboard";
import Client from "../../svg/Client";
import Staff from "../../svg/Staff";
import Subscription from "../../svg/Subscription";
import { useSelector } from "react-redux";
import { user } from "../../Features/UserAuth/UserAuth";
import { useNavigate } from "react-router-dom";
const Navigation = () => {
  const userState = useSelector(user);
  const navigate = useNavigate();
 
  const navlist = [
    {
      title: "Dashboard",
      Logo: <Dashboard color={"white"} />,
      link: "dashboard",
    },
    {
      title: "Staff",
      Logo: <Staff color={"white"} />,
      link: "staff",
    },
    {
      title: "Subscription",
      Logo: <Subscription color={"white"} />,
      link: "subscription",
    },
    { title: "Client", Logo: <Client color={"white"} />, link: "client" },
  ];
  return (
    userState && (
      <div className={styles["navigation"]}>
        <div className={styles["logoContainer"]}>
          <img src={LOGO} />
          <span>Subscription Management System</span>
        </div>
        <Navbar
          list={navlist.filter(
            (val) =>
              userState.groups == "Manager" ||
              (userState.groups === "Employee" && val.title !== "Staff")
          )}
        />
        <div className={styles["copyright"]}>
          Copyright © 2025. All Rights Reserved
        </div>
      </div>
    )
  );
};

export default Navigation;
