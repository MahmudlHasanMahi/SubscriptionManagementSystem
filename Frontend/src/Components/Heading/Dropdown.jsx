import { resetState } from "../../Features/UserAuth/UserAuth";
import { Signout } from "../../Features/UserAuth/UserAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { useDispatch } from "react-redux";
import styles from "./Heading.module.css";
const Dropdown = ({ props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();

  const toggleLanguage = (e) => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    navigate(0);
  };
  const signOut = () => {
    dispatch(resetState());
    dispatch(Signout()).then(() => {
      queryClient.clear();
      navigate("/Signin");
    });
  };
  const profile = (e) => {
    navigate("/profile");
  };
  return (
    <motion.div
      initial={{ y: -30, opacity: 0.3 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={styles["dropdown"]}
      {...props}
    >
      <div className={styles["language"]} onClick={toggleLanguage}>
        <span className={styles[i18n.language == "en" ? "active" : "deactive"]}>
          English
        </span>
        <span className={styles[i18n.language == "ar" ? "active" : "deactive"]}>
          عربي
        </span>
      </div>
      <div className={styles["account"]} onClick={profile}>
        {t("Account")}
      </div>
      <div onClick={signOut}>{t("Sign out")}</div>
    </motion.div>
  );
};

export default Dropdown;
