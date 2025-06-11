const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
export const fetchStaff = async ({ pageParam, count }) => {
  try {
    const url = count
      ? "http://127.0.0.1:8000/user/staff-list?count=true"
      : pageParam;
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data;
  } catch (err) {}
};

export default fetchStaff;
