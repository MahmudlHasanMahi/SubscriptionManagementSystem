import { useState, useEffect } from "react";
import Body from "../Body/Body";
import FormContainer from "../Forms/FormContainer/FormContainer";
import { useGetClientListInfiniteQuery } from "../../Features/Services/clientApi";
import { useGetProductListInfiniteQuery } from "../../Features/Services/productApi";
import { useCreateInoviceMutation } from "../../Features/Services/InvoiceApi";
import ClientSelect from "../Forms/SubscriptionForm/ClientSelect";
import DateField from "./DateField";
import styles from "../Modal/Modal.module.css";
import SelectTable from "../Forms/SelectTable/SelectTable";
import Button from "../Forms/Buttons/Button";
import { notifySuccess, notifyError } from "../../Utils/nofify";
import { SOMETHING_WENT_WRONG } from "../../Utils/types";
import ErrorToString from "../../Utils/ErrorToString";
import { useNavigate } from "react-router-dom";
import useModal from "../Modal/useModal";
const CreateInvoice = () => {
  const { showModal, openModal, closeModal, Modal } = useModal({
    custom: true,
  });

  const navigate = useNavigate();
  const [CreateInvoice, result] = useCreateInoviceMutation();
  const [clientFilter, setClientFilter] = useState(null);
  const clients = useGetClientListInfiniteQuery({
    page_size: 3,
    filter: clientFilter && {
      filterBy: "name",
      data: clientFilter,
    },
  });
  const [client, setClient] = useState([]);

  const TableHeads = ["Product Name", "Quantity", "Cost"];

  const [planFilter, setPlanFilter] = useState(null);
  const [selected, setSelected] = useState([{}]);
  const objects = useGetProductListInfiniteQuery({
    size: 3,
    filter: planFilter,
  });
  const [date, setDate] = useState({
    due_date: null,
    finalize_date: null,
  });

  useEffect(() => {
    if (result.isUninitialized || result.isLoading) return;
    if (result.isSuccess) {
      notifySuccess(result.data.detail);
      navigate("/invoice", { replace: true });
    } else if (result.isError) {
      notifyError(ErrorToString(result));
    } else {
      notifyError(SOMETHING_WENT_WRONG);
    }
  }, [result.isLoading]);

  const period = selected[0]?.default_price?.period.days;
  const isSamePeriod = selected.every(
    (item) =>
      item.default_price?.period.id === selected[0]?.default_price?.period.id,
  );

  const disableForm = !isSamePeriod || Object.keys(selected[0]).length === 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await showModal();
    if (result === null) return;

    const plans = selected.map((plan) => ({
      product: plan.id,
      quantity: plan?.quantity ? plan.quantity : 1,
      price: plan.default_price.id,
    }));
    const obj = {
      notify: result,
      client: client.id,
      ...date,
      invoice_detail: plans,
    };
    CreateInvoice(obj);
  };

  const onChangeDueDate = (date) => {
    setDate((prev) => ({
      ...prev,
      due_date: new Date(date),
    }));
  };
  const total = selected.reduce(
    (sum, item) => sum + (item.default_price?.price * item.quantity || 0),
    0,
  );
  return (
    <Body>
      <Modal>
        <div>
          <span>
            Review {total} invoice for {client.name}
          </span>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <div className={styles["btn-wrapper"]}>
            <button
              onClick={() => {
                closeModal(false);
              }}
            >
              Create Only
            </button>
            <button
              onClick={() => {
                closeModal(true);
              }}
            >
              Create & Notify
            </button>
          </div>
        </div>
      </Modal>
      <form onSubmit={onSubmit}>
        <FormContainer title={"Create Invoice"}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              gap: "5%",
              height: "5em",
            }}
          >
            <ClientSelect
              objects={clients}
              selected={client}
              setSelected={setClient}
              clientFilter={clientFilter}
              setClientFilter={setClientFilter}
            />
          </div>
          <div
            style={{
              width: "100%",
              marginBottom: "1em",
            }}
          >
            <SelectTable
              title={"Plans"}
              TableHeader={TableHeads}
              plans={objects}
              planFilter={planFilter}
              setPlanFilter={setPlanFilter}
              selected={selected}
              setSelected={setSelected}
            />
          </div>

          <DateField
            label={"Due Date"}
            disable={disableForm}
            defaultValue={new Date()}
            onChange={onChangeDueDate}
          />
          <DateField
            label={"Finalize Date"}
            disable={disableForm}
            defaultValue={new Date()}
            disableDatesTill={new Date(date.due_date)}
            onChange={(date) => {
              setDate((prev) => ({
                ...prev,
                finalize_date: new Date(date),
              }));
            }}
          />

          <div style={{ height: "5em" }}></div>
          <div style={{ display: "flex", width: "100%", gap: "2%" }}>
            <Button title={"Create"} disable={disableForm || !client.id} />
            <Button
              title={"Cancel"}
              style={{ background: "#ffffff3b" }}
              link={"/invoice"}
            />
          </div>
        </FormContainer>
      </form>
    </Body>
  );
};

export default CreateInvoice;
