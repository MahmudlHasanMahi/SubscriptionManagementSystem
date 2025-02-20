import { useEffect, useState } from "react";
import getCookie from "./extractCSRFToken";
const CSRFProtect = () => {
  const [CSRFToken, setCSRTToken] = useState("");

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        fetch("http://127.0.0.1:8000/user/getCSRFToken").then(() => {
          setCSRTToken(getCookie("csrftoken"));
        });
      } catch (err) {}
    };
    getCsrfToken();
  }, []);
  return <input type="hidden" name="CSRFtoken" readOnly value={CSRFToken} />;
};

export default CSRFProtect;
