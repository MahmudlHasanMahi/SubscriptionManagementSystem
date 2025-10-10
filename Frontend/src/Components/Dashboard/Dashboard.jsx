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
import { useGetStaffListInfiniteQuery } from "../../Features/Services/staffApi";
import {
  useGetSubscriptionsInfiniteQuery,
  useGetSubscriptionApprovalsQuery,
  useApproveSubscriptionMutation,
  useRejectSubscriptionMutation,
} from "../../Features/Services/subscriptionApi";
import ActionButton from "../Table/ActionButton";
import { notifySuccess } from "../../Utils/nofify";
import zeropad from "../../Utils/zeropad";
const Dashboard = () => {
  const dispatch = useDispatch();
  const staff = useSelector(staffState);
  const { name, groups } = useSelector(user);
  const staffList = useGetStaffListInfiniteQuery({
    page_size: 5,
  });

  const unApprovedSubscription = useGetSubscriptionApprovalsQuery();
  const [approveSubscription, approvedResult] =
    useApproveSubscriptionMutation();
  const [rejectSubscription, rejectResult] = useRejectSubscriptionMutation();
  const subscription = useGetSubscriptionsInfiniteQuery({ size: 1 });
  const fields = {
    name: "name",
    email: "email",
    groups: "groups",
    mobile: "mobile",
  };
  const fields2 = {
    ["staff name"]: "creator.name",
    email: "creator.email",
    ["client name"]: "client_detail.name",
    ["client email"]: "client_detail.email",
  };

  const formatDate = () => {
    const today = new Date();

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[today.getDay()];
    const date = today.getDate();
    const monthName = months[today.getMonth()];
    const year = today.getFullYear();

    // Add suffix for date (st, nd, rd, th)
    function ordinal(n) {
      if (n > 3 && n < 21) return n + "th";
      switch (n % 10) {
        case 1:
          return n + "st";
        case 2:
          return n + "nd";
        case 3:
          return n + "rd";
        default:
          return n + "th";
      }
    }

    return `Today is ${dayName}, ${ordinal(date)} ${monthName} ${year}.`;
  };

  useEffect(() => {
    dispatch(fetchStaff({ count: true }));
    dispatch(
      updateHeaderState({
        title1: `Welcome, ${name} 👋`,
        title2: formatDate(),
        logo: null,
      })
    );
  }, []);

  const approve = (pk) => {
    approveSubscription(pk).then(() => {
      notifySuccess("Approved");
    });
  };
  const reject = (pk) => {
    rejectSubscription(pk).then(() => {
      notifySuccess("Rejected");
    });
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
            title1={zeropad(subscription?.data?.pages[0].results.length)}
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
            title1={zeropad(unApprovedSubscription.data?.length)}
            title2="Subscription Pending Approval"
            logo={<Recipt color={"#9C4C0B"} />}
            style={{ background: "rgba(22, 115, 161, 0.4)" }}
          />
        </div>
        {groups === "Manager" && (
          <div
            style={{
              height: "20em",
              marginBlock: "2em",
            }}
          >
            <Table
              color={"rgb(18,54,73)"}
              title={"Unapproved Subscriptions"}
              queryObject={unApprovedSubscription}
              actionButtons={[
                <ActionButton title={"Approve"} event={approve} />,
                <ActionButton title={"Reject"} event={reject} />,
              ]}
              fields={fields2}
            />
          </div>
        )}
        {groups == "Manager" && (
          <div className={styles["tables"]}>
            <Table
              color={"rgb(18,54,73)"}
              title={"Staff List"}
              queryObject={staffList}
              fields={fields}
            />
            <Table
              color={"rgb(18,54,73)"}
              title={"Staff List"}
              queryObject={staffList}
              fields={fields}
            />
          </div>
        )}
      </div>
    </Body>
  );
};

export default Dashboard;
