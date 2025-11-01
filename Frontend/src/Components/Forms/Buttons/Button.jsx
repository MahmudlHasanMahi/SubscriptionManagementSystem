import styles from "./Button.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function Button({
  title,
  onSubmit,
  style,
  link = undefined,
  value = null,
  disable = false,
  onClick,
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      type={!disable ? "submit" : "button"}
      className={`${styles["button"]} ${disable && styles["disable"]}`}
      style={style}
      onSubmit={onSubmit}
    >
      {link ? (
        <Link
          to={link}
          type="submit"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            textDecoration: "none",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          {t(title)}
        </Link>
      ) : (
        <>{t(title)}</>
      )}
    </button>
  );
}

export default Button;
