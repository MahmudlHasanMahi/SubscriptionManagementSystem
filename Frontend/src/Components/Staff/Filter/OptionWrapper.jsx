import styles from "./Select.module.css";

const OptionWrapper = ({ setProperty, setShow, active, idx, option }) => {
  return (
    <div
      className={`${styles["optionContainer"]} ${
        active ? styles["active"] : styles["highlight"]
      }`}
      onClick={() => {
        setShow(false);
        setProperty(() => {
          if (active) {
            return { selected: null };
          }
          return { selected: idx };
        });
      }}
      key={idx}
    >
      {option}
    </div>
  );
};

export default OptionWrapper;
