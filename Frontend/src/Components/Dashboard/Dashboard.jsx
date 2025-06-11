import { useEffect } from "react";
import Body from "../Body/Body";
import styles from "./Dashboard.module.css";
import Card from "../Card/Card";
import Staff2 from "../../svg/Staff2";
import Recipt from "../../svg/Recipt";
import Subscription2 from "../../svg/Subscription2";
import Client from "../../svg/Client";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff, staffState } from "../../Features/staff";
import { user } from "../../Features/UserAuth/UserAuth";
import { updateHeaderState } from "../../Features/headerState";
import useStaffQuery from "../../Hooks/useStaffQuery";
import Table from "../Table/Table";
const Dashboard = () => {
  const dispatch = useDispatch();
  const staff = useSelector(staffState);
  const { name } = useSelector(user);
  const staffObject = useStaffQuery({});
  useEffect(() => {
    dispatch(fetchStaff({ count: true }));

    dispatch(
      updateHeaderState({
        title1: `Welcome, ${name} 👋`,
        title2: "Today is Saturday, 11th November 2022.",
        logo: null,
      })
    );
  }, []);
  const fields = {
    name: "name",
    email: "email",
    groups: "groups",
    mobile: "mobile",
  };
  return (
    <Body>
      <div className={styles["cardContainer"]}>
        <div className={styles["cardRow"]}>
          <Card
            title1={staff.staffState?.count}
            title2="Total number of staff"
            style={{ background: "rgba(22, 115, 161, 0.4)" }}
            logo={<Staff2 color={"#67006E"} />}
          />
          <Card
            title1="200"
            title2="Total Subscription"
            logo={<Subscription2 color={"#352AAC"} />}
            style={{ background: "rgba(22, 115, 161, 0.4)" }}
          />
          <Card
            title1="200"
            title2="Total Client"
            logo={<Client color={"#8C2D56"} />}
            style={{ background: "rgba(22, 115, 161, 0.4)" }}
          />
          <Card
            title1="200"
            title2="Subscription Pending Approval"
            logo={<Recipt color={"#9C4C0B"} />}
            style={{ background: "rgba(22, 115, 161, 0.4)" }}
          />
        </div>
        <div className={styles["tables"]}>
          <Table
            title={"Staff List"}
            queryObject={staffObject}
            fields={fields}
          />
          <Table
            title={"Staff List"}
            queryObject={staffObject}
            fields={fields}
          />
        </div>
      </div>
    </Body>
  );
};

export default Dashboard;
