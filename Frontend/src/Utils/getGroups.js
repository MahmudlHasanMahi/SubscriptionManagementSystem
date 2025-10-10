import getCookie from "./extractCSRFToken";
import { API_ROOT } from "./enviroment";
const getGroups = async () => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken"),
  };
  try {
    const res = await fetch(`${API_ROOT}/user/groups`, headers);
    const data = await res.json();
    return data;
  } catch (err) {
  }
};
export default getGroups;
