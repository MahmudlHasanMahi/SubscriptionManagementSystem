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
import { fetchStaff } from "../../Features/staff";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchStaff as fetchstaffutil } from "../../Utils/GetStaff";
const Staff = () => {
  const userState = useSelector(user);
  const dispatch = useDispatch();
  
  const queryObject = useInfiniteQuery({
    queryKey: ["staff/fetchStaff"],
    queryFn: fetchstaffutil,
    initialPageParam: `http://127.0.0.1:8000/user/staff-list?page=${btoa(
      null
    )}&page_size=${10}`,
    getNextPageParam: (props) => {
      return props.next;
    },
    staleTime: 20 * 1000,
  });

  useEffect(() => {
    dispatch(fetchStaff({ count: true }));
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
              queryObject={queryObject}
            />
          </div>
        </>
      )}
    </Body>
  );
};

export default Staff;
