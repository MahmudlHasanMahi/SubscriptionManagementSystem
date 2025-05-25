import getCookie from "./extractCSRFToken";
import { notifyError, notifySuccess } from "./nofify";
import {
  USER_CREATED,
  SOMETHING_WENT_WRONG,
  USER_EXIST,
  INVALID_GROUP,
} from "./types";

const createStaff = async (body) => {
  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    };
    const res = await fetch("http://127.0.0.1:8000/user/create-staff", {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res.ok) {
  
      return notifySuccess(USER_CREATED);
    } else if (res.status == 409) {
      return notifyError(USER_EXIST);
    } else if (res.status == 400) {
      return notifyError(INVALID_GROUP);
    }
    return notifyError(SOMETHING_WENT_WRONG);
  } catch (err) {
    return notifyError(SOMETHING_WENT_WRONG);
  }
};

export default createStaff;
