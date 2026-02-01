import { useEffect, useState } from "react";
import Body from "../Body/Body";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../Features/headerState";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InvoicePanel from "./InvoicePanel";
import Table from "../Table/Table";
import styles from "./Invoice.module.css";
import { useGetInvoicesInfiniteQuery } from "../../Features/Services/InvoiceApi";
import ActionButton from "../Table/ActionButton";
const Invoice = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState(null);
  const [filter, setFilter] = useState({
    selected: null,
  });

  const filter_fields = ["status"];

  const InvoiceObject = useGetInvoicesInfiniteQuery({
    page_size: 10,
    filter: {
      filterBy: filter_fields[filter?.selected],
      data: input,
    },
  });
  const [statusoption, setStatusOption] = useState(0);

  const tableConfig = {
    created: [
      "fields.created",
      (data) => new Date(data.created).toLocaleDateString(),
    ],
    due_date: [
      "fields.due_date",
      (data) => new Date(data.due_date).toLocaleDateString(),
    ],
    status: ["fields.status", "status"],
  };

  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Invoice`,
        title2: "View and update invoices",
        logo: <DescriptionOutlinedIcon fontSize="0.4em" />,
      }),
    );
  }, []);

  const statuses = [
    { title: "All" },
    { title: "Open" },
    { title: "Paid" },
    { title: "Overdue" },
    { title: "Draft" },
  ];

  const statusEvent = (id) => {
    setStatusOption(id);
    if (id !== 0) {
      setFilter({ selected: 0 });
      setInput(statuses[id].title.toUpperCase());
    } else {
      setFilter({ selected: null });
      setInput();
    }
  };

  return (
    <Body>
      <InvoicePanel />
      <div className={styles["status-options"]}>
        {statuses.map((status, id) => {
          return statusoption === id ? (
            <span
              key={id}
              onClick={() => {
                statusEvent(id);
              }}
              className={styles["highlight-option"]}
            >
              {status.title}
            </span>
          ) : (
            <span
              key={id}
              onClick={() => {
                statusEvent(id);
              }}
            >
              {status.title}
            </span>
          );
        })}
      </div>

      <div className={styles["tableContainer"]}>
        <Table
          color={"rgb(32,47,63)"}
          title={"Invoice List"}
          fields={tableConfig}
          actionButton={{}}
          queryObject={InvoiceObject}
          actionButtons={[
            <ActionButton title={"View more"} url={"/invoice/edit-invoice"} />,
          ]}
        />
      </div>
    </Body>
  );
};

export default Invoice;
