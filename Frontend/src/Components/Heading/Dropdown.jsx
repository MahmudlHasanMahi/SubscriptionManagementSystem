import { motion } from "motion/react";
import styles from "./Heading.module.css";
import { useEffect, useState } from "react";
import { Signout } from "../../Features/UserAuth/UserAuth";
import { resetState } from "../../Features/UserAuth/UserAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
const Dropdown = () => {
  const [language, setLanguage] = useState("en");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (language == "en") {
      document.dir = "ltr";
    } else {
      document.dir = "rtl";
    }
  }, [language]);

  const signOut = () => {
    dispatch(resetState());
    dispatch(Signout()).then(() => {
      queryClient.clear();
      navigate("/Signin");
    });
  };
  const profile = () => {
    navigate("/profile");
  };
  return (
    <motion.div
      initial={{ y: -30, opacity: 0.3 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={styles["dropdown"]}
    >
      <div className={styles["language"]}>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setLanguage("en");
          }}
          className={styles[language == "en" ? "active" : "deactive"]}
        >
          English
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setLanguage("ar");
          }}
          className={styles[language == "ar" ? "active" : "deactive"]}
        >
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
