import style from "./outline.module.css";
const InputOutline = ({ children }) => {
  return <div className={style.outline}>{children}</div>;
};

export default InputOutline;
