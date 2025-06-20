import styles from "./MultiSelect.module.css";
const Menu = ({ children, width, left, right, top, bottom }) => {
  return (
    <div
      style={{
        width: width,
        left: left,
        right: right,
        top: top,
        bottom: bottom,
      }}
      className={styles["menu"]}
    >
      {children.map((obj, idx) => {
        return (
          <div key={idx} className={styles["highlight"]}>
            {obj}
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
