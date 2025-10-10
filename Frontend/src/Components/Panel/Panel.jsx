import styles from "./Panel.module.css";
const Panel = ({ children, style }) => {
  return (
    <div style={{ ...style }} className={styles["panel"]}>
      {children}
    </div>
  );
};

export default Panel;
