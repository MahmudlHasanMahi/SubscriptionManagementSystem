import styles from "./Heading.module.css";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Dropdown from "./Dropdown";
import PIC from "../../Placeholder.png";
import Arrow from "../../svg/Arrow";
import { useSelector } from "react-redux";
import { user } from "../../Features/UserAuth/UserAuth";
const Profile = () => {
  const { name, groups } = useSelector(user);
  const [isClicked, setIsClicked] = useState(false);
  const toggleClick = (e) => {
    e.stopPropagation();
    setIsClicked((prev) => !prev);
  };

  return (
    <div
      className={styles["profile"]}
      tabIndex={0}
      onBlur={toggleClick}
      onClick={toggleClick}
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
