import { useEffect, useState } from "react";
import getCookie from "./extractCSRFToken";
import { API_ROOT } from "./enviroment";
const CSRFProtect = () => {
  const [CSRFToken, setCSRTToken] = useState("");

  useEffect(() => {
    const getCsrfToken = async () => {
      console.log(API_ROOT);
      try {
        fetch(`${API_ROOT}/user/getCSRFToken`).then(() => {
          setCSRTToken(getCookie("csrftoken"));
        });
      } catch (err) {}
    };
    getCsrfToken();
  }, []);
  return <input type="hidden" name="CSRFtoken" readOnly value={CSRFToken} />;
};

export default CSRFProtect;
