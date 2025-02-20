import styles from "./Button.module.css";
import { Link } from "react-router-dom";
function Button({ title, onSubmit, style, link = undefined, value = null }) {
  return (
    <button
      type="submit"
      className={styles["button"]}
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
          {title}
        </Link>
      ) : (
        <>{title}</>
      )}
    </button>
  );
}

export default Button;
