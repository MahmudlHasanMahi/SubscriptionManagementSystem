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
import ActionButton from "../Table/ActionButton";
const Staff = () => {
  const userState = useSelector(user);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState({
    selected: null,
  });

  const fields = {
    name: "name",
    email: "email",
    groups: "groups",
    mobile: "mobile",
  };
  const staffObject = useStaffQuery({
    filterby: Object.values(fields)[filter.selected],
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
            fields={fields}
          />
          <div className={styles["tableContainer"]} setInput={setInput}>
            <Table
              title={"Staff List"}
              endpont={{}}
              fields={fields}
              actionButton={<ActionButton title={"Edit"} url={"edit-staff/"} />}
              queryObject={staffObject}
            />
          </div>
        </>
      )}
    </Body>
  );
};

export default Staff;
