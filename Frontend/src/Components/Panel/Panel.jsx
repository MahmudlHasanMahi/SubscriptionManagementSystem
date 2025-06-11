import styles from "./Panel.module.css";
const Panel = ({ children, backgroud_color = null }) => {
  return (
    <div
      style={{
        backgroundColor: backgroud_color,
      }}
      className={styles["panel"]}
    >
      {children}
    </div>
  );
};

export default Panel;
