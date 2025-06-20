import { useState } from "react";
import styles from "./TextFields.module.css";
import { notifyDefault } from "../../../Utils/nofify";
import { useDebouncedCallback } from "use-debounce";
import Label from "./Label";
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
  setinput = null,
  disabled = false,
  ref,
}) => {
  const [clipboard, setClipBoard] = useState(null);
  const [edit, setEdit] = useState(false);
  const onchange = useDebouncedCallback((value) => {
    setinput(value);
  }, 500);
  return (
    <div className={styles["textField"]}>
      <Label label={label} />
      <div
        style={{
          ...style,
          opacity: !edit && "0.7",
        }}
        className={styles["inputField"]}
        onDoubleClick={() => {
          if (editField) setEdit(true);
        }}
      >
        {setinput ? (
          <input
            ref={ref}
            disabled={disabled}
            onChange={(e) => onchange(e.target.value)}
            style={{
              cursor: disabled && "not-allowed",
              textAlign: !edit && editField && "center",
            }}
            type={type}
            name={name}
            required={required}
            placeholder={placeholder}
            defaultValue={value}
            readOnly={value && !edit ? true : false}
          />
        ) : (
          <input
            ref={ref}
            disabled={disabled}
            style={{
              cursor: disabled && "not-allowed",
              textAlign: !edit && editField && "center",
              cursor: !edit && "pointer",
            }}
            type={type}
            name={name}
            required={required}
            placeholder={placeholder}
            defaultValue={value}
            readOnly={value && !edit ? true : false}
          />
        )}
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
