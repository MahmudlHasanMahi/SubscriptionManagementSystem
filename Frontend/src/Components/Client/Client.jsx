import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Body from "../Body/Body";
import { updateHeaderState } from "../../Features/headerState";
import { useDispatch } from "react-redux";
import ClientPanel from "./ClientPanel";
import Table from "../Table/Table";
import styles from "../Staff/Staff.module.css";
import { user } from "../../Features/UserAuth/UserAuth";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchStaff } from "../../Features/staff";
import useStaffQuery from "../../Hooks/useStaffQuery";
import Staff2 from "../../svg/Staff2";
import ActionButton from "../Table/ActionButton";
import { useGetStaffListInfiniteQuery } from "../../Features/Services/staffApi";
const Client = () => {
  const userState = useSelector(user);
  const dispatch = useDispatch();
  const [input, setInput] = useState(null);
  const [filter, setFilter] = useState({
    selected: null,
  });

  const fields = {
    name: "name",
    email: "email",
    mobile: "mobile",
  };

  const staffList = useGetStaffListInfiniteQuery({
    page_size: 5,
    filter: input && {
      filterBy: Object.values(fields)[filter.selected],
      data: input,
    },
    usertype: "client",
  });
  useEffect(() => {
    dispatch(fetchStaff({ count: true }));
    dispatch(
      updateHeaderState({
        title1: `Clients`,
        title2: "Create account for a new clients",
        logo: <Staff2 color={"#C759CF"} />,
      })
    );
  }, []);
  return (
    <Body>
      {userState.group == "Employee" ? (
        <Navigate to="/dashboard" />
      ) : (
        <>
          <ClientPanel
            filter={filter}
            setfilter={setFilter}
            setinput={setInput}
            fields={fields}
          />
          <div className={styles["tableContainer"]} setInput={setInput}>
            <Table
              color={"rgba(42, 51, 77, 1)"}
              title={"Client List"}
              endpont={{}}
              fields={fields}
              actionButton={<ActionButton title={"Edit"} url={"edit-staff/"} />}
              queryObject={staffList}
            />
          </div>
        </>
      )}
    </Body>
  );
};

export default Client;
