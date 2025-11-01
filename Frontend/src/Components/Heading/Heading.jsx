import styles from "./Heading.module.css";
import Profile from "./Profile";
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
