import React, { useEffect } from "react";
import styles from "./Loading.module.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoading, user } from "../../Features/UserAuth/UserAuth";
const Loading = () => {
  const Loading = useSelector(isLoading);

  return Loading ? (
    <div className={styles["loading"]}>
      <div>
        <div>
          <div className={styles["bob"]}></div>
        </div>
      </div>
    </div>
  ) : (
    <Outlet />
  );
};

export default Loading;
