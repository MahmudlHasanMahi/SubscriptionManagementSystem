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

  const filter_fields = ["name", "email", "mobile"];

  const staffList = useGetStaffListInfiniteQuery({
    page_size: 5,
    filter: input && {
      filterBy: filter_fields[filter.selected],
      data: input,
    },
    usertype: "client",
  });

  const tableConfig = {
    name: ["fields.name", "name"],
    email: ["fields.email", "email"],
    groups: ["fields.groups", "groups"],
    mobile: ["fields.mobile", "mobile"],
  };

  const fields2 = Object.fromEntries(
    filter_fields.map((key) => [
      key,
      staffList.data?.pages?.[0].results[0]?.fields[key],
    ]),
  );

  useEffect(() => {
    dispatch(fetchStaff({ count: true }));
    dispatch(
      updateHeaderState({
        title1: `Clients`,
        title2: "Create account for a new clients",
        logo: <Staff2 color={"#C759CF"} />,
      }),
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
            fields={fields2}
          />
          <div className={styles["tableContainer"]} setInput={setInput}>
            <Table
              color={"rgba(42, 51, 77, 1)"}
              title={"Client List"}
              endpont={{}}
              fields={tableConfig}
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
