import styles from "./FormContainer.module.css";
import LinearProgress from "@mui/material/LinearProgress";
const FormContainer = ({
  children,
  title,
  isLoading,
  disable = false,
  style = null,
}) => {
  return (
    <div className={styles["staffFromContainer"]}>
      {isLoading && (
        <div className={styles["progress"]}>
          <LinearProgress color="secondary" />
        </div>
      )}
      <div className={styles["form"]}>
        {isLoading || (disable && <div className={styles["loading"]}></div>)}
        <span>{title}</span>
        <div style={style}>{children}</div>
      </div>
    </div>
  );
};

export default FormContainer;
