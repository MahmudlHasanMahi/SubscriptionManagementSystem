import getCookie from "./extractCSRFToken";
const getGroups = async () => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken"),
  };
  try {
    const res = await fetch("http://127.0.0.1:8000/user/groups", headers);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
export default getGroups;
