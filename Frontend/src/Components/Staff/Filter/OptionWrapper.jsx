import styles from "./Select.module.css";

const OptionWrapper = ({ setProperty, active, idx, option }) => {
  return (
    <div
      className={`${styles["optionContainer"]} ${active && styles["active"]}`}
      onClick={() => {
        setProperty(() => {
          if (active) {
            return { show: false, selected: null };
          }
          return { show: false, selected: idx };
        });
      }}
      key={idx}
    >
      {option}
    </div>
  );
};

export default OptionWrapper;
