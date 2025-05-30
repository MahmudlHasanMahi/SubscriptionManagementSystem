import styles from "./Navigation.module.css";
import LOGO from "../../Yasier.png";
import React from "react";
import Navbar from "./Navbar";
import Dashboard from "../../svg/Dashboard";
import Client from "../../svg/Client";
import Staff from "../../svg/Staff";
import Subscription from "../../svg/Subscription";
import { useSelector } from "react-redux";
import { user } from "../../Features/UserAuth/UserAuth";
const Navigation = () => {
  const userState = useSelector(user);
  const navlist = [
    {
      title: "Dashboard",
      Logo: <Dashboard color={"white"} />,
      link: "dashboard",
    },
    { title: "Staff", Logo: <Staff color={"white"} />, link: "staff" },
    {
      title: "Subscription",
      Logo: <Subscription color={"white"} />,
      link: "subscription",
    },
    { title: "Client", Logo: <Client color={"white"} />, link: "client" },
  ];
  return (
    <div className={styles["navigation"]}>
      <div className={styles["logoContainer"]}>
        <img src={LOGO} />
        <span>Subscription Management System</span>
      </div>
      <Navbar
        list={navlist.filter(
          (val) => val.title != "Staff" || userState.group != "Employee"
        )}
      />
      <div className={styles["copyright"]}>
        Copyright © 2025 Yasier. All Rights Reserved
      </div>
    </div>
  );
};

export default Navigation;
