import { motion } from "motion/react";
import styles from "./Heading.module.css";
import { useEffect, useState } from "react";
import { Signout } from "../../Features/UserAuth/UserAuth";
import { resetState } from "../../Features/UserAuth/UserAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
const Dropdown = () => {
  const [dir, setDir] = useState("ltr");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.dir = dir;
  }, [dir]);

  const toggleLanguage = (e) => {
    e.stopPropagation();
    if (dir == "ltr") {
      setDir("rtl");
    } else {
      setDir("ltr");
    }
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
      <div tabIndex={1} className={styles["language"]} onClick={toggleLanguage}>
        <span className={styles[dir == "ltr" ? "active" : "deactive"]}>
          English
        </span>
        <span className={styles[dir == "rtl" ? "active" : "deactive"]}>
          عربي
        </span>
      </div>
      <div tabIndex={2} className={styles["account"]} onClick={profile}>
        Account
      </div>
      <div tabIndex={3} onClick={signOut}>
        Sign out
      </div>
    </motion.div>
  );
};

export default Dropdown;
