import { API_ROOT } from "./enviroment";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
export const fetchStaff = async ({ pageParam, count }) => {
  try {
    const url = count ? `${API_ROOT}/user/staff-list?count=true` : pageParam;
    console.log(url);
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data;
  } catch (err) {}
};

export default fetchStaff;
