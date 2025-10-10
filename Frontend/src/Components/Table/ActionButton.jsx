import styles from "./Table.module.css";
import { useNavigate } from "react-router-dom";
const ActionButton = ({ url = null, title, pk, event = null }) => {
  const navigate = useNavigate();
  const actionClick = () => {
    navigate(`${url}/${pk}`);
  };
  return url ? (
    <div className={styles["action"]} onClick={actionClick}>
      <div>{title}</div>
      <span className={styles["border"]}></span>
    </div>
  ) : (
    <div
      className={styles["action"]}
      onClick={() => {
        event(pk);
      }}
    >
      <div>{title}</div>
      <span className={styles["border"]}></span>
    </div>
  );
};

export default ActionButton;
