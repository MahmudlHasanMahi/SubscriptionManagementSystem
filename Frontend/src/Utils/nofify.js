import { toast } from "react-toastify";

export const notifySuccess = (msg) => toast.success(msg);
export const notifyError = (msg) => toast.error(msg);
export const notifyDefault = (msg, props) => toast(msg, { ...props });
