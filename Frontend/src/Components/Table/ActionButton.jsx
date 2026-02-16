import styles from "./Table.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const ActionButton = ({ url = null, title, pk, event = null }) => {
  const navigate = useNavigate();
  const actionClick = () => {
    navigate(`${url}/${pk}`);
  };
  const { t } = useTranslation();
  return url ? (
    <div className={styles["action"]} onClick={actionClick}>
      <div>{t(title)}</div>
      <span className={styles["border"]}></span>
    </div>
  ) : (
    <div
      className={styles["action"]}
      onClick={() => {
        event(pk);
      }}
    >
      <div>{t(title)}</div>
      <span className={styles["border"]}></span>
    </div>
  );
};

export default ActionButton;
