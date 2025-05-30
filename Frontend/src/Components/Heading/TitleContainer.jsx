import styles from "./Heading.module.css";
import { useSelector } from "react-redux";
const TitleContainer = () => {
  const state = useSelector((state) => state.headerState);
  return (
    <div className={styles["titleContainer"]}>
      <span>
        {state.logo}
        {state.title1}
      </span>
      <span>{state.title2}</span>
    </div>
  );
};

export default TitleContainer;
