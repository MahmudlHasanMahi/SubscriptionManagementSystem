const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
import { API_ROOT } from "./enviroment";
const products = async () => {
  try {
    const url = `${API_ROOT}/products`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data;
  } catch (err) {}
};

const periods = async () => {
  try {
    const url = `${API_ROOT}/periods`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data;
  } catch (err) {}
};

const priceList = async ({ pageParam }) => {
  console.log(pageParam)
  try {
    const url = pageParam;
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data;
  } catch (err) {}
};
export { products, periods, priceList };
