import styles from "./TextFields.module.css";
import Label from "./Label";
import { useRef, useEffect, useState } from "react";
const Textbox = ({ label, name, value = null, onChange }) => {
  const [input, setInput] = useState(value);
  const [edit, setEdit] = useState(value && false);
  const ref = useRef();
  useEffect(() => {
    if (ref.current) ref.current.textContent = value;
  }, [value]);
  useEffect(() => {
    if (ref.current && !edit) {
      ref.current.textContent = input;
    }
  }, [input]);
  const onchange = (e) => {
    const text = e.target.textContent;
    setInput(text);
    onChange?.({
      target: {
        name,
        value: text,
      },
    });
  };

  const onDoubleClick = () => {
    setEdit(true);
  };
  return (
    <div className={styles["textBoxContainer"]}>
      <Label label={label} />
      {value ? (
        <>
          <input value={input} name={name} readOnly hidden />
          <div
            ref={ref}
            style={{ opacity: !edit && "0.7", cursor: !edit && "pointer" }}
            onDoubleClick={onDoubleClick}
            onInput={onchange}
            role="textbox"
            contentEditable={edit}
            className={styles["textBox"]}
          ></div>
        </>
      ) : (
        <>
          <input value={input} name={name} readOnly hidden />
          <span
            onInput={onchange}
            role="textbox"
            contentEditable
            className={styles["textBox"]}
          />
        </>
      )}
    </div>
  );
};

export default Textbox;
