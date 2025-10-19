import { motion } from "motion/react";
import styles from "./Heading.module.css";
import { useEffect, useState } from "react";
import { Signout } from "../../Features/UserAuth/UserAuth";
import { resetState } from "../../Features/UserAuth/UserAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeLanguage } from "../../Utils/ChangeLanguage";
const Dropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  const toggleLanguage = (e) => {
    // e.stopPropagation();
    const language = lang === "ar" ? "en" : "ar";
    ChangeLanguage(language);
    setLang(language);
  };
  const signOut = () => {
    dispatch(resetState());
    dispatch(Signout()).then(() => {
      queryClient.clear();
      navigate("/Signin");
    });
  };
  const profile = (e) => {
    e.stopPropagation();
    navigate("/profile");
  };
  return (
    <motion.div
      initial={{ y: -30, opacity: 0.3 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={styles["dropdown"]}
    >
      <div className={styles["language"]} onClick={toggleLanguage}>
        <span className={styles[lang == "en" ? "active" : "deactive"]}>
          English
        </span>
        <span className={styles[lang == "ar" ? "active" : "deactive"]}>
          عربي
        </span>
      </div>
      <div className={styles["account"]} onClick={profile}>
        Account
      </div>
      <div onClick={signOut}>Sign out</div>
    </motion.div>
  );
};

export default Dropdown;
