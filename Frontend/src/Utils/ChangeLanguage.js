const changeDocumentDirection = (dir) => {
  document.dir = dir;
};

const ChangeLanguage = (language = "en") => {
  const html = document.documentElement;
  if (language === "ar") {
    changeDocumentDirection("rtl");
    localStorage.setItem("lang", "ar");
    html.setAttribute("lang", "ar");
  } else {
    changeDocumentDirection("ltr");
    localStorage.setItem("lang", language);
    html.setAttribute("lang", language);
  }
};

const setLanguage = () => {
  const lang = localStorage.getItem("lang") || "en";
  ChangeLanguage(lang);
};
const getLanguage = () => {
  return localStorage.getItem("lang") || "en";
};

export { ChangeLanguage, setLanguage, getLanguage };
