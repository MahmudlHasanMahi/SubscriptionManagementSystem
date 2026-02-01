import styles from "./Navigation.module.css";
import LOGO from "../../Yasier.png";
import { useState, useRef, useCallback, useEffect, memo } from "react";
import Navbar from "./Navbar";
import Dashboard from "../../svg/Dashboard";
import Client from "../../svg/Client";
import Staff from "../../svg/Staff";
import Subscription from "../../svg/Subscription";
import { useSelector } from "react-redux";
import { user } from "../../Features/UserAuth/UserAuth";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { motion, useAnimation } from "framer-motion";
import { duration } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
function getOrSetLocal(key, defaultValue) {
  const stored = localStorage.getItem(key);

  if (stored !== null) {
    return JSON.parse(stored); // return existing value
  }

  // if missing → set and return default value
  localStorage.setItem(key, JSON.stringify(defaultValue));
  return defaultValue;
}
function setLocal(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

const Navigation = () => {
  const DEFAULT_WIDTH = parseInt(getOrSetLocal("navbarSize", 300));

  const userState = useSelector(user);
  const { t, i18n } = useTranslation();
  const controls = useAnimation();
  const navlist = [
    {
      title: t("Dashboard"),
      Logo: <Dashboard color={"white"} />,
      Logo: (
        <DashboardCustomizeRoundedIcon
          sx={{ color: "white" }}
          fontSize="large"
        />
      ),
      link: "/",
    },
    {
      title: t("Staff"),
      Logo: <Staff color={"white"} />,
      link: "/staff",
    },
    {
      title: t("Subscription"),
      Logo: <Subscription color={"white"} />,
      link: "/subscription",
    },
    { title: t("Client"), Logo: <Client color={"white"} />, link: "/client" },
    {
      title: t("Invoice"),
      Logo: <ReceiptIcon sx={{ color: "white" }} fontSize="large" />,
      link: "/invoice",
    },
  ];
  // const [collapse, setCollapse] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const boxRef = useRef(null);
  const isResizing = useRef(false);
  const initialX = useRef(0);
  const initialWidth = useRef(DEFAULT_WIDTH);

  useEffect(() => {
    if (DEFAULT_WIDTH === 0) setShowArrow(true);
    controls.set({ width: DEFAULT_WIDTH });
  }, []);

  const handleMouseMove = useCallback(
    debounce((e) => {
      const dir = i18n.dir() == "ltr" ? 1 : -1;
      if (isResizing.current) {
        const newWidth =
          initialWidth.current + (dir * e.clientX - initialX.current);
        if (newWidth > 400) {
          controls.set({ width: 400 });
          setLocal("navbarSize", 400);
        } else if (newWidth > 180) {
          setShowArrow(false);
          controls.set({ width: newWidth });
          setLocal("navbarSize", newWidth);
        } else {
          controls.set({ width: 0 });
          setLocal("navbarSize", 0);
          setShowArrow(true);
        }
      }
    }, 10),
    []
  );

  const handleMouseDown = (e) => {
    isResizing.current = true;
    const dir = i18n.dir() == "ltr" ? 1 : -1;
    initialX.current = e.clientX * dir;
    initialWidth.current = boxRef?.current?.offsetWidth;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    userState && (
      <div style={{ position: "relative" }}>
        {
          <motion.div
            className={styles["navigation"]}
            ref={boxRef}
            animate={controls}
          >
            <div className={styles["logoContainer"]}>
              <img src={LOGO} />
              <span>{t("Subscription Management System")}</span>
            </div>
            {/* <AnimatePresence> */}
            <Navbar
              isResizing={isResizing}
              list={navlist.filter(
                (val) =>
                  userState.groups == "Manager" ||
                  (userState.groups === "Employee" && val.title !== "Staff")
              )}
            />
            {/* </AnimatePresence> */}
            <div className={styles["copyright"]}>
              Copyright © 2025. All Rights Reserved
            </div>
            <div
              className={styles["resize"]}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            ></div>
          </motion.div>
        }

        {showArrow && (
          <span
            className={styles["expand"]}
            onClick={() => {
              controls.start({
                width: 300,
                transition: { duration: 0.2, ease: "easeIn" },
              });
              setLocal("navbarSize", 300);
              setShowArrow(false);

              // setWidth(DEFAULT_WIDTH);
            }}
          >
            <ArrowLeftIcon sx={{ fontSize: 40 }} />
          </span>
        )}
      </div>
    )
  );
};

export default Navigation;
