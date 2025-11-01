import styles from "./Heading.module.css";
import { useState, useRef } from "react";
import { AnimatePresence } from "motion/react";
import Dropdown from "./Dropdown";
import PIC from "../../Placeholder.png";
import Arrow from "../../svg/Arrow";
import { useSelector } from "react-redux";
import { user } from "../../Features/UserAuth/UserAuth";
const Profile = () => {
  const ref = useRef(null);
  const { name, groups } = useSelector(user);
  const [isClicked, setIsClicked] = useState(false);
  const toggleClick = (e) => {
    setIsClicked((prev) => !prev);
  };

  return (
    <div
      className={styles["profile"]}
      onClick={toggleClick}
      onBlur={() => {
        setIsClicked(false);
      }}
      tabIndex={1}
    >
      <img src={PIC} />
      <div className={styles["userinfo"]}>
        <span>{name}</span>
        <span>{groups}</span>
      </div>
      <Arrow color={"white"} />
      <AnimatePresence>{isClicked && <Dropdown />}</AnimatePresence>
    </div>
  );
};

export default Profile;
