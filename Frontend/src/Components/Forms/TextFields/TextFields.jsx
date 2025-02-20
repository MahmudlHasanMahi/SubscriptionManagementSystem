import { useState } from "react";
import styles from "./TextFields.module.css";
import { notifyDefault } from "../../../Utils/nofify";
const TextFields = ({
  type,
  label,
  name,
  required = false,
  placeholder = "",
  style,
  value,
  icon,
  editField = false,
}) => {
  const [clipboard, setClipBoard] = useState(null);
  const [edit, setEdit] = useState(false);
  return (
    <div className={styles["textField"]}>
      <label htmlFor={type} value={label} className={styles["label"]}>
        {label}
      </label>
      <div
        style={style}
        className={styles["inputField"]}
        onDoubleClick={() => {
          if (editField) setEdit(true);
        }}
      >
        <input
          style={{ textAlign: !edit && editField && "center" }}
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={value}
          readOnly={value && !edit ? true : false}
        />
        {icon && (
          <span
            onClick={async () => {
              if (clipboard != value) {
                await navigator.clipboard.writeText(value).then(() => {
                  setClipBoard(value);
                  notifyDefault("Copied to clipboard", {
                    autoClose: 800,
                    closeOnClick: true,
                  });
                });
              }
            }}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextFields;
