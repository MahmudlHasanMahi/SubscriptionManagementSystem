import React from "react";
import { useState } from "react";
import styles from "./TextFields.module.css";
import { notifyDefault } from "../../../Utils/nofify";
import { useDebouncedCallback } from "use-debounce";
import Label from "./Label";
const NumericInputField = ({
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
  handleInvalid = null,
  handleInput = null,
  onChange = null,
}) => {
  const [clipboard, setClipBoard] = useState(null);
  const [edit, setEdit] = useState(false);

  return (
    <div className={styles["textField"]}>
      <Label label={label} />
      <div
        style={{
          ...style,
          opacity: !edit && "0.7",
        }}
        className={styles["inputField"]}
      >
        <input
          onDoubleClick={() => {
            setEdit(true);
          }}
          ref={ref}
          disabled={disabled}
          onChange={onChange}
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
          onInvalid={handleInvalid}
          onInput={handleInput}
        />
      </div>
    </div>
  );
};

export default NumericInputField;
