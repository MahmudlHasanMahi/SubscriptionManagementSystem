import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Body from "../Body/Body";
import { updateHeaderState } from "../../Features/headerState";
import { useDispatch } from "react-redux";
import StaffPanel from "./StaffPanel";
import Table from "../Table/Table";
import styles from "./Staff.module.css";
import { user } from "../../Features/UserAuth/UserAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchStaff } from "../../Features/staff";
import Staff2 from "../../svg/Staff2";
import ActionButton from "../Table/ActionButton";
import { useTranslation } from "react-i18next";
import { useGetStaffListInfiniteQuery } from "../../Features/Services/staffApi";

const Staff = () => {
  const { t, i18n } = useTranslation();
  const userState = useSelector(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState(null);
  const [filter, setFilter] = useState({
    selected: null,
  });

  // const fields2 = {
  //   name: "name",
  //   email: "email",
  //   mobile: "mobile",
  // };

  const filter_fields = ["name", "email", "mobile"];

  const staffList = useGetStaffListInfiniteQuery({
    page_size: 5,
    filter: input && {
      filterBy: filter_fields[filter?.selected],
      data: input,
    },
    usertype: "staff",
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
    ])
  );
  useEffect(() => {
    if (userState.groups === "Employee") {
      return navigate("/");
    }
    dispatch(fetchStaff({ count: true }));
    dispatch(
      updateHeaderState({
        title1: t("Staffs"),
        title2: t("Create account for a new staff"),
        logo: <Staff2 color={"#acc2ecff"} />,
      })
    );
  }, [i18n.language]);
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
            fields={fields2}
          />
          <div className={styles["tableContainer"]} setInput={setInput}>
            <Table
              color={"rgba(42, 51, 77, 1)"}
              title={"Staff List"}
              endpont={{}}
              fields={tableConfig}
              actionButtons={[
                <ActionButton title={"Edit"} url={"edit-staff/"} />,
              ]}
              queryObject={staffList}
            />
          </div>
        </>
      )}
    </Body>
  );
};

export default Staff;
