const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
const products = async () => {
  try {
    const url = "http://127.0.0.1:8000/products";
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data;
  } catch (err) {}
};

const periods = async () => {
  try {
    const url = "http://127.0.0.1:8000/periods";
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data;
  } catch (err) {}
};

const priceList = async () => {
  try {
    const url = "http://127.0.0.1:8000/price-lists";
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data;
  } catch (err) {}
};
export { products, periods, priceList };
