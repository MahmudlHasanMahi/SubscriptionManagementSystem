import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notifyDefault, notifyError } from "../Utils/nofify";
import { useParams } from "react-router-dom";
import { API_ROOT } from "../Utils/enviroment";
const Invoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    downloadInvoice(id, navigate);

    navigate(-1);
  }, []);
  return null;
};

export default Invoice;

const downloadInvoice = async (id) => {
  try {
    const response = await fetch(`${API_ROOT}/invoice/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      notifyError("invoice does not exists");
      throw new Error("Failed to fetch invoice");
    }
    notifyDefault("Please wait...");
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading invoice:", error);
  }
};
