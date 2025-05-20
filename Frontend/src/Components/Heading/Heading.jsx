import styles from "./Heading.module.css";
import Profile from "./profile";
import TitleContainer from "./TitleContainer";

const Heading = () => {
  return (
    <div className={styles["heading"]}>
      <TitleContainer />
      <Profile />
    </div>
  );
};

export default Heading;
