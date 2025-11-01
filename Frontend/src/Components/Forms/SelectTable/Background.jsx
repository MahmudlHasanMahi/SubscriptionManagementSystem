import styles from "./SelectTable.module.css";
const Background = ({ children }) => {
  return <div className={styles["background"]}>{children}</div>;
};

export default Background;
