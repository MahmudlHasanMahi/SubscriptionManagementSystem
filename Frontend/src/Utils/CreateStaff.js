import getCookie from "./extractCSRFToken";
import { notifyError, notifySuccess } from "./nofify";
import {
  USER_CREATED,
  SOMETHING_WENT_WRONG,
  USER_EXIST,
  INVALID_GROUP,
} from "./types";
import ErrorToString from "./ErrorToString";
import { API_ROOT } from "./enviroment";
const createStaff = async (body) => {
  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    };
    const res = await fetch(`${API_ROOT}/user/staff`, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res.ok) {
      return notifySuccess(USER_CREATED);
    } else {
      const data = await res.json();
      notifyError(ErrorToString({ error: { data: data } }));
    }
  } catch (err) {
    return notifyError(SOMETHING_WENT_WRONG);
  }
};

export default createStaff;
