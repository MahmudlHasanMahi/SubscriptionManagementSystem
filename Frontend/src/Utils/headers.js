import i18n from "./i18n";
import getCookie from "./extractCSRFToken";
const getHeader = (csrfToken = false) => {
  return {
    Accept: "application/json",
    "Accept-language": i18n.language,
    "Content-Type": "application/json",
    ...(csrfToken ? { "X-CSRFToken": getCookie("csrftoken") } : {}),
  };
};
export { getHeader };
