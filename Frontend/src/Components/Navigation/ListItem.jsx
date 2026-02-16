import styles from "./Navigation.module.css";
import Active from "./Active";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
const ListItem = ({ title, Logo, link, active, isResizing }) => {
  const { t, i18n } = useTranslation();
  return (
    <Link className={styles["listItem"]} to={link}>
      {Logo}
      <span>{t(title)}</span>
      {active && i18n.isInitialized && <Active isResizing={isResizing} />}
    </Link>
  );
};

export default ListItem;
