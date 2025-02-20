import styles from "./FormContainer.module.css";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
const FormContainer = ({ children, title, isLoading }) => {
  return (
    <div className={styles["staffFromContainer"]}>
      {isLoading && (
        <div className={styles["progress"]}>
          <LinearProgress color="secondary" />
        </div>
      )}
      <span>{title}</span>
      <div>{children}</div>
    </div>
  );
};

export default FormContainer;
