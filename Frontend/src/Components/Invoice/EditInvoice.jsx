import { useEffect, useState, useRef } from "react";
import Body from "../Body/Body";
import { useParams } from "react-router-dom";
import FormContainer from "../Forms/FormContainer/FormContainer";
import {
  useGetInvoiceQuery,
  useEditInvoiceMutation,
  usePayInvoiceMutation,
  useFinalizeInvoiceMutation,
} from "../../Features/Services/InvoiceApi";
import { useGetProductListInfiniteQuery } from "../../Features/Services/productApi";
import InvoiceTable from "./InvoiceTable";
import TextFields from "../Forms/TextFields/TextFields";
import get from "lodash/get";
import DateField from "./DateField";
import Button from "../Forms/Buttons/Button";
import { notifySuccess, notifyError } from "../../Utils/nofify";
import { useNavigate } from "react-router-dom";
import DotMenu from "../Forms/EditSubscription/DotMenu";
import SelectOption from "../Staff/Filter/SelectOption";
import Menu from "../MultiSelect/Menu";
import EditIcon from "@mui/icons-material/Edit";
import useModal from "../Modal/useModal";
const EditInvoice = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const [products, setProducts] = useState([]);
  const invoiceObj = useGetInvoiceQuery(invoiceId);
  const [InvoiceMutation] = useEditInvoiceMutation();
  const [InvoicePay] = usePayInvoiceMutation();
  const [InvoiceFinalize] = useFinalizeInvoiceMutation();
  const [hasFieldChanged, setHasFieldChanged] = useState(false);
  const { showModal, openModal, closeModal, Modal } = useModal({
    custom: false,
  });

  const [date, setDate] = useState({
    due_date: null,
    finalize_date: null,
  });
  const planObj = useGetProductListInfiniteQuery({
    size: 3,
  });
  const invoiceDetailLength = invoiceObj.data?.invoice_detail.length;

  const status = invoiceObj.data?.status;

  const isDraft = status === "DRAFT";

  const disable =
    isDraft && (hasFieldChanged || products?.length > invoiceDetailLength);

  useEffect(() => {
    const obj = invoiceObj.data?.invoice_detail.map(
      ({ product, status, id, quantity, price }) => ({
        product,
        quantity,
        price,
      }),
    );
    setProducts(obj);
  }, [invoiceObj]);

  const onChangeDueDate = (date) => {
    setDate((prev) => ({
      ...prev,
      due_date: new Date(date),
    }));
    setHasFieldChanged(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    const obj = {
      id: invoiceId,
      ...Object.fromEntries(
        Object.entries(date)
          .filter(([_, v]) => v != null)
          .map(([k, v]) => [k, v instanceof Date ? v.toISOString() : v]),
      ),
      invoice_detail: products
        .splice(invoiceDetailLength)
        .map((invoice_detail) => ({
          product: invoice_detail.id,
          quantity: invoice_detail.quantity,
          price: invoice_detail.price.id,
        })),
    };

    try {
      const data = await InvoiceMutation(obj).unwrap();
      notifySuccess(data.detail);
      navigate("/invoice");
    } catch (err) {
      notifyError(err.data.detail);
    }
  };
  const pay = async () => {
    const result = await showModal();
    if (result) {
      try {
        const data = await InvoicePay(invoiceId).unwrap();
        notifySuccess(data.detail);
        navigate("/invoice");
      } catch (err) {
        notifyError(err.data.detail);
      }
    }
  };
  const finalize = async () => {
    const result = await showModal();
    if (result) {
      try {
        const data = await InvoiceFinalize(invoiceId).unwrap();
        notifySuccess(data.detail);
        navigate("/invoice");
      } catch (err) {
        notifyError(err.data.detail);
      }
    }
  };
  const optionStyles = {
    padding: "0.5em 1em",
    fontSize: "1em",
    textAlign: "center",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "1px",
    textWrap: "nowrap",
  };
  const icon = <EditIcon style={{ fontSize: "1.1em", margin: "0.4em" }} />;
  const DotMenuOptions = [
    <SelectOption
      onClick={finalize}
      style={{
        ...optionStyles,
        color: "grey",
        display: status == "DRAFT" ? "block" : "None",
      }}
      title={"Finalize invoice"}
    />,
    <SelectOption
      onClick={pay}
      style={{
        ...optionStyles,
        color: "green",
        display: status == "OPEN" || status == "Overdue" ? "block" : "None",
      }}
      title={"Mark as paid"}
    />,
  ];

  return (
    <Body>
      <Modal>
        <span>Are you sure you want to update invoice state ?</span>
      </Modal>
      <form onSubmit={submit}>
        <FormContainer title={"Edit Invoice"}>
          <div
            style={{
              position: "absolute",
              zIndex: "3",
              right: "2em",
              top: "1em",
            }}
          >
            <DotMenu icon={icon} disable={false}>
              <Menu left={-100}>{DotMenuOptions.map((menu) => menu)}</Menu>
            </DotMenu>
          </div>
          <TextFields
            type={"text"}
            name={"Client"}
            label={"Client"}
            style={{ width: "20em" }}
            value={get(invoiceObj.data, "client.name")}
          />
          <div style={{ width: "100%" }}>
            <InvoiceTable
              showAdd={disable}
              title={"Update Plans"}
              TableHeader={["Product Name", "Quantity", "Cost"]}
              selected={products}
              setSelected={setProducts}
              plans={planObj}
              initalLength={invoiceDetailLength}
            />
            <br />
          </div>
          {invoiceObj.data?.status && (
            <>
              <DateField
                label={"Due Date"}
                disable={!isDraft}
                defaultValue={new Date(invoiceObj.data.due_date)}
                onChange={onChangeDueDate}
              />
              <DateField
                label={"Finalize Date"}
                disable={!isDraft}
                defaultValue={new Date(invoiceObj.data.finalize_date)}
                disableDatesTill={new Date(date.due_date)}
                onChange={(date) => {
                  setDate((prev) => ({
                    ...prev,
                    finalize_date: new Date(date),
                  }));
                  setHasFieldChanged(false);
                }}
              />
            </>
          )}
          <br />
          <br />
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: "2%",
              marginTop: "5em",
            }}
          >
            <Button title={"Confirm changes"} disable={!disable} />
            <Button
              title={"Cancel"}
              link={"/invoice"}
              style={{ background: "#ffffff3b" }}
            />
          </div>
        </FormContainer>
      </form>
    </Body>
  );
};

export default EditInvoice;
