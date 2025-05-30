import { useCallback, useEffect, useMemo, useState } from "react";
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
import useStaffQuery from "../../Hooks/useStaffQuery";
import Staff2 from "../../svg/Staff2";
const Staff = () => {
  const userState = useSelector(user);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState({
    selected: null,
  });

  const fieldnames = ["name", "email", "groups", "mobile"];
  const staffObject = useStaffQuery({
    filterby: fieldnames[filter.selected],
    data: input,
  });
  useEffect(() => {
    dispatch(fetchStaff({ count: true }));
    dispatch(
      updateHeaderState({
        title1: `All Staff`,
        title2: "Create account for a new staff",
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
          <StaffPanel
            filter={filter}
            setfilter={setFilter}
            setinput={setInput}
            fieldnames={fieldnames}
          />
          <div className={styles["tableContainer"]} setInput={setInput}>
            <Table
              header={["S/N", "name", "email", "group", "mobile"]}
              key_pair={fieldnames}
              title={"Staff List"}
              endpont={{}}
              // limit={{}}
              // url={{}}
              action={true}
              queryObject={staffObject}
            />
          </div>
        </>
      )}
    </Body>
  );
};

export default Staff;
