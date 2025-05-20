import styles from "./FormContainer.module.css";
import LinearProgress from "@mui/material/LinearProgress";
const FormContainer = ({ children, title, isLoading }) => {
  return (
    <div className={styles["staffFromContainer"]}>
      {isLoading && (
        <div className={styles["progress"]}>
          <LinearProgress color="secondary" />
        </div>
      )}
      <div className={`${styles["form"]} ${isLoading && styles["loading"]}`}>
        <span>{title}</span>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default FormContainer;
