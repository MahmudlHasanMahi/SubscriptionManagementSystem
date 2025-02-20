import React, { useEffect, useCallback } from "react";
import Body from "../Body/Body";
import { updateHeaderState } from "../../Features/headerState";
import { useDispatch } from "react-redux";
import StaffPanel from "./StaffPanel";
import Table from "../Table/Table";
import styles from "./Staff.module.css";
import { user } from "../../Features/UserAuth/UserAuth";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Staff = () => {
  const userState = useSelector(user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `All Staff`,
        title2: "Create account for a new staff",
        logo: null,
      })
    );
  }, []);
  return (
    <Body>
      {userState.group == "Employee" ? (
        <Navigate to="/dashboard" />
      ) : (
        <>
          <StaffPanel />
          <div className={styles["tableContainer"]}>
            <Table
              header={["S/N", "name", "email", "group", "mobile"]}
              key_pair={["name", "email", "group", "mobile"]}
              title={"Staff List"}
              endpont={{}}
              // limit={{}}
              // url={{}}
              action={true}
            />
          </div>
        </>
      )}
    </Body>
  );
};

export default Staff;
