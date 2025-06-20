import React, { useEffect } from "react";

const setDefault = (children, object, setDefault, name, onChange) => {
  return React.cloneElement(children, {
    key: object.id,

    onClick: () => {
      onChange?.({
        target: {
          name,
          value: object.id,
        },
      });
      setDefault(object);
    },
  });
};

export default setDefault;
