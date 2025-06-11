import React from "react";
import styles from "./Table.module.css";
import { useNavigate } from "react-router-dom";
const ActionButton = ({ title, pk }) => {
  const navigate = useNavigate();
  const actionClick = () => {
    navigate(`edit-staff/${pk}`);
  };

  return (
    <td className={styles["action"]} onClick={actionClick}>
      <div>{title}</div>
    </td>
  );
};

export default ActionButton;
